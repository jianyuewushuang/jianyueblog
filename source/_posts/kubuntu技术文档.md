---
title: kubuntu技术文档
date: 2026-07-05
tags: 技术文档
---

## 安装btrfs格式的kubuntu

1. 选择手动分区
2. 删除所有分区
3. 创建500MB,FAT32文件格式的EFI系统分区，挂载点`/boot/efi`，标签`boot`
4. 把剩余所有空间创建为btrfs文件格式，挂载点为/
5. 安装

## 备份

### TimeShift系统备份

#### 安装

```bash
sudo apt update
sudo apt install timeshift -y
```

图形化配置

#### 配置apt前后自动创建快照

```bash
git clone https://github.com/wmutschl/timeshift-autosnap-apt.git
cd timeshift-autosnap-apt
sudo make install
```

> 临时跳过自动快照`sudo SKIP_AUTOSNAP=1 apt install 包名`

#### 关键系统文件变更自动快照

```bash
# 安装监控工具
sudo apt install inotify-tools
# 创建监控脚本
sudo nano /usr/local/bin/timeshift-watch-etc.sh
```

添加

```bash
#!/bin/bash
# 防抖延时，多次连续修改只触发一次快照
DELAY=20
LAST_RUN=0
inotifywait -m -e modify,create,delete,move /etc /boot | while read path action file; do
    NOW=$(date +%s)
    # 距离上次快照不足延迟时间则跳过
    if [ $((NOW - LAST_RUN)) -lt $DELAY ]; then
        continue
    fi
    # 延时等待操作结束
    sleep $DELAY
    timeshift --create --comments "Config modified: $path$file ($action)" --tags C --scripted
    LAST_RUN=$(date +%s)
done
```

```bash
sudo chmod +x /usr/local/bin/timeshift-watch-etc.sh
# 设置为开机自启（systemd 服务）
# 创建 systemd 服务文件
sudo nano /etc/systemd/system/timeshift-watch.service
```

写入

```ini
[Unit]
Description=Timeshift auto snapshot watch /etc /boot
# 确保本地文件系统全部挂载后再启动
After=local-fs.target

[Service]
Type=simple
# 脚本绝对路径
ExecStart=/usr/local/bin/timeshift-watch-etc.sh
# 脚本意外崩溃后自动重启
Restart=always
RestartSec=5
# 以 root 身份运行（Timeshift 必须管理员权限）
User=root
# 日志统一写入系统日志
StandardOutput=journal
StandardError=journal

[Install]
# 多用户模式下开机自启（桌面/服务器通用）
WantedBy=multi-user.target
```

```bash
# 重载 systemd 配置，让系统识别新服务
sudo systemctl daemon-reload
# 设置开机自动启动 + 立刻启动监控服务
sudo systemctl enable --now timeshift-watch.service
# 查看服务运行状态，显示 active (running) 即为正常
sudo systemctl status timeshift-watch.service
# 实时查看监控日志
sudo journalctl -fu timeshift-watch.service
```

systemd服务管理命令

```bash
# 临时停止监控
sudo systemctl stop timeshift-watch.service
# 永久关闭开机自启
sudo systemctl disable timeshift-watch.service
# 重启服务（修改脚本后执行）
sudo systemctl restart timeshift-watch.service
```

#### GRUB 菜单直接启动快照

```bash
# 源码编译安装 grub-btrfs
git clone https://github.com/Antynea/grub-btrfs.git
cd grub-btrfs
sudo make install
# 启用 grub-btrfsd 自动监控服务
# 创建服务覆盖配置，指定自动识别 Timeshift 快照
sudo mkdir -p /etc/systemd/system/grub-btrfsd.service.d
sudo nano /etc/systemd/system/grub-btrfsd.service.d/override.conf
```

