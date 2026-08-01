---
title: typst技术文档
date: 2026-07-05
tags: 技术文档
---

## 安装

[官网](https://typst.app/)

## 安装

### windows

```powershell
winget install --id Typst.Typst
```

在vscode中安装Tinymist Typst和Typst Companion插件

### linux

#### 官方脚本

```bash
# 官方安装脚本
curl -fsSL https://typst.app/install | sh
# 验证安装
typst --version
# 安装中文字体
sudo apt update && sudo apt install fonts-noto-cjk fonts-noto-cjk-extra
```

==更新：==`typst update`

更新项目依赖包：

```bash
# 在你的Typst项目目录中执行
typst update --packages
```

> 卸载：`rm -f ~/.local/bin/typst && rm -rf ~/.cache/typst/ ~/.config/typst/ ~/.local/share/typst/`

#### snap包管理器

安装：`sudo snap install typst`

卸载：`sudo snap install typst`或`sudo snap remove --purge typst`

## 使用

### 边缘

#### 命令行

```powershell
# 导出为PDF
typst compile hello.typ
# 实时监控并自动导出
typst watch hello.typ
```

```powershell
# 全能简约作业模板
typst init @preview/scripst
# 极简标准实验报告
typst init @preview/basic-report
# 清爽工科作业
typst init @preview/ sleek-university-assignment
# 类 LaTeX 标准学术排版
typst init @preview/latexlike-report
# 理工专用论文 + 二合一（文档 + 幻灯片）
typst init @preview/axiomst
# 北航模板
typst init @preview/touying-buaa:0.2.0
typst init @preview/buaa-unofficial-gradient:0.1.0
typst init @preview/modern-buaa-thesis:0.2.0
# 国产最强中文 PPT
typst init @preview/touying-aqua
# 国际风简洁 PPT
typst init @preview/polylux
# IEEE 会议小论文（发期刊 / 课程竞赛）
typst init @preview/clean-acmart
```

#### vscode

`Ctrl+B`加粗 `Ctrl+I`斜体 `Ctrl+K V`实时预览

vscode设置中`Tinymist: Export Pdf`

- onSave：保存文件时自动导出 PDF（推荐）
- onType：输入时实时导出 PDF（性能消耗稍大）
- never：禁用自动导出

`Tinymist › Lint: When`
代码检查可改为ontype

`Tinymist › Preview: Cursor Indicator`
开启后可在预览中显示光标

### 语法

```typst
= Hello Typst!
这是我的第一个Typst文档。

== 数学公式
欧拉公式：$ e^{i\pi} + 1 = 0 $

== 列表
- 语法比LaTeX简单
- 编译速度极快
- 原生支持中文
```
