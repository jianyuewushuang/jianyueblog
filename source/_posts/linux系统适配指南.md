---
title: 2026年新电脑linux系统适配指南
date: 2026-11-15
categries: 技术文档
tags:
    - linux
    - kubuntu
excerpt: "AI神力"
---

## 设备环境

| 项 | 值 |
| --- | --- |
| 机型 | Lenovo YOGA Air 14 Ultra IPH11（Yoga Slim 7i Ultra Aura） |
| CPU | Core Ultra X7 358H |
| GPU | Arc B390 |
| 系统 | Ubuntu 26.04 |
| 文件系统 | btrfs |
| 电源 | S0/S4/S5 |
| 内核 | linux-oem-7.3 |

## 安装linux系统

> 在[双系统安装技术文档](https://blog.jianyuewushuang.top/2026/09/05/%E5%8F%8C%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85%E6%8A%80%E6%9C%AF%E6%96%87%E6%A1%A3/)这篇博文中有详细介绍

1. 在windows系统中关闭安全启动和bitlocker。
2. 从U盘启动kubuntu系统，并添加内核启动参数以正常使用键盘。
    在grub菜单中点`e`进入编辑模式，在`---quiet splash`后添加`i8042.dumbkbd`(中间有个空格)
3. 点`try kubuntu`，进入桌面连接网络后点`install kubuntu`。
4. 选择手动分区并按照分区安装。

## linux系统适配问题

### 合盖再打开黑屏

- 现象：合盖待机后开盖屏幕不亮、无响应，只能强制断电。
- 原因：本机只支持 s2idle，无S3睡眠模式；Xe 驱动显示节能特性在 s2idle 唤醒时不能恢复显示管线。
- 修复方式：修改内核参数。`xe.enable_psr=0 xe.enable_panel_replay=0 xe.enable_fbc=0 xe.enable_dc=0`
- 代价：待机功耗略升。

### 无法休眠

- 现象：休眠之后无法唤醒，只能重启。
- 原因：7.0.0-43 内核在`pm_test` 分级定位到 `devices` 级挂死。
- 修复方式：更新到7.3.0-1004-oem内核。

### 检测不到内置扬声器和麦克风

- 原因：
    1. 7.0内核`sof-soundwire` 声卡注册失败。
    2. `alsa-ucm-conf` 的 `cs35l56-bridge.conf`写的是`ConflictingDevice ["Headphones"]`，而本机 components 无 `hs:` 标签、不加载定义 `Headphones` 的文件。导致alsa-lib 严格校验失败，整个 HiFi verb 导入失败，只有 `auto_null`。
- 修复方式
    1. 更新到7.3内核，解决声卡注册问题。
    2. 把`ConflictingDevice` 包进 `If.hs_present` 条件块。
    3. 把`DP5RX1/2`改成`DP6RX1/2`。
    4. 把`PlaybackPCM "hw:${CardId},0"`改成`PlaybackPCM "hw:${CardId},2"`（本机 Speaker 是 device 2）。

## 脚本

### 修复脚本

#### `setup.sh`

```bash
#!/bin/bash
# 命令出错、变量没定义、管道中间环节失败都直接退出
set -euo pipefail
# 没有sudo权限就退出
[ "$EUID" -eq 0 ] || { echo "需要 sudo 权限"; exit 1; }

# 把所有被修改的系统配置文件备份到脚本目录下的 system-backup/<时间戳>/
SCRIPT_PATH=$(readlink -f -- "${BASH_SOURCE[0]}")
SCRIPT_DIR=$(dirname -- "$SCRIPT_PATH")
BACKUP_ROOT="$SCRIPT_DIR/system-backup"
mkdir -p -- "$BACKUP_ROOT"
BACKUP_RUN="$BACKUP_ROOT/$(date +%Y%m%d-%H%M%S)"
mkdir -- "$BACKUP_RUN"
chmod 0755 "$BACKUP_RUN"
MANIFEST="$BACKUP_RUN/MANIFEST.txt"
{
    printf '# 系统文件备份清单\n'
    printf '# 时间: %s\n' "$(date '+%F %T %Z')"
    printf '# 脚本: %s\n' "$SCRIPT_PATH"
    printf '# 原路径\t备份文件\t作用\n'
} > "$MANIFEST"

backup_file() {
    local src=$1 purpose=$2 dest
    if [ -e "$src" ]; then
        dest="$BACKUP_RUN$src"
        mkdir -p -- "$(dirname -- "$dest")"
        cp -a -- "$src" "$dest"
        printf '%s\t%s\t%s\n' "$src" "$dest" "$purpose" >> "$MANIFEST"
    else
        printf '%s\t%s\t%s\n' "$src" "新建备份路径" "$purpose" >> "$MANIFEST"
    fi
}

# 写入 KDE/非 root 用户休眠所需的 polkit 授权规则。
install_hibernate_polkit_rule() {
    backup_file /etc/polkit-1/rules.d/10-enable-hibernate.rules "polkit：KDE/非 root 用户休眠授权规则"
    install -d /etc/polkit-1/rules.d
    cat > /etc/polkit-1/rules.d/10-enable-hibernate.rules <<'EOF'
polkit.addRule(function(action, subject) {
    if ((action.id == "org.freedesktop.login1.hibernate" ||
         action.id == "org.freedesktop.login1.hibernate-multiple-sessions" ||
         action.id == "org.freedesktop.login1.handle-hibernate-key" ||
         action.id == "org.freedesktop.upower.hibernate") &&
        subject.isInGroup("sudo")) {
            return polkit.Result.YES;
    }
});
EOF
    chmod 0644 /etc/polkit-1/rules.d/10-enable-hibernate.rules
}

SWAP=/swap/swapfile
GRUB=/etc/default/grub
RESUMECONF=/etc/initramfs-tools/conf.d/resume
REFIND=/boot/refind_linux.conf
UCM=/usr/share/alsa/ucm2/sof-soundwire/cs35l56-bridge.conf
PAGE_SIZE=$(getconf PAGE_SIZE)
is_pos() { [[ "${1:-}" =~ ^[0-9]+$ ]] && [ "$1" -gt 0 ]; }
is_pos "$PAGE_SIZE" || { echo "无法获取系统页大小"; exit 1; }

# 确定桌面用户
TARGET_USER="${SUDO_USER:-}"
if [ -z "$TARGET_USER" ] || [ "$TARGET_USER" = root ]; then
    TARGET_USER=$(loginctl list-sessions --no-legend 2>/dev/null | awk '$3 != "root" && $3 != "" {print $3; exit}')
fi

# /swap 必须是独立挂载点，否则 swapfile 可能落在根子卷，重启后被 @swap 覆盖
if [ "$(findmnt -no TARGET -T /swap 2>/dev/null || true)" != "/swap" ]; then
    echo "错误: /swap 未作为独立挂载点挂载，中止"
    exit 1
fi
# 重启后 swap 依赖 fstab 自动激活；缺失则 hibernate 无法工作
if ! grep -Eq '^[[:space:]]*/swap/swapfile[[:space:]]+swap[[:space:]]+swap([[:space:]]|$)' /etc/fstab; then
    echo "错误: /etc/fstab 缺少 /swap/swapfile swap 条目，中止"
    exit 1
fi

# 装 7.3 内核，补齐声卡驱动，修复 S4 设备挂起缺陷
apt-get update
DEBIAN_FRONTEND=noninteractive NEEDRESTART_SUSPEND=1 apt-get install -y linux-oem-7.3

# 建 32G swapfile；现有 swap 已激活且不小于内存时复用，避免改变物理偏移
SWAP_TARGET_KB=$(( 32 * 1024 * 1024 ))
MEM_KB=$(awk '/^MemTotal:/{print $2}' /proc/meminfo)
[[ "$MEM_KB" =~ ^[0-9]+$ ]] && [ "$MEM_KB" -gt 0 ] || { echo "无法读取 MemTotal"; exit 1; }
if [ "$MEM_KB" -gt "$SWAP_TARGET_KB" ]; then
    echo "错误: 内存 ${MEM_KB} kB 超过 32G，固定 32G swap 不足，请先调整脚本中的 swap 大小"
    exit 1
fi
SWAP_MIN_KB=$MEM_KB
REUSE=0
if grep -q "^$SWAP[[:space:]]" /proc/swaps; then
    SWAP_KB=$(awk -v p="$SWAP" '$1==p{print $3; exit}' /proc/swaps)
    if [ -n "${SWAP_KB:-}" ] && [ "$SWAP_KB" -ge "$SWAP_MIN_KB" ] \
       && btrfs inspect-internal map-swapfile "$SWAP" >/dev/null 2>&1; then
        REUSE=1
    fi
fi
if [ "$REUSE" = 1 ]; then
    echo "服用现有 $SWAP 空间"
else
    if grep -q "^$SWAP[[:space:]]" /proc/swaps; then
        swapoff "$SWAP" || { echo "swapoff 失败"; exit 1; }
    fi
    rm -f "$SWAP"
    # swap空间需要大于等于内存大小，这条命令只能用于btrfs文件系统
    btrfs filesystem mkswapfile --size 32g --uuid clear "$SWAP"
    swapon "$SWAP"
    grep -q "^$SWAP[[:space:]]" /proc/swaps || { echo "$SWAP 未成为活动 swap"; exit 1; }
fi

# 获取 Swap 文件映射信息
MAP=$(btrfs inspect-internal map-swapfile "$SWAP" 2>&1) || true
# 获取简化偏移
RAW=$(btrfs inspect-internal map-swapfile -r "$SWAP" 2>/dev/null || true)
# 提取 Physical start
PHYS=$(printf '%s\n' "$MAP" | awk '/Physical start/{print $NF}')
# 提取 Resume offset
RESLBL=$(printf '%s\n' "$MAP" | awk '/Resume offset/{print $NF}')
# 获取底层设备
DEV=$(findmnt -no SOURCE -T "$SWAP" | sed 's/\[.*//' | head -1)

if is_pos "$RESLBL"; then
    OFFSET=$RESLBL
elif is_pos "$PHYS"; then
    OFFSET=$(( PHYS / PAGE_SIZE ))
elif is_pos "$RAW"; then
    if [ -b "$DEV" ] && [ "$(blkid -p -O $(( RAW * PAGE_SIZE )) "$DEV" -o value -s TYPE 2>/dev/null)" = swap ]; then
        OFFSET=$RAW
    elif [ -b "$DEV" ] && [ "$(blkid -p -O "$RAW" "$DEV" -o value -s TYPE 2>/dev/null)" = swap ]; then
        OFFSET=$(( RAW / PAGE_SIZE ))
    else
        echo "无法判定 -r=$RAW 的单位"; exit 1
    fi
else
    echo "取不到有效 resume_offset"; exit 1
fi

is_pos "$OFFSET" || { echo "OFFSET='$OFFSET' 非正整数"; exit 1; }

# blkid 交叉验证失败时终止
[ -b "$DEV" ] || { echo "错误: 无法确定 $SWAP 所在块设备"; exit 1; }
T=$(blkid -p -O $(( OFFSET * PAGE_SIZE )) "$DEV" -o value -s TYPE 2>/dev/null || true)
[ "$T" = swap ] || {
    echo "错误: 偏移 OFFSET*PAGE_SIZE 处不是 swap 头（TYPE=${T:-<空>}），中止"
    exit 1
}

# 获取 Swap 文件所在文件系统的 UUID
UUID=$(findmnt -no UUID -T "$SWAP")
# 检查 UUID 的规范格式
[[ "$UUID" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ ]] \
    || { echo "UUID 异常: '$UUID'"; exit 1; }

# 判定启动环境是GURB还是rEFInd
if [ -f "$REFIND" ]; then BOOT=refind; else BOOT=grub; fi

# 创建initramfs配置文件
install -d /etc/initramfs-tools/conf.d
backup_file "$RESUMECONF" "initramfs：休眠恢复设备配置"

# 将UUID写入initramfs配置文件，如果有这行，则替换，否则追加
if grep -qE '^[[:space:]]*RESUME=' "$RESUMECONF" 2>/dev/null; then
    sed -i -E "s|^[[:space:]]*RESUME=.*|RESUME=UUID=$UUID|" "$RESUMECONF"
else
    printf '\nRESUME=UUID=%s\n' "$UUID" >> "$RESUMECONF"
fi

# 修改xe内核启动参数，定位resume镜像
# python和shell混合编程
backup_file "$GRUB" "GRUB：默认内核启动参数"
python3 - "$UUID" "$OFFSET" <<'PY'
import pathlib, re, sys
uuid, offset = sys.argv[1], sys.argv[2]
p = pathlib.Path('/etc/default/grub'); t = p.read_text()
m = re.search(r"^(\s*GRUB_CMDLINE_LINUX_DEFAULT\s*=\s*)(['\"])(.*?)\2[ \t]*$", t, re.M)
if not m:
    raise SystemExit('找不到 GRUB_CMDLINE_LINUX_DEFAULT')
managed = ('xe.enable_psr=', 'xe.enable_panel_replay=', 'xe.enable_fbc=', 'xe.enable_dc=',
           'resume=', 'resume_offset=')
keep = [x for x in m.group(3).split() if not x.startswith(managed)]
add = ['xe.enable_psr=0', 'xe.enable_panel_replay=0', 'xe.enable_fbc=0', 'xe.enable_dc=0',
       'resume=UUID=' + uuid, 'resume_offset=' + offset]
p.write_text(t[:m.start()] + m.group(1) + "'" + ' '.join(keep + add) + "'" + t[m.end():])
PY

# rEFInd 环境开机 cmdline 来自 refind_linux.conf 每行 options
if [ "$BOOT" = refind ]; then
    backup_file "$REFIND" "rEFInd：启动参数"
    python3 - "$UUID" "$OFFSET" <<'PY'
import pathlib, re, sys
uuid, offset = sys.argv[1], sys.argv[2]
p = pathlib.Path('/boot/refind_linux.conf')
managed = ('xe.enable_psr=', 'xe.enable_panel_replay=', 'xe.enable_fbc=', 'xe.enable_dc=',
           'resume=', 'resume_offset=')
add = ['xe.enable_psr=0', 'xe.enable_panel_replay=0', 'xe.enable_fbc=0', 'xe.enable_dc=0',
       'resume=UUID=' + uuid, 'resume_offset=' + offset]
out, n = [], 0
for line in p.read_text().splitlines(keepends=True):
    nl = '\n' if line.endswith('\n') else ''
    m = re.match(r'^(\s*"[^"]*"\s*)("[^"]*")(.*)$', line.rstrip('\n'))
    if not m:                       # 注释 / 空行，原样保留
        out.append(line); continue
    opts = m.group(2)[1:-1]
    keep = [x for x in opts.split() if not x.startswith(managed)]
    out.append(m.group(1) + '"' + ' '.join(keep + add) + '"' + m.group(3) + nl)
    n += 1
if n == 0:
    raise SystemExit('refind_linux.conf 里没有可解析的 options 行，中止')
p.write_text(''.join(out))
PY
fi

# 修复音频部分
backup_file "$UCM" "ALSA UCM：内置扬声器/耳机音频配置"
# 检查耳机相关变量 HeadsetCodec1 中是否包含 cs42l43。如果满足条件，则声明 Headphones 设备冲突
# 必须以这台机器的实际 ALSA 设备枚举和 UCM 设计为依据
python3 - "$UCM" <<'PY'
import pathlib, sys
p = pathlib.Path(sys.argv[1]); t = p.read_text()
a = '\tConflictingDevice [\n\t\t"Headphones"\n\t]\n\n'
b = ('\tIf.hs_present {\n\t\tCondition {\n\t\t\tType String\n'
     '\t\t\tHaystack "${var:HeadsetCodec1}"\n\t\t\tNeedle "cs42l43"\n'
     '\t\t}\n\t\tTrue.ConflictingDevice [\n\t\t\t"Headphones"\n\t\t]\n\t}\n\n')
if a in t:   # 幂等：已是新版则跳过
    t = t.replace(a, b, 1)
    t = t.replace("'DP5RX1'", "'DP6RX1'").replace("'DP5RX2'", "'DP6RX2'")
    t = t.replace('PlaybackPCM "hw:${CardId},0"', 'PlaybackPCM "hw:${CardId},2"')
    p.write_text(t)
PY

# 安装休眠 polkit 授权规则
install_hibernate_polkit_rule

# 检查并重置 pm_test为none
PM=$(cat /sys/power/pm_test 2>/dev/null || echo '?')
if [ "$PM" != "?" ] && [[ "$PM" != *"[none]"* && "$PM" != "none" ]]; then
    printf 'none' > /sys/power/pm_test
    echo "pm_test 已复位为 [none]（原本 $PM）"
fi

# 更新所有已安装内核对应的 initramfs
update-initramfs -u -k all
# 重新生成 GRUB 配置
if [ -f /boot/grub/grub.cfg ]; then
    backup_file /boot/grub/grub.cfg "GRUB：生成的启动配置"
fi
update-grub
# 让 systemd 重新读取服务单元配置
systemctl daemon-reload

# 记录不复制的大文件
{
    printf '\n# 未备份\n'
    printf '%s\t%s\t%s\n' "$SWAP" "-" "32G swap 文件，重建即可，不复制"
    printf '%s\t%s\t%s\n' "/boot/initrd.img-*" "-" "initramfs 由 update-initramfs -u -k all 重建"
    printf '%s\t%s\t%s\n' "linux-oem-7.3 (apt)" "-" "内核包由 apt 管理，可重装，不作为文件备份"
} >> "$MANIFEST"
echo "系统文件已备份到: $BACKUP_RUN（清单: $MANIFEST）"

# 输出结果
echo "<== 写入结果 ==>"

# 普通用户授权由 polkit 规则决定：以桌面进程为 polkit 主体做实际验证
DP=""
if [ -n "${TARGET_USER:-}" ]; then
    DP=$(pgrep -u "$TARGET_USER" -x plasmashell -n 2>/dev/null || true)
fi
if [ -n "$DP" ]; then
    if pkcheck --action-id org.freedesktop.login1.hibernate --process "$DP" >/dev/null 2>&1; then
        echo "polkit 休眠授权: yes"
    else
        echo "polkit 休眠授权: no，检查 10-enable-hibernate.rules 是否生效"
    fi
fi

# root 的 CanHibernate 仅作参考
CH=$(busctl call org.freedesktop.login1 /org/freedesktop/login1 \
       org.freedesktop.login1.Manager CanHibernate 2>/dev/null \
     | awk '{gsub(/"/,"",$2); print $2}' || true)
echo "CanHibernate(root): ${CH:-查询失败}（期望 yes；若非 yes，排查 swap 大小与内存占用）"
echo "提示：若 KDE 菜单仍未显示休眠，请重新登录或执行 systemctl --user restart plasma-plasmashell.service"

printf '  %-14s %s\n' "模式" "$BOOT"
printf '  %-14s %s\n' "resume_offset" "$OFFSET"
printf '  %-14s %s\n' "UUID" "$UUID"
printf '  %-14s %s\n' "GRUB" "$(grep -oE 'resume_offset=[0-9]+' "$GRUB" | sort -u | tr '\n' ' ')"
printf '  %-14s %s\n' "grub.cfg" "$(grep -oE 'resume_offset=[0-9]+' /boot/grub/grub.cfg | sort -u | tr '\n' ' ')"
if [ "$BOOT" = refind ]; then
    printf '  %-14s %s\n' "refind" "$(grep -oE 'resume_offset=[0-9]+' "$REFIND" | sort -u | tr '\n' ' ')"
fi
printf '  %-14s %s\n' "conf.d/resume" "$(cat "$RESUMECONF")"
printf '  %-14s %s\n' "cmdline" "$(grep -oE 'resume_offset=[0-9]+' /proc/cmdline | head -1)"
```

### 诊断脚本

#### `verify.sh`

```bash
#!/bin/bash

if [ "$EUID" -eq 0 ]; then
    echo "请用普通用户运行：bash verify.sh；root 项请用 sudo bash verify-root.sh"
    exit 1
fi

REFIND=/boot/refind_linux.conf
SWAP=/swap/swapfile
RESUMECONF=/etc/initramfs-tools/conf.d/resume
BAD=0
BYPASS=0
UNKNOWN=0

row() { printf '  %-3s %-48s | 期望 %s\n' "$1" "$2" "$3"; }
chk() {
    if [ "$1" = 1 ]; then
        row OK "$2" "$3"
    else
        row NG "$2" "$3"
        BAD=$((BAD + 1))
    fi
}
info() { row -- "$1" "$2"; }

# 读取候选启动配置中的 resume_offset。若配置含多个不同值，标记为歧义。
CFGVAL=""
CFGCOUNT=0
if [ -f "$REFIND" ]; then
    BOOT=rEFInd
    mapfile -t CFGVALS < <(grep -oE 'resume_offset=[0-9]+' "$REFIND" 2>/dev/null |
        cut -d= -f2 | sort -u)
else
    BOOT=GRUB
    mapfile -t CFGVALS < <(
        grep -E '^[[:space:]]*GRUB_CMDLINE_LINUX_DEFAULT=' /etc/default/grub 2>/dev/null |
        grep -oE 'resume_offset=[0-9]+' | cut -d= -f2 | sort -u
    )
fi
CFGCOUNT=${#CFGVALS[@]}
[ "$CFGCOUNT" -eq 1 ] && CFGVAL=${CFGVALS[0]}

echo
echo "开机与休眠"

K=$(uname -r)
chk "$( [[ "$K" == 7.3.*-oem ]] && echo 1 || echo 0 )" "内核: $K" "7.3.x-oem"

# 逐项固定字符串匹配，避免正则表达式中的点号匹配任意字符。
XE_OK=1
for p in xe.enable_psr=0 xe.enable_panel_replay=0 xe.enable_fbc=0 xe.enable_dc=0; do
    tr ' ' '\n' < /proc/cmdline | grep -Fxq "$p" || XE_OK=0
done
XE_SHOW=$(grep -oE 'xe\.[a-z_]+=0' /proc/cmdline | sort -u | tr '\n' ' ')
chk "$XE_OK" "xe 参数: ${XE_SHOW:-<无>}" "四个指定参数均为 0"

# resume UUID 应指向 swapfile 所在文件系统。
RU=$(tr ' ' '\n' < /proc/cmdline | grep '^resume=' | head -1)
RU_UUID=${RU#resume=UUID=}
SWAP_UUID=$(findmnt -no UUID -T "$SWAP" 2>/dev/null || true)
RU_OK=0
[ -n "$RU_UUID" ] && [ -n "$SWAP_UUID" ] &&
    [ "${RU_UUID,,}" = "${SWAP_UUID,,}" ] && RU_OK=1
chk "$RU_OK" "resume: ${RU:-<无>}" "UUID=${SWAP_UUID:-<无>}"

CMD=$(tr ' ' '\n' < /proc/cmdline | grep '^resume_offset=' | head -1 | cut -d= -f2)
SYS=$(cat /sys/power/resume_offset 2>/dev/null || true)
OFF_OK=1
[[ "$CMD" =~ ^[0-9]+$ ]] && [ "$CMD" -gt 0 ] || OFF_OK=0
[ "$CMD" = "$SYS" ] || OFF_OK=0
[ "$CFGCOUNT" -eq 1 ] && [ "$CMD" = "$CFGVAL" ] || OFF_OK=0
OFF_SHOW="resume_offset: ${CMD:-<无>}"
[ "$OFF_OK" = 0 ] && OFF_SHOW="$OFF_SHOW (sysfs=${SYS:-?} 配置值数量=$CFGCOUNT 配置=${CFGVAL:-?})"
chk "$OFF_OK" "$OFF_SHOW" "非 0，且 cmdline=sysfs=唯一配置值"

info "启动配置候选: $BOOT → $([ "$BOOT" = GRUB ] && echo /etc/default/grub || echo "$REFIND")" \
    "候选配置文件；不等同于已确认当前启动项"

# initramfs 配置由 root 脚本做权威检查；普通用户无法读取时仅提示。
if [ -r "$RESUMECONF" ]; then
    CONF_UUID=$(sed -n 's/^RESUME=UUID=//p' "$RESUMECONF" | head -1)
    chk "$( [ -n "$CONF_UUID" ] && [ -n "$SWAP_UUID" ] &&
        [ "${CONF_UUID,,}" = "${SWAP_UUID,,}" ] && echo 1 || echo 0 )" \
        "initramfs RESUME: ${CONF_UUID:-<无>}" "UUID=${SWAP_UUID:-<无>}"
else
    info "initramfs RESUME: 无法读取" "由 sudo bash verify-root.sh 检查"
fi

# /swap 挂载点与 fstab 条目。
TGT=$(findmnt -no TARGET -T /swap 2>/dev/null || true)
chk "$( [ "$TGT" = /swap ] && echo 1 || echo 0 )" "/swap 挂载点: ${TGT:-<无>}" "/swap 独立挂载"

FSTAB_LINE=$(grep -E '^[[:space:]]*/swap/swapfile[[:space:]]+swap[[:space:]]+swap([[:space:]]|$)' \
    /etc/fstab 2>/dev/null | head -1)
chk "$( [ -n "$FSTAB_LINE" ] && echo 1 || echo 0 )" \
    "fstab: ${FSTAB_LINE:-<无>}" "存在 /swap/swapfile swap"

# 直接确认指定 swapfile 是否已启用。
SWAP_ACTIVE=0
if command -v swapon >/dev/null 2>&1; then
    while IFS= read -r active; do
        [ -n "$active" ] || continue
        if [ "$active" = "$SWAP" ] ||
           { [ -e "$active" ] && [ "$(readlink -f "$active")" = "$(readlink -f "$SWAP")" ]; }; then
            SWAP_ACTIVE=1
            break
        fi
    done < <(swapon --noheadings --raw --show=NAME 2>/dev/null)
fi
chk "$SWAP_ACTIVE" "swapfile 启用: $([ "$SWAP_ACTIVE" = 1 ] && echo yes || echo no)" "$SWAP 已启用"

DISK=$(grep -oE '\[[a-z_]+\]' /sys/power/disk 2>/dev/null | tr -d '[]')
info "disk 模式: ${DISK:-<无>}" "platform（默认）"
STATE=$(cat /sys/power/state 2>/dev/null || true)
chk "$( case " $STATE " in *" disk "*) echo 1;; *) echo 0;; esac )" \
    "kernel disk 支持: ${STATE:-<无>}" "包含 disk"

PM=$(grep -oE '\[[a-z]+\]' /sys/power/pm_test 2>/dev/null | head -1 | tr -d '[]')
chk "$( [ "$PM" = none ] && echo 1 || echo 0 )" "pm_test: ${PM:-未知}" "[none]"

# 用 /proc/meminfo 的 KiB 数值比较，避免 free -h 舍入造成误判。
MEM_KB=$(awk '/^MemTotal:/{print $2}' /proc/meminfo)
SWAP_KB=$(awk '/^SwapTotal:/{print $2}' /proc/meminfo)
CAP_OK=0
[[ "$MEM_KB" =~ ^[0-9]+$ && "$SWAP_KB" =~ ^[0-9]+$ ]] &&
    [ "$SWAP_KB" -ge "$MEM_KB" ] && CAP_OK=1
chk "$CAP_OK" "Swap: $(( ${SWAP_KB:-0} / 1024 / 1024 )) GiB" \
    "Swap 总量不小于内存（MemTotal=$(( ${MEM_KB:-0} / 1024 / 1024 )) GiB）"

CH=$(busctl call org.freedesktop.login1 /org/freedesktop/login1 \
    org.freedesktop.login1.Manager CanHibernate 2>/dev/null |
    awk '{gsub(/"/,"",$2); print $2}')
chk "$( [ "$CH" = yes ] && echo 1 || echo 0 )" "CanHibernate: ${CH:-<无>}" "yes"

echo
echo "休眠 userspace"
for f in /etc/systemd/system/systemd-logind.service.d/zz-hibernate-bypass.conf \
         /etc/systemd/system/systemd-hibernate.service.d/zz-direct-hibernate.conf \
         /usr/local/sbin/hibernate-direct.sh; do
    d=${f%/*}
    if [ -e "$f" ]; then
        row NG "绕过文件存在: ${f##*/}" "不存在"
        BYPASS=$((BYPASS + 1))
        BAD=$((BAD + 1))
    elif [ -d "$d" ] && [ ! -x "$d" ]; then
        UNKNOWN=$((UNKNOWN + 1))
    fi
done
[ "$UNKNOWN" -gt 0 ] &&
    info "绕过文件: $UNKNOWN 项无法核对" "全部不存在；用 sudo bash verify-root.sh 复核"

PK=0
if command -v pkcheck >/dev/null 2>&1 &&
   pkcheck --action-id org.freedesktop.login1.hibernate --process "$$" >/dev/null 2>&1; then
    PK=1
fi
chk "$PK" "polkit 休眠授权: $([ "$PK" = 1 ] && echo yes || echo no)" "yes"

CAT=$(systemctl cat systemd-hibernate.service 2>/dev/null || true)
DROPS=$(printf '%s\n' "$CAT" |
    grep -Ec '^# .*/systemd-hibernate\.service\.d/[^/]+\.conf$' || true)
NEXEC=$(printf '%s\n' "$CAT" | grep -c '^ExecStart=' || true)
EXE=$(printf '%s\n' "$CAT" | grep '^ExecStart=' | tail -1)
chk "$( [ "$DROPS" -eq 0 ] && [ "$NEXEC" -eq 1 ] &&
    [ "$EXE" = 'ExecStart=/usr/lib/systemd/systemd-sleep hibernate' ] &&
    echo 1 || echo 0 )" \
    "hibernate ExecStart: ${EXE#ExecStart=} (drop-in=$DROPS, ExecStart=$NEXEC)" \
    "无 drop-in，1 条原生 ExecStart"

echo
echo "音频"
CARD=$(grep -m1 -oE '\[[a-zA-Z0-9_-]+' /proc/asound/cards 2>/dev/null | tr -d '[')
chk "$( [ "$CARD" = sofsoundwire ] && echo 1 || echo 0 )" \
    "声卡: ${CARD:-<无>}" "sof-soundwire（cards 里 [sofsoundwire]）"

if pactl info >/dev/null 2>&1; then
    SINK=$(pactl list short sinks 2>/dev/null | grep -c 'HiFi__Speaker' || true)
    PROF=$(pactl list cards 2>/dev/null |
        awk '/Name:.*sof_sdw/ {target=1} target && /Active Profile:/ {print $3; exit}')
    chk "$( [ "$SINK" -ge 1 ] && echo 1 || echo 0 )" \
        "输出 sink: HiFi__Speaker ×$SINK" "出现 HiFi__Speaker"
    chk "$( [ "$PROF" = HiFi ] && echo 1 || echo 0 )" \
        "SOF 声卡 Active Profile: ${PROF:-<无>}" "HiFi"
else
    info "sink / Profile: pactl 不可用" "HiFi__Speaker / HiFi"
fi

echo
echo "结论"
if [ "$BAD" -eq 0 ]; then
    echo "  OK：普通用户检查全部通过"
    exit 0
else
    echo "  NG：$BAD 项不符（NG = 不符合期望；-- 为信息项，不判定）"
    [ "$BYPASS" -gt 0 ] && echo "     存在旧版绕过文件：确认后删除，并执行 sudo systemctl daemon-reload"
    [ "$OFF_OK" != 1 ] && echo "     resume_offset 异常，请检查 swapfile、启动配置及当前启动项"
    exit 1
fi
```

#### `verify-root.sh`

```bash
#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "请用 sudo 运行：sudo bash verify-root.sh"
    exit 1
fi

SWAP=/swap/swapfile
REFIND=/boot/refind_linux.conf
RESUMECONF=/etc/initramfs-tools/conf.d/resume
RULE=/etc/polkit-1/rules.d/10-enable-hibernate.rules
PAGE_SIZE=$(getconf PAGE_SIZE 2>/dev/null || echo 4096)
BAD=0

row() { printf '  %-3s %-48s | 期望 %s\n' "$1" "$2" "$3"; }
chk() {
    if [ "$1" = 1 ]; then
        row OK "$2" "$3"
    else
        row NG "$2" "$3"
        BAD=$((BAD + 1))
    fi
}
info() { row -- "$1" "$2"; }

echo
echo "root 专项：swapfile 物理位置"

if [ ! -f "$SWAP" ]; then
    chk 0 "swapfile: $SWAP 不存在" "存在的 Btrfs swapfile"
    MAP=""
    EXP=""
else
    MAP=$(btrfs inspect-internal map-swapfile "$SWAP" 2>/dev/null || true)
    EXP=$(printf '%s\n' "$MAP" | awk '/Resume offset/{print $NF; exit}')
    EXP=${EXP//,/}
    chk "$( [[ "$EXP" =~ ^[0-9]+$ ]] && [ "$EXP" -gt 0 ] 2>/dev/null && echo 1 || echo 0 )" \
        "swapfile 偏移: ${EXP:-<无>}" "可读取的非零 Resume offset"
fi

CMD=$(tr ' ' '\n' < /proc/cmdline | grep '^resume_offset=' | head -1 | cut -d= -f2)
SYS=$(cat /sys/power/resume_offset 2>/dev/null || true)

CFGCOUNT=0
CFGVAL=""
if [ -f "$REFIND" ]; then
    mapfile -t CFGVALS < <(grep -oE 'resume_offset=[0-9]+' "$REFIND" 2>/dev/null |
        cut -d= -f2 | sort -u)
else
    mapfile -t CFGVALS < <(
        grep -E '^[[:space:]]*GRUB_CMDLINE_LINUX_DEFAULT=' /etc/default/grub 2>/dev/null |
        grep -oE 'resume_offset=[0-9]+' | cut -d= -f2 | sort -u
    )
fi
CFGCOUNT=${#CFGVALS[@]}
[ "$CFGCOUNT" -eq 1 ] && CFGVAL=${CFGVALS[0]}

OFFSET_OK=1
[[ "$EXP" =~ ^[0-9]+$ && "$EXP" -gt 0 ]] || OFFSET_OK=0
[ "$EXP" = "$CMD" ] && [ "$EXP" = "$SYS" ] || OFFSET_OK=0
[ "$CFGCOUNT" -eq 1 ] && [ "$EXP" = "$CFGVAL" ] || OFFSET_OK=0
chk "$OFFSET_OK" \
    "偏移一致性: file=${EXP:-?} cmdline=${CMD:-?} sysfs=${SYS:-?} 配置=${CFGVAL:-?}（配置值数量=$CFGCOUNT）" \
    "Btrfs、cmdline、sysfs、唯一启动配置值四处一致"

DEV=$(findmnt -no SOURCE -T "$SWAP" 2>/dev/null | sed 's/\[.*//' | head -1)
if [ -b "$DEV" ] && [[ "$EXP" =~ ^[0-9]+$ ]] && [ "$EXP" -gt 0 ] &&
   [[ "$PAGE_SIZE" =~ ^[0-9]+$ ]]; then
    OFFSET_BYTES=$((EXP * PAGE_SIZE))
    T=$(blkid -p -O "$OFFSET_BYTES" "$DEV" -o value -s TYPE 2>/dev/null || true)
    chk "$( [ "$T" = swap ] && echo 1 || echo 0 )" "blkid 校验: ${T:-<空>}" "swap 头"
else
    chk 0 "blkid 校验: 无法取得有效块设备或 offset" "swap 头"
fi

SIZE_BYTES=$(stat -c %s "$SWAP" 2>/dev/null || echo 0)
SIZE_GIB=$((SIZE_BYTES / 1024 / 1024 / 1024))
chk "$( [ "$SIZE_BYTES" -ge $((30 * 1024 * 1024 * 1024)) ] && echo 1 || echo 0 )" \
    "swapfile 大小: ${SIZE_GIB} GiB" "≥30 GiB"

SWAP_ACTIVE=0
while IFS= read -r active; do
    [ -n "$active" ] || continue
    if [ "$active" = "$SWAP" ] ||
       { [ -e "$active" ] && [ "$(readlink -f "$active")" = "$(readlink -f "$SWAP")" ]; }; then
        SWAP_ACTIVE=1
        break
    fi
done < <(swapon --noheadings --raw --show=NAME 2>/dev/null)
chk "$SWAP_ACTIVE" "swapfile 启用: $([ "$SWAP_ACTIVE" = 1 ] && echo yes || echo no)" "$SWAP 已启用"

echo
echo "root 专项：系统配置"
TGT=$(findmnt -no TARGET -T /swap 2>/dev/null || true)
chk "$( [ "$TGT" = /swap ] && echo 1 || echo 0 )" "/swap 挂载点: ${TGT:-<无>}" "/swap 独立挂载"

FSTAB_LINE=$(grep -E '^[[:space:]]*/swap/swapfile[[:space:]]+swap[[:space:]]+swap([[:space:]]|$)' \
    /etc/fstab 2>/dev/null | head -1)
chk "$( [ -n "$FSTAB_LINE" ] && echo 1 || echo 0 )" \
    "fstab: ${FSTAB_LINE:-<无>}" "存在 /swap/swapfile swap"

SWAP_UUID=$(findmnt -no UUID -T "$SWAP" 2>/dev/null || true)
CONF_UUID=$(sed -n 's/^RESUME=UUID=//p' "$RESUMECONF" 2>/dev/null | head -1)
chk "$( [ -n "$SWAP_UUID" ] && [ "${CONF_UUID,,}" = "${SWAP_UUID,,}" ] && echo 1 || echo 0 )" \
    "initramfs RESUME: ${CONF_UUID:-<无>}" "UUID=${SWAP_UUID:-<无>}"

echo
echo "polkit 规则与服务覆盖"
if [ -f "$RULE" ]; then
    RULE_MODE=$(stat -c '%U:%G %a' "$RULE")
    RULE_OK=1
    [ "$RULE_MODE" = "root:root 644" ] || RULE_OK=0
    grep -Fq 'subject.isInGroup("sudo")' "$RULE" || RULE_OK=0
    for a in org.freedesktop.login1.hibernate \
             org.freedesktop.login1.hibernate-multiple-sessions \
             org.freedesktop.login1.handle-hibernate-key \
             org.freedesktop.upower.hibernate; do
        grep -Fq "$a" "$RULE" || RULE_OK=0
    done
    # 忽略整行注释；这是结构性检查，不等同于 JavaScript/polkit 语义解析。
    awk '
        /^[[:space:]]*\/\// { next }
        /polkit\.addRule[[:space:]]*\(/ { inrule=1 }
        inrule && /subject\.isInGroup\("sudo"\)/ { group=1 }
        inrule && /return[[:space:]]+polkit\.Result\.YES[[:space:]]*;/ {
            if (group) yes=1
        }
        END { exit !(inrule && group && yes) }
    ' "$RULE" || RULE_OK=0
    chk "$RULE_OK" "polkit 规则: $RULE_MODE" "root:root 644，包含 sudo 组授权及目标 action"
else
    chk 0 "polkit 规则: <不存在>" "root:root 644，按 sudo 组授权"
fi

# 只在同一规则目录中存在 Ubuntu 规则时比较文件名顺序。
UBUNTU_RULE=""
for candidate in /etc/polkit-1/rules.d/com.ubuntu.desktop.rules \
                 /usr/share/polkit-1/rules.d/com.ubuntu.desktop.rules; do
    [ -f "$candidate" ] && { UBUNTU_RULE=$candidate; break; }
done
if [ -n "$UBUNTU_RULE" ] && [ "$(dirname "$UBUNTU_RULE")" = "$(dirname "$RULE")" ]; then
    if [[ "${RULE##*/}" < "${UBUNTU_RULE##*/}" ]]; then
        chk 1 "规则顺序: ${RULE##*/} 早于 ${UBUNTU_RULE##*/}" "自定义规则文件名排序靠前"
    else
        chk 0 "规则顺序: ${RULE##*/} 不早于 ${UBUNTU_RULE##*/}" "自定义规则文件名排序靠前"
    fi
else
    info "规则顺序: 未找到同目录 Ubuntu 规则" "按实际规则加载顺序另行确认"
fi

for f in /etc/systemd/system/systemd-logind.service.d/zz-hibernate-bypass.conf \
         /etc/systemd/system/systemd-hibernate.service.d/zz-direct-hibernate.conf \
         /usr/local/sbin/hibernate-direct.sh; do
    chk "$( [ -e "$f" ] && echo 0 || echo 1 )" "绕过文件: ${f##*/}" "不存在"
done

CAT=$(systemctl cat systemd-hibernate.service 2>/dev/null || true)
DROPS=$(printf '%s\n' "$CAT" |
    grep -Ec '^# .*/systemd-hibernate\.service\.d/[^/]+\.conf$' || true)
NEXEC=$(printf '%s\n' "$CAT" | grep -c '^ExecStart=' || true)
EXE=$(printf '%s\n' "$CAT" | grep '^ExecStart=' | tail -1)
chk "$( [ "$DROPS" -eq 0 ] && [ "$NEXEC" -eq 1 ] &&
    [ "$EXE" = 'ExecStart=/usr/lib/systemd/systemd-sleep hibernate' ] &&
    echo 1 || echo 0 )" \
    "hibernate ExecStart: ${EXE#ExecStart=} (drop-in=$DROPS, ExecStart=$NEXEC)" \
    "无已加载 drop-in，1 条原生 ExecStart"

echo
echo "root 专项：启动文件"
if [ -f "$REFIND" ]; then
    chk "$( grep -Fq "resume=UUID=$SWAP_UUID" "$REFIND" && echo 1 || echo 0 )" \
        "rEFInd resume UUID" "UUID=$SWAP_UUID"
    chk "$( grep -Fq "resume_offset=$EXP" "$REFIND" && echo 1 || echo 0 )" \
        "rEFInd resume_offset" "$EXP"
else
    chk "$( [ -n "$SWAP_UUID" ] && grep -Fq "resume=UUID=$SWAP_UUID" /boot/grub/grub.cfg 2>/dev/null && echo 1 || echo 0 )" \
        "grub.cfg resume UUID" "UUID=$SWAP_UUID"
    chk "$( [ -n "$EXP" ] && grep -Fq "resume_offset=$EXP" /boot/grub/grub.cfg 2>/dev/null && echo 1 || echo 0 )" \
        "grub.cfg resume_offset" "$EXP"
fi

PM=$(grep -oE '\[[a-z]+\]' /sys/power/pm_test 2>/dev/null | head -1 | tr -d '[]')
chk "$( [ "$PM" = none ] && echo 1 || echo 0 )" "pm_test: ${PM:-未知}" "[none]"

echo
echo "结论"
if [ "$BAD" -eq 0 ]; then
    echo "  OK：root 专项检查全部通过"
    exit 0
else
    echo "  NG：$BAD 项不符"
    exit 1
fi
```

#### 执行方式

```bash
sudo bash ./setup.sh
sudo reboot
bash ./verify.sh
sudo bash ./verify-root.sh
# 测试休眠
sudo systemctl hibernate
```

## 电池策略

本机 7.3 内核用新版 `ideapad_laptop`，充电策略由sysfs接口控制。
`/sys/class/power_supply/BAT0/charge_types`

### 模式

| 模式 | 驱动层动作 | 充电上限 |
| --- | --- | --- |
| `Fast` | 关保养 + 开快充（`SBMC_RAPID_CHARGE_ON`） | 100% |
| `Standard` | 关快充 + 关保养 | 100% |
| `Long_Life` | 开保养 + 关快充（`SBMC_CONSERVATION_ON`） | 约 60–80% |

### 切换命令

```bash
# 看当前模式
cat /sys/class/power_supply/BAT0/charge_types
# 切换
echo Standard | sudo tee /sys/class/power_supply/BAT0/charge_types # 标准满充
echo Fast | sudo tee /sys/class/power_supply/BAT0/charge_types # 快充满充
echo Long_Life | sudo tee /sys/class/power_supply/BAT0/charge_types # 保养限充
# 验证
cat /sys/class/power_supply/BAT0/charge_types
cat /sys/class/power_supply/BAT0/status /sys/class/power_supply/BAT0/capacity
```