写入

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/grub-btrfsd --syslog --timeshift-auto
```

```bash
# 重载配置并启用服务
sudo systemctl daemon-reload
sudo systemctl enable --now grub-btrfsd
# 验证服务是否正常运行
sudo systemctl status grub-btrfsd
# 刷新 GRUB 菜单
sudo update-grub
```

优化grub显示

```bash
sudo nano /etc/default/grub
```

在文件末尾添加

```ini
GRUB_BTRFS_LIMIT="20"     # 限制显示的快照数量
GRUB_BTRFS_SORT="newest"  # 按时间倒序排列
```

```bash
sudo update-grub
```

> 开机时按住 Shift（BIOS 模式） 或 Esc（UEFI 模式） 即可调出grub菜单。
> 从 GRUB 进入快照系统是只读模式，所有修改都不会写入原系统。可以放心进去测试功能、排查故障，确认正常后再执行永久恢复。
> 如果确定要回滚到某个快照，进入快照系统后执行：`sudo timeshift --restore --scripted`
> 恢复完成后重启，系统就回到对应快照的状态。

### BackInTime家目录备份

```bash
sudo apt update
sudo apt install backintime-qt -y
```

图形化配置

### rescuezilla全盘备份

> kubuntu26.04,btrfs文件格式,btrfs硬盘，ventoy启动盘

1. 制作启动盘
从[ventoy的github发布页](https://github.com/ventoy/Ventoy/releases)下载`linux.tar.gz`，解压，插入启动盘，运行`VentoyGUI.x86_64`，安装（会格式化U盘）或升级启动盘。
2. 启动rescuzilla
[下载rescuzilla的启动镜像](https://rescuezilla.com/download)并放到启动盘中，重启电脑，插入移动硬盘，从rescuzilla启动。
3. 开始备份
全程图形化操作

### snapper系统备份

[安装教程](../resources/Kubuntu_26_Btrfs_专属_Snapper_系统备份与回滚完整指南.md)

## 启用休眠功能

```bash
# 关闭swap文件
sudo swapoff /swap/swapfile
# 删除可能存在的旧swap文件
sudo rm -f /swap/swapfile
# 用官方命令创建16GB的swap文件
sudo btrfs filesystem mkswapfile --size 16G /swap/swapfile
# 启用swap文件
sudo swapon /swap/swapfile
# 验证成功
swapon --show
free -h
# 获取 swap 文件所在分区的 UUID
findmnt -no UUID -T /swap/swapfile
# 获取 swap 文件的物理偏移量（Btrfs 专属命令）
sudo btrfs inspect-internal map-swapfile -r /swap/swapfile
# 修改 GRUB 引导配置
sudo nano /etc/default/grub
```

```plaintext
# 修改前
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"

