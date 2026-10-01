---
title: kubuntu26.04桌面崩溃问题
date: 2026-09-30
categories: 其他
tags:
    - linux
    - kubuntu
excerpt: false
---

> Following the system updates installed around September 21 (which included updates to glib2.0, gstreamer, pipewire, among others), my system started experiencing severe crashes on the Wayland session.

今天我也遇到了上述问题，[这篇bug报告](https://bugs.launchpad.net/ubuntu/+source/plasma-workspace/+bug/2168374)给出了一种解决方案：

```bash
sudo nano /etc/environment
# 末尾加一行：
```

```txt
KWIN_DRM_USE_MODIFIERS=0
# 保存后重启
```

但他的电脑是Dell Inspiron 3442，而我的是联想yoga，我在尝试之后发现在我这里并没有奏效。

在桌面崩溃之后屏幕上会显示：

```txt
锁屏程序已经损坏，无法解锁。
要解锁系统，请切换至虚拟终端(例如按 Ctrl+Alt+F1),
登录并执行以下命令：

loginctl unlock-session 4

然后按 Ctrl+D 注销登录，并切换回正在运行的会话(Ctrl+Alt+F2)。
如果你忘记了本指引的内容，可以按 Ctrl+Alt+F2 返回到此屏幕。
```

但我在尝试之后发现并没有什么作用。而且进入虚拟终端需要按`Ctrl+Alt+F3`。

现在我的桌面完全进不去，期待后续更新能尽快解决这个问题。

---

第二天上午我又尝试了一下使用x11显示协议：

```bash
sudo apt update
sudo apt install plasma-session-x11 xinit
sudo systemctl stop sddm
startx
```

或者重启电脑后在sddm界面就可以把wayland切换为x11了。

但使用x11显示协议进入桌面之后还是黑屏，只有鼠标可以使用。

之后又看到这样一篇[bug报告](https://bugs.launchpad.net/ubuntu/+source/fontconfig/+bug/2168514)，说 Kubuntu 26.04 经由 neochat 的依赖链默认装了 `fonts-katex`，把 42 个 `.woff/.woff2` 网页字体直接塞进 `/usr/share/fonts/truetype/katex/`。`fontconfig` 把这些占位条目当成通用字体，`Qt 6.10` 查询字形回退时没检查 `charset`，直接 `SIGSEGV` 崩在 `FcCharSetHasChar` 里 。

如果执行`fc-match sans`后输出`KaTeX_AMS-Regular.woff`，就说明遇到了这个问题。

定位了问题之后就可以通过删除这些字体解决：

```bash
sudo apt purge fonts-katex libjs-katex
sudo rm -rf /var/cache/fontconfig/*
rm -rf ~/.cache/fontconfig
sudo fc-cache -f
fc-cache -f
```

这时输入`fc-match sans`应该会显示`NotoSans-Regular.ttf`，然后重启电脑就可以正常进入桌面了。
