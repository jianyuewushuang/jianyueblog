---
title: tui与cli工具集
date: 2026-08-06
categories: 技术文档
tags:
  - linux
  - 终端
excerpt: false
---

[toc]

## 文件树

### tree

```bash
# 安装
sudo apt install tree
# 打印当前目录完整树
tree
# 只展示一级目录
tree -L 1
# 只显示文件夹，隐藏文件
tree -d
# 忽略 .git/node_modules 等目录
tree -I "node_modules|.git|dist"
# 输出到txt文件
tree > file_tree.txt
```

### eza

eza 是用 Rust 编写、持续维护的现代化 ls 命令替代品，是早已停更的 exa 的社区分叉继任项目，Linux/macOS/Windows/WSL 全平台可用。

核心定位：彩色、带图标、内置文件树、Git 状态、轻量化单二进制终端目录查看工具

```bash
# 安装
sudo apt install eza
# 打印当前目录完整树
eza --tree
# 简写
eza -T
# 限制只展示2层目录
eza -T -L 2
# 树形 + 图标 + Git状态
eza -T --icons --git
```

## 文件管理器

### mc(Midnight Commander)

[官网](https://midnight-commander.org/) [github](https://github.com/MidnightCommander/mc)

用c语言编写的老牌经典复古双栏文件管理器，内置解压、FTP/SFTP、文件权限批量修改、文本编辑器。

```bash
# 安装
sudo apt install mc
# 使用
mc
```

### walk

[github](https://github.com/antonmedv/walk) [README.md](../resources/walk-readme.md)

Walk — a terminal navigator; a cd and ls replacement.

Run lk, navigate using arrows or hjkl. Press, esc to jump to a new location; or ctrl+c to stay.

```bash
# 安装
# 使用brew包管理器（未成功运行）
brew install walk
# 脚本下载二进制文件
curl https://raw.githubusercontent.com/antonmedv/walk/master/install.sh | sh
# 使用
walk
```

Put the next function into the **.bashrc** or a similar config:

<table>
<tr>
  <th> Bash/Zsh </th>
  <th> Fish </th>
  <th> PowerShell </th>
</tr>
<tr>
<td>

```bash
function lk {
  cd "$(walk "$@")"
}
```

</td>
<td>

```fish
function lk
  set loc (walk $argv); and cd $loc;
end
```

</td>
<td>

```powershell
function lk() {
  cd $(walk $args)
}
```

</td>
</tr>
</table>

Now use `lk` command to start walking.

### Yazi

==强推！==

Rust 编写的现代异步终端文件管理器，右侧可实时预览图片、PDF、视频缩略图、代码高亮、Markdown 渲染、压缩包内部预览。支持vim键位和鼠标操作。

[官网](https://yazi-rs.github.io/) [github](https://github.com/sxyazi/yazi)

#### 安装

```bash
# 安装前置工具
sudo apt update
sudo apt install file ffmpeg p7zip-full jq poppler-utils fd-find ripgrep fzf zoxide resvg imagemagick xclip wl-clipboard xsel
# 安装本体
curl -fsSL https://yazi-rs.github.io/builds/yazi-keyring.gpg | sudo tee /usr/share/keyrings/yazi-keyring.gpg >/dev/null
echo 'deb [signed-by=/usr/share/keyrings/yazi-keyring.gpg] https://yazi-rs.github.io/builds/ stable main' | sudo tee /etc/apt/sources.list.d/yazi.list >/dev/null
sudo apt update && sudo apt install yazi
```

`ya` 是 Yazi 文件管理器自带的官方命令行工具，随 yazi 一起安装，不需要额外装软件。
`ya pack` 是 Yazi 的插件 & 主题包管理器，类比：apt、brew、npm，专门用来安装、卸载、更新 yazi 的主题、插件。

#### 使用

##### 基础使用

```bash
# 当前目录打开
yazi
# 指定目录打开
yazi ~/Documents
# yazi内部按q退出
```

##### 配置退出时跳转目录

在`~/.zshrc` / `~/.bashrc`加入这个 shell 包装函数：

```bash
function yazi() {
  local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
  command yazi "$@" --cwd-file="$tmp"
  IFS= read -r -d '' cwd < "$tmp"
  [ "$cwd" != "$PWD" ] && [ -d "$cwd" ] && builtin cd -- "$cwd"
  command rm -f -- "$tmp"
}
```

在`~/.config/fish/config.fish`加入：

```fish
function y
  set tmp (mktemp -t "yazi-cwd.XXXXXX")
  command yazi $argv --cwd-file="$tmp"
  if read -z cwd < "$tmp"; and [ "$cwd" != "$PWD" ]; and test -d "$cwd"
    builtin cd -- "$cwd"
  end
  command rm -f -- "$tmp"
end
```

##### 快捷键

[官方文档](https://yazi-rs.github.io/docs/quick-start)

###### 基础全局按键

| 快捷键 | 功能说明 |
| -------- | ---------- |
| `q` | 退出Yazi，同步当前目录到Shell（配合shell包装函数） |
| `Q` | 直接退出，不输出目录文件，不改变Shell当前路径 |
| `F1` / `~` | 打开内置帮助文档 |
| `Ctrl + c` | 关闭当前标签页；最后一页则退出程序 |
| `Esc` | 退出可视选择模式、清空选中、取消搜索 |

###### 目录与光标导航（Vim风格 + 方向键）

| 快捷键 | 替代按键 | 操作说明 |
| -------- | ---------- | ---------- |
| `k` | ↑ | 光标上移一行 |
| `j` | ↓ | 光标下移一行 |
| `h` | ← | 返回父目录 |
| `l` | → | 进入当前选中文件夹 |
| `K` | - | 预览面板向上滚动5行 |
| `J` | - | 预览面板向下滚动5行 |
| `gg` | - | 光标跳至列表顶部 |
| `G` | - | 光标跳至列表底部 |
| `z` | - | fzf模糊搜索：跳转目录/定位文件 |
| `Z` | - | zoxide历史目录快速跳转 |
| `g` + 空格 | - | 交互式输入路径跳转目录 |

###### 文件多选操作

| 快捷键 | 操作说明 |
| -------- | ---------- |
| `Space` | 切换当前文件/文件夹选中状态（可多选） |
| `v` | 进入可视选择模式，上下移动批量选中 |
| `V` | 进入可视取消模式，移动取消选中 |
| `Ctrl + a` | 全选当前目录所有文件 |
| `Ctrl + r` | 反选（选中未选，取消已选） |
| `Esc` | 清空全部选中状态，退出选择模式 |

###### 文件基础操作（新建/复制/剪切/删除/打开）

| 快捷键 | 操作说明 |
| -------- | ---------- |
| `Enter` / `o` | 使用系统默认程序打开选中文件 |
| `O` / `Shift + Enter` | 交互式选择程序打开文件 |
| `Tab` | 弹出文件详情面板（大小、权限、修改时间等） |
| `y` | 复制选中文件（yank） |
| `x` | 剪切选中文件（cut） |
| `p` | 粘贴复制/剪切的文件，不覆盖同名文件 |
| `P` | 粘贴并强制覆盖同名文件 |
| `Y` / `X` | 清空复制/剪切缓存 |
| `a` | 新建文件；输入末尾加 `/` 新建文件夹 |
| `r` | 重命名选中文件（支持批量重命名） |
| `d` | 将选中文件移入回收站（安全删除） |
| `D` | 永久删除文件，不可恢复 |
| `.` | 切换隐藏文件显示/隐藏 |

###### 软链接/硬链接操作

| 快捷键 | 操作说明 |
| -------- | ---------- |
| `-` | 创建选中文件**绝对路径**软链接 |
| `_` | 创建选中文件**相对路径**软链接 |
| `Ctrl + -` | 创建选中文件硬链接 |

###### 路径复制快捷键（序列按键：先按第一个，再按第二个）

| 序列快捷键 | 操作说明 |
| ------------ | ---------- |
| `c` + `c` | 复制当前文件完整绝对路径 |
| `c` + `d` | 复制当前文件所在目录路径 |
| `c` + `f` | 复制纯文件名（带后缀） |
| `c` + `n` | 复制文件名（去除扩展名） |

###### 六、过滤、查找、搜索

文件实时过滤

| 快捷键 | 说明 |
|--------|------|
| `f` | 输入关键词实时过滤当前目录文件 |

单文件字符查找（同Vim查找）

| 快捷键 | 说明 |
| -------- | ------ |
| `/` | 向下查找匹配文件名 |
| `?` | 向上查找匹配文件名 |
| `n` | 跳转到下一个匹配项 |
| `N` | 跳转到上一个匹配项 |

全局搜索

| 快捷键 | 说明 |
| -------- | ------ |
| `s` | fd工具：按文件名递归搜索当前目录 |
| `S` | ripgrep工具：按文件内容递归搜索 |
| `Ctrl + s` | 终止正在执行的搜索 |

###### 文件排序（序列快捷键 `,` + 对应字母）

| 序列快捷键 | 排序规则 |
| ------------ | ---------- |
| `,m` | 按修改时间升序 |
| `,M` | 按修改时间倒序 |
| `,b` | 按文件创建时间升序 |
| `,B` | 按文件创建时间倒序 |
| `,e` | 按文件扩展名升序 |
| `,E` | 按文件扩展名倒序 |
| `,a` | 字母自然升序 |
| `,A` | 字母自然倒序 |
| `,n` | 数字自然排序升序 |
| `,N` | 数字自然排序倒序 |
| `,s` | 文件大小升序 |
| `,S` | 文件大小倒序 |
| `,r` | 随机打乱排序 |

###### Shell命令执行

| 快捷键 | 说明 |
|--------|------|
| `;` | 后台执行Shell命令，不阻塞Yazi界面 |
| `:` | 前台执行Shell命令，等待命令结束后返回界面 |

###### 多标签页操作

| 快捷键 | 说明 |
| -------- | ------ |
| `tt` | 在当前目录新建标签页 |
| `1~9` | 快速切换到第N个标签 |
| `[` | 切换上一个标签 |
| `]` | 切换下一个标签 |
| `{` | 当前标签与前一个标签互换位置 |
| `}` | 当前标签与后一个标签互换位置 |
| `Ctrl + c` | 关闭当前标签 |

#### 配置文件

- `~/.config/yazi/yazi.toml`
- `~/.config/yazi/keymap.toml`
- `~/.config/yazi/theme.toml`
- `~/.config/yazi/vfs.toml`

### superfile

- 用go开发
- UI好看
- 可以自由分栏
- 不支持鼠标操作
- 图片预览只支持kitty协议

[官网](https://superfile.dev/) [官方文档](https://superfile.dev/overview/) [github](https://github.com/yorukot/superfile)

```bash
# 安装
bash -c "$(curl -sLo- https://superfile.dev/install.sh)"
# 使用
spf
```

## 文件预览

### chafa

终端图形工具，开源（LGPLv3+），C 语言编写，高性能，可把图片 / GIF/SVG/WebP/AVIF 等图像转为Unicode 字符画或者Sixel/Kitty/iTerm2 像素图形，直接在终端输出图片。

#### 安装

```bash
sudo apt install chafa
```

#### 使用

##### 基础用法

```bash
# 直接显示图片，自动适配终端大小
chafa demo.jpg
# 多张图片依次输出
chafa a.png b.webp c.jpeg
```

##### 尺寸控制 `-s / --size`

```bash
# 指定列x行，80列，40行
chafa -s 80x40 demo.jpg
# 只限制宽度，高度自动适配
chafa -w 100 demo.jpg
# 只限制高度，宽度自动适配
chafa -h 30 demo.jpg
```

##### 输出格式 `--format`

|format值|说明|终端要求|
|---|---|---|
|auto|自动（默认）|全部终端|
|symbols|Unicode 字符画|全部终端，ssh 可用|
|sixels|Sixel 像素图|Alacritty、mlterm、xterm 等支持 sixel|
|kitty|Kitty 原生图像协议|kitty 终端|
|iterm|iTerm2 协议|macOS iTerm2|

```bash
# 强制字符画输出，ssh远程首选
chafa --format symbols demo.jpg
# sixel像素输出（画质最好，终端必须支持sixel）
chafa --format sixels -s 120x60 demo.png
```

##### 色彩控制 `-c / --colors`

- auto：自动（默认）
- full：24bit真彩色
- 256：256色
- 16：16色
- none：黑白无颜色

```bash
chafa -c 256 demo.jpg
chafa -c none demo.jpg #纯黑白字符画
```

##### 字符集选择 `--symbols / -f`

- blocks：方块色块，画面饱满（推荐）
- ascii：仅 ASCII 字符，兼容性最强，画质差
- extended：默认，Unicode 扩展字符
- braille：盲文点，细节多，适合小尺寸

```bash
# 方块字符，效果最好
chafa --symbols blocks demo.jpg
# 纯ascii，老终端/ssh老旧环境
chafa --symbols ascii -c 16 demo.jpg
# 盲文点阵
chafa --symbols braille demo.jpg
```

##### 抖动算法（改善低色阶图片）`--dither`

当颜色位数有限（256/16 色），抖动可以消除色带，提升观感

- none：关闭（默认）
- ordered：有序抖动
- diffusion：扩散抖动
- noise：噪声抖动

```bash
chafa -c256 --dither diffusion demo.jpg
# 抖动强度 0~1
chafa -c256 --dither diffusion --dither-intensity 0.7 demo.jpg
```

##### GIF 动画支持 `-a / --animate`

```bash
#播放gif动画，按 Ctrl+C停止
chafa -a anim.gif
# 设置帧延迟，单位毫秒
chafa -a --frame-delay 80 anim.gif
```

##### 背景 / 前景色

```bash
# 设置背景黑色
chafa --bg-color black demo.png
# 设置背景白色
chafa --bg-color white demo.png
# 反转前景背景色，适合浅色终端
chafa --invert demo.jpg
```

##### tmux/screen 兼容 `--passthrough`

tmux 中使用 sixel/kitty 像素模式，必须开启 passthrough，否则图片无法渲染

可选值：`auto/none/screen/tmux`。

```bash
chafa --format sixels --passthrough tmux demo.png
```

###### 管道传入图片数据

```bash
cat demo.jpg | chafa -
curl -s https://xxx/test.png | chafa -
```

##### 批量文件

```bash
# 当前目录所有图片
chafa *.png *.jpg *.webp
# 从文件读取文件列表
find ./imgs -name "*.png" -print0 | chafa --files0 -
```

### poppler

pdf预览

#### 安装

```bash
sudo apt install poppler‑utils
```

#### 使用

```bash
# 提取PDF全部文本输出到控制台
pdftotext document.pdf -
# 提取PDF文本保存成文件
pdftotext document.pdf out.txt
# 查看PDF元信息（页数、作者）
pdfinfo document.pdf
# 将PDF第1页转png图片（Yazi预览PDF就是靠这个）
pdftocairo -png -f 1 -l 1 document.pdf output
```

### resvg

SVG 渲染工具，Rust 实现，把 svg 渲染成 png 位图。

#### 安装

```bash
sudo apt install resvg
```

#### 使用

```bash
# 将 input.svg 转为 png
resvg input.svg output.png
# 指定分辨率
resvg --width 512 --height 512 input.svg out.png
```

### ffmpeg

音视频处理全能工具

#### 安装

```bash
sudo apt install ffmpeg
```

#### 使用

```bash
# 提取视频第1秒帧保存为图片
ffmpeg -ss 1 -i video.mp4 -vframes 1 thumbnail.png -y
# 视频转格式 mp4 → mkv
ffmpeg -i input.mp4 output.mkv
# 提取音频
ffmpeg -i movie.mp4 -vn audio.aac
# 查看媒体信息
ffmpeg -i video.mp4
```

## 搜索和跳转

### fd

替代传统 `find` 的现代化文件查找工具，默认忽略 `.gitignore` 内容。

> 搜索文件名

#### 安装

```bash
sudo apt install fd-find
```

#### 使用

```bash
# 在当前目录搜索名字含 note 的文件
fd note
# 只搜 .rs 后缀文件
fd -e rs
# 全局搜索，不遵守gitignore
fd -u keyword
# 只列出目录
fd -t d project
# 只列出文件
fd -t f test
# 指定搜索根目录
fd config ~/.config
```

### ripgrep

高速全文内容搜索工具，Rust 写，极快，自动忽略 gitignore 文件。

> 搜索文件内容

#### 安装

```bash
sudo apt install ripgrep
```

#### 使用

```bash
# 在当前目录，搜索包含 "hello" 的文件内容
rg "hello"
# 只搜 .py 文件
rg "def main" -e py
# 显示行号+上下文前后2行
rg "error" -C 2
# 不忽略隐藏文件/.gitignore
rg "todo" -u
# 只列出匹配的文件名，不输出内容
rg -l "TODO"
# 搜索固定字面字符串（关闭正则）
rg -F "const MAX=100"
```

### fzf

模糊交互式选择过滤器。

#### 安装

```bash
sudo apt install fzf
```

#### 使用

```bash
# 列出文件，fzf交互式选择，回车输出选中文件
fd | fzf
# 历史命令模糊搜索（经典用法）
history | fzf
# cd到选中目录
cd $(fd -t d | fzf)
```

> 典型管道模式：stdout → fzf交互选择 → 输出选中项给下一个命令

快捷键 fzf 交互窗口：`Ctrl+j/k`上下，`Tab`多选，`ESC`退出。

### zoxide

智能目录跳转，替代 cd，记忆你访问过的目录。

> 原理：维护访问频次数据库，访问越多权重越高。

#### 安装

```bash
sudo apt install zoxide
source ~/.zshrc
```

#### 使用

```bash
# 等价 cd，同时记录访问
z foo
# 模糊跳转，会弹出fzf交互窗口
zi foo
# 查询访问过的目录数据库
zoxide query -l
# 直接cd到高频访问的目录，不用打全路径
z doc
```

###