# 修改后（替换为你自己的UUID和偏移量）
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash resume=UUID=abc12345-def6-7890-abcd-1234567890ab resume_offset=12345678"
```

```bash
# 更新GRUB配置
sudo update-grub
# 更新initramfs，将resume模块加入启动镜像
sudo update-initramfs -u
# 配置 systemd 休眠模式
sudo nano /etc/systemd/sleep.conf
```

找到以下两行，取消注释并设置为：

```ini
[Sleep]
AllowSuspend=yes
AllowHibernation=yes
AllowSuspendThenHibernate=yes
AllowHybridSleep=yes
HibernateMode=platform shutdown
```

测试

```bash
# 休眠
sudo systemctl hibernate
# 混合睡眠
systemctl hybrid-sleep
# 睡眠
systemctl suspend
```

配置菜单显示

```bash
# 编辑登录管理器配置
sudo nano /etc/systemd/logind.conf
```

找到以下行，取消注释并设置为：

```ini
[Login]
HandleHibernateKey=hibernate
```

```bash
# 重启 systemd-logind 服务
sudo systemctl restart systemd-logind
# 创建 polkit 规则允许普通用户使用休眠
sudo nano /etc/polkit-1/rules.d/10-enable-hibernate.rules
```

粘贴以下内容：

```javascript
polkit.addRule(function(action, subject) {
    if (action.id == "org.freedesktop.login1.hibernate" ||
        action.id == "org.freedesktop.login1.hibernate-multiple-sessions" ||
        action.id == "org.freedesktop.login1.hibernate-ignore-inhibit" ||
        action.id == "org.freedesktop.upower.hibernate")
    {
        return polkit.Result.YES;
    }
});
```

```bash
# 设置正确的权限
sudo chmod 644 /etc/polkit-1/rules.d/10-enable-hibernate.rules
# 重启系统使所有配置生效
sudo reboot
```

## 压缩文件

平衡压缩用zstd

高压缩率：`7z a -mx=9 -mmt=on -md=128m home.tar.7z home.tar`

> **校验**
> 检查压缩包完整性：`7z t home.tar.7z`
> 流式MD5哈希校验：
>
> ```bash
> # 生成 MD5 哈希
> md5sum home.tar > home.tar.md5
> # 把解压流送入哈希校验
> 7z x -so home.tar.7z | md5sum -c home.tar.md5
> ```
>
> 用 diff 流式比对：`7z x -so home.tar.7z | diff - home.tar`

## 输入法

```bash
sudo apt update
# 安装fcitx5本体+拼音+中文扩展+配置工具
sudo apt install fcitx5 fcitx5-pinyin fcitx5-config-qt
#可安装小狼毫输入法fcitx5-rime
```

打开 系统设置 → 自动启动
右上角【添加应用程序】→ 搜索fcitx5，选中添加
系统设置 → 输入设备 → 输入法
输入法框架：选择 Fcitx5
点击【添加输入法】→ 找到【拼音 (Pinyin)】添加到右侧列表

拼音数量、输入法大小等图形化配置

## 安装应用程序

安装.deb包

1. 进入对应目录
2. `sudo apt install ./xxx.deb`

### 微信

从官网或应用商店下载.deb安装包

### edge

从官网下载.deb安装包

### VirtualBox虚拟机

```bash
# 安装
sudo apt update
sudo apt install -y virtualbox
sudo apt install -y virtualbox-ext-pack
# 启动
virtualbox
# 卸载
sudo apt remove --purge virtualbox*
sudo apt autoremove --purge
```

[常见问题解决](https://www.doubao.com/thread/w9a61a9bd9c1a6974)

### ToDesk

从[官网](https://www.todesk.com/linux.html)下载.deb安装包

### vscode

```bash
# 更新系统包索引并安装基础依赖
sudo apt update && sudo apt install wget gpg apt-transport-https -y
# 导入微软官方 GPG 密钥，验证软件包完整性
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
# 将 VSCode 官方源添加到系统 APT 源列表
echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
# 清理临时密钥文件，更新软件包缓存
rm -f packages.microsoft.gpg
sudo apt update
# 执行安装命令
sudo apt install code -y
```

### Syncthing

[官网提供的下载和更新方法](https://apt.syncthing.net/)

```bash
# 先安装 HTTPS 源依赖
sudo apt install apt-transport-https ca-certificates curl gnupg -y
# 导入 Syncthing 官方 GPG 密钥
curl -s https://syncthing.net/release-key.txt | gpg --dearmor | sudo tee /usr/share/keyrings/syncthing-archive-keyring.gpg >/dev/null
# 添加官方稳定版 APT 软件源
echo "deb [signed-by=/usr/share/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
# 更新源并安装 Syncthing
sudo apt update
sudo apt install syncthing -y
# 终端执行以下命令，启用并立即启动用户级自启服务
systemctl --user enable --now syncthing.service
# 查看服务运行状态
systemctl --user status syncthing.service
# 输出中显示active (running)即为配置成功
```

数据库被占用：`Error opening database: resource temporarily unavailable`
启动被限制：`Start request repeated too quickly`
解决方法：

```bash
# 1. 查看当前所有运行的Syncthing进程
pgrep -af syncthing
# 2. 强制终止所有相关进程（包括后台服务、前台运行的实例）
sudo pkill -9 -f syncthing
# 3. 再次验证，无任何输出即为清理干净
pgrep -af syncthing
# 进入Syncthing的配置目录
cd ~/.config/syncthing/
# 删除所有锁文件，彻底释放数据库占用
rm -f *.lock
# 重置用户级服务的失败计数（桌面场景用的这个）
systemctl --user reset-failed syncthing.service
# 停止并禁用系统级Syncthing服务
sudo systemctl stop syncthing@$USER.service
sudo systemctl disable syncthing@$USER.service
# 验证系统级服务已关闭，输出应为 inactive (dead)
sudo systemctl status syncthing@$USER.service
# 重新启动用户级Syncthing服务
systemctl --user start syncthing.service
# 查看服务运行状态
systemctl --user status syncthing.service
# 正常结果：输出显示 active (running)（绿色高亮），无报错信息
```

### git

```bash
sudo apt update
sudo apt install git-all -y
git --version
```

> 配置深度文件管理器右键菜单启动：@
>
> 1. 打开深度文件管理器，按下Ctrl+H显示隐藏文件
> 2. 进入用户主目录，依次打开路径：.local/share/
> 3. 在 share 目录下，新建文件夹，命名为deepin，进入该文件夹
> 4. 再新建文件夹，命名为menu-extensions，进入该文件夹
> 5. 在 menu-extensions 文件夹内，右键新建「文本文档」，命名为git-gui.desktop
> `~/.local/share/deepin/menu-extensions/git-gui.desktop`
> 6. 双击打开该文件，粘贴以下全部内容，保存并关闭：
>
> ```ini
> [Desktop Entry]
> Type=Service
> ServiceTypes=KonqPopupMenu/Plugin
> MimeType=inode/directory;
> Actions=OpenGitGui;
> X-KDE-Priority=TopLevel
> 
> [Desktop Action OpenGitGui]
> Name=在此处打开 Git GUI
> Name[zh_CN]=在此处打开 Git GUI
> Icon=git-gui
> Exec=cd %f && git gui
> ```
>
> 7. 关闭所有文件管理器窗口，重新打开深度文件管理器，右键点击任意文件夹，即可在菜单中看到「在此处打开 Git GUI」选项，点击即可直接启动。

### wps office

官网下载.deb安装包

### Watt Toolkit

```bash
sudo apt update && sudo apt install curl jq libnss3-tools zenity -y
curl -sSL https://steampp.net/Install/Linux.sh | bash
# host文件权限
sudo chmod a+w /etc/hosts
# 启动
watt-toolkit
```

### neovim

```bash
# 下载最新的 AppImage 文件
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.appimage
# 添加可执行权限
chmod +x nvim-linux-x86_64.appimage
# 测试运行
./nvim-linux-x86_64.appimage --version
# 全局安装
sudo mv nvim-linux-x86_64.appimage /usr/local/bin/nvim
# 验证安装
nvim --version
# 卸载时只需删除该文件
```

### stm32cubeide

[安装教程](../resources/Deepin_系统下_STM32CubeIDE_完整安装教程.md)

### 百度网盘

官网下载安装包

### vmware

```bash
# 关闭磐石系统保护
sudo deepin-immutable-writable enable
# 官网下载.bundle安装包
sudo chmod +x VMware-Workstation-*.bundle
sudo ./VMware-Workstation-*.bundle
# 启动磐石保护系统
sudo deepin-immutable-writable disable
sudo reboot
```

> 安装失败
>
> ```bash
> # 重新编译内核模块
> sudo vmware-modconfig --console --install-all
> # 安装32位库依赖
> sudo apt install libc6-i386
> ```

卸载：`sudo vmware-installer -u vmware-workstation`

### shell

#### bash

##### starship

```bash
sudo apt install starship
nano ~/.bashrc
```

在文件末尾添加

```plaintext
# Starship prompt
eval "$(starship init bash)"
```

```bash
source ~/.bashrc
```

#### fish

```bash
# 第一步：导入官方 GPG 密钥（Deepin 25 只读根目录，必须存到这个位置）
curl -fsSL https://download.opensuse.org/repositories/shells:/fish:/release:/4/Debian_12/Release.key | sudo gpg --dearmor -o /usr/share/keyrings/fish-shell.gpg
# 第二步：创建源文件，指定使用 Debian 12 源
echo "deb [signed-by=/usr/share/keyrings/fish-shell.gpg] https://download.opensuse.org/repositories/shells:/fish:/release:/4/Debian_12/ /" | sudo tee /etc/apt/sources.list.d/fish-shell.list
# 第三步：更新源并安装最新版 Fish
sudo apt update && sudo apt install fish -y
# 网页配置
fish_config
```

将 Fish 设置为默认 Shell

```bash
# 将 Fish 添加到系统允许的 Shell 列表中
echo $(which fish) | sudo tee -a /etc/shells
# 更改默认 Shell
chsh -s $(which fish)
# 重启电脑
```

[oh my fish](https://www.doubao.com/thread/w029c7b1694c61077)

```bash
# 安装oh my fish
curl -L https://get.oh-my.fish | fish
# 或
curl https://raw.githubusercontent.com/oh-my-fish/oh-my-fish/master/bin/install | fish
```

使用omf

```bash
# 删除自定义提示符文件
rm -f ~/.config/fish/functions/fish_prompt.fish
# 查看所有主题
omf theme
# 安装主题
omf install bobthefish
omf reload
# 预览所有bobthefish配色方案
bobthefish_display_colors --all
# 安装插件
omf install git
omf install fish-async-prompt
omf install battery
# 修改配置文件
nano ~/.config/fish/config.fish
```

将以下配置追加到文件末尾

```ini
# 暖色调主题
set -g theme_color_scheme gruvbox
# Python 虚拟环境自动检测显示
set -g theme_display_virtualenv yes
# 右侧显示时间戳
set -g theme_display_right yes
# 显示当前目录写入权限（不可写时变色提醒）
set -g theme_display_nowrite yes
# 命令失败时醒目提示
set -g theme_display_exit_status yes
# 启用多行提示符（光标单独一行，最标志性的样式）
set -g theme_newline_cursor yes
# 自定义多行提示符前缀符号
set -g theme_newline_prompt '❯ '
# Git 状态异步加载（避免阻塞终端）
set -g theme_git_async yes
```

`omf reload`

#### zsh

```bash
sudo apt install zsh
# 安装oh my zsh(皆需翻墙)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 安装powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
# 编辑zsh配置文件
nano ~/.zshrc
```

把`ZSH_THEME="robbyrussell"`修改为`ZSH_THEME="powerlevel10k/powerlevel10k"`

```zsh
source ~/.zshrc
```

[安装字体](https://github.com/romkatv/powerlevel10k#meslo-nerd-font-patched-for-powerlevel10k)并把终端中的字体改成meslolgs nf

```zsh
# 清楚字体缓存
fc-cache -fv
# 配置powerlevel10k
p10k configure
# 安装 zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
# 安装 zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
# 编辑zsh配置
nano ~/.zshrc
```

```ini
plugins=(
  git                        # Git命令别名和补全
  zsh-autosuggestions        # 自动建议
  zsh-syntax-highlighting    # 语法高亮
  history                    # 历史记录增强
  copypath                   # 复制当前目录路径到剪贴板
  extract                    # 万能解压命令 x 文件名，支持所有格式
  sudo                       # 双击ESC快速在命令前加sudo
)
```

```zsh
source ~/.zshrc
```

配置zsh为默认shell

```zsh
# 将 zsh 添加到系统允许的 Shell 列表中
echo $(which zsh) | sudo tee -a /etc/shells
# 更改默认 Shell
chsh -s $(which zsh)
# 重启电脑
```

#### 通用

##### FZF

模糊搜索

```bash
sudo apt install fzf -y
```

Ctrl+R：模糊搜索历史命令（比原来的搜索好用 10 倍）
Ctrl+T：模糊搜索当前目录下的文件
Alt+C：模糊搜索并跳转到目录

##### zoxide

目录跳转(`z 目录名`)

```bash
sudo apt install zoxide -y
echo 'eval "$(zoxide init bash)"' >> ~/.bashrc
source ~/.bashrc
```

```zsh
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc
source ~/.zshrc
```

```fish
echo 'zoxide init fish | source' >> ~/.config/fish/config.fish
source ~/.config/fish/config.fish
```

### 网页应用

- 豆包
- 元宝
- Word
- Excel
- PowerPoint
- bilibili
- vivo办公套件
- 夸克网盘
- 百度文库

#### 桌面快捷方式创建方法

在`/home/jianyuewushuang/Desktop`中创建`<名称>.desktop`文件，写入以下内容：

```ini
[Desktop Entry]
Encoding=UTF-8
Type=Application
Name=豆包
# 鼠标悬停备注，可选
# Comment=豆包网页快捷方式  
# 核心：启动命令+目标网页地址
Exec=xdg-open https://www.doubao.com/chat/?channel=xiazais&from_login=1  
# Icon=internet-web-browser  # 快捷方式图标，可自定义
Terminal=false
Categories=Network;WebBrowser;
```

在桌面找到这个文件，右键打开**属性**，勾选**允许以程序执行**

## 卸载应用程序

保留配置文件：`sudo apt remove 包名`
删除配置文件：`sudo apt purge 包名`

查找应用程序：

```bash
# 方法1：使用dpkg搜索（推荐）
dpkg -l | grep 关键词

