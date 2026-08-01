---
title: Termux技术文档
date: 2026-07-05
tags: 技术文档
---

Termux是一个终端模拟器与Linux环境模拟器，可以用来在手机上运行linux系统。

## 安装

[下载](https://f-droid.org/packages/com.termux/)（需要翻墙）

## 基础环境配置与发行版安装

```bash
# 更新包列表和已安装软件
pkg update && pkg upgrade -y

# 安装必要工具
pkg install wget curl git vim nano python3 openssh proot-distro -y

# 查看所有可用发行版
proot-distro list

# 安装deepin
proot-distro install deepin

# 登录deepin系统
proot-distro login deepin
```

## 退出

从xfce中退出`logout`

从deepin退回到Termux主环境`exit`

从termux退出`exit`

强制停止deepin容器`proot-distro stop deepin`

## 安装桌面环境

在Termux主环境中运行

```bash
# 安装X11仓库和必要组件（需要翻墙）
pkg install x11-repo -y
pkg install termux-x11-nightly pulseaudio virglrenderer-android -y

# 启动音频服务（支持Linux内播放声音）
pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1

# 启动Termux-X11服务（适配vivo X200s 1080x2400分辨率）
termux-x11 :1 -xstartup "xfce4-session" -geometry 1080x2400
```

## 文件管理

### 在手机中访问Termux中的文件

Termux主目录`/storage/emulated/0/Android/data/com.termux/files/home`
deepin容器根目录`/storage/emulated/0/Android/data/com.termux/files/usr/var/lib/proot-distro/installed-rootfs/deepin`

### 在Termux中访问手机中的文件

授权访问文件

```bash
termux-setup-storage
```

生成的手机文件夹`~/storage`
手机内部存储根目录`~/storage/shared`

在deepin中访问手机目录（termux自动挂载）

```bash
# 登录Deepin（必须加--shared-tmp参数）
proot-distro login deepin --shared-tmp
# 查看手机目录
ls /data/data/com.termux/files/home/storage
```

## 其他问题

### 安装失败

```bash
# 第一步：强制修复dpkg中断状态
dpkg --configure -a

# 第二步：强制移除无法安装的anacron包
dpkg --force-all --remove anacron

# 第三步：继续完成剩余包的安装
apt install -f -y

# 第四步：重新安装XFCE桌面（确保所有依赖完整）
apt install xfce4 xfce4-terminal thunar-archive-plugin xfce4-screenshooter -y
```

再次遇到安装失败时的处理方法

```bash
dpkg --force-all --remove 报错的包名
apt install -f -y
```
