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