# 方法2：使用apt搜索
apt list --installed | grep 关键词

# 方法3：查看所有已安装的deb包
dpkg --get-selections

# 方法4：通过程序的命令名反查包名
dpkg -S 命令名
```

清理残留的配置文件：`sudo apt autoremove --purge`
清理不需要的依赖包：`sudo apt autoremove`

查看包的详细信息：`apt show 包名`或`dpkg -s 包名`

## 开发环境配置

### c语言

### python

### nodejs

```bash
# 需翻墙
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# bash
source ~/.bashrc
# zsh
source ~/.zshrc
# fish（安装过oh my fish)
omf install nvm
# 安装最新 LTS 长期支持版
nvm install --lts
# 安装yarn和hexo
npm install -g yarn
npm install -g hexo-cli
```

## *特别栏目：把markdown转为pdf*

### 网页工具

[md-to.com](https://md-to.com/zh-cn/)

### 用浏览器插件

[MarkView](https://getmarkview.com/)

用浏览器打开markdown文件之后用浏览器另存为pdf

### vscode中的markdown preview enhenced(MPE)插件

#### 用浏览器转换(最佳实践)

1. 打开设置
2. 搜索`markdown-preview-enhanced.chromePath`
3. 把路径改为`/usr/bin/microsoft-edge-stable`
4. 打开MPE预览,右键预览,点Export->Chrome(Puppeteer)->PDF

#### 用PrinceXML转换

1. 从[下载页面](https://www.princexml.com/download/)下载Debian 12版本
2. 进入安装包所在目录进行安装`sudo dpkg -i prince_16.2-1_debian12_amd64.deb`
3. 打开MPE预览,右键预览,点Export->PDF(Prince)

> prince的用法(HTML/CSS 转 PDF 专业工具,非商业用途免费)
>> prince是HTML/CSS 转 PDF 专业工具,非商业用途免费
>
> ```bash
> # 单个文件转换
> prince input.html -o output.pdf
>
> # 多个文件合并成一个 PDF
> prince chapter1.html chapter2.html chapter3.html -o book.pdf
> ```

### pandoc+wkhtmltopdf(自动化方案)

1. `sudo apt install pandoc` `sudo apt install wkhtmltopdf`
2. `pandoc input.md -o output.pdf --pdf-engine=wkhtmltopdf`

> wkhtmltopdf的用法
>>wkhtmltopdf 是一个 “无界面浏览器”，专门把 HTML 网页（或 Markdown 转出来的 HTML）高质量转成 PDF 的开源命令行工具
>
> ```bash
> # 网页转 PDF
> wkhtmltopdf https://example.com 网页.pdf
>
> # 本地 HTML 转 PDF
> wkhtmltopdf input.html output.pdf
>
> # 常用参数（A4、边距、页眉页脚）
> wkhtmltopdf --page-size A4 --margin-top 20mm --margin-bottom 20mm input.html > output.pdf
> ```

## 安装其他桌面

### niri和dms

```bash
# 添加 Niri 官方软件源
sudo add-apt-repository ppa:avengemedia/danklinux
# 更新软件索引
sudo apt update
# 安装 Niri 及必备桌面门户组件（负责截图、文件选择、屏幕共享等）
sudo apt install niri xdg-desktop-portal-gnome xdg-desktop-portal-gtk -y
# 安装dms（需翻墙）
curl -fsSL https://install.danklinux.com | sh
```

卸载

```bash
sudo apt purge dms-shell niri -y
# 移除 DMS 专属软件源
sudo add-apt-repository --remove ppa:avengemedia/dms -y
# 移除 Niri 专属软件源
sudo add-apt-repository --remove ppa:avengemedia/danklinux -y
# 删除因依赖自动安装、现在不再需要的零散包
sudo apt autoremove -y
# 清理 apt 本地下载缓存
sudo apt clean
# 刷新软件源索引，恢复到系统原生状态
sudo apt update
# 删除 Niri 个人配置文件夹
rm -rf ~/.config/niri
# 删除 DMS 个人配置与主题数据
rm -rf ~/.config/dms
# 解除 systemd 用户服务的开机自启绑定
systemctl --user disable --now dms 2>/dev/null
systemctl --user reset-failed 2>/dev/null
```
