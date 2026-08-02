---
title: LaTeX技术文档
date: 2026-06-06
categories: 技术文档
tags:
  - LaTeX
---

## 配置

### 下载TeX Live

#### windows

1. [点击这里跳转到下载网页](https://tug.org/texlive/acquire-iso.html "下载")
2. 点击`download from a nearby CTAN mirror`随机跳转国内镜像网站
3. 下载最新的`.iso`文件
4. 装载后用管理员身份运行`install-tl-windows.bat`文件
5. 出现安装界面后取消`安装TexWorks前端`

#### linux

```bash
sudo apt update
sudo apt install texlive-full -y
# 安装中文相关宏包和字体
sudo apt install texlive-lang-chinese texlive-xetex fonts-noto-cjk -y
```

### 安装vscode插件

安装`LaTex Workshop`

### 配置设置文件

打开vscode设置之后点右上角`打开设置(json)`
在打开的文件的大括号末尾复制：

```json
// -------------------------- LaTeX 核心配置 --------------------------
    // 默认编译工具链：使用 latexmk 自动处理多轮编译（最省心）
    "latex-workshop.latex.recipes": [
        {
            "name": "latexmk (XeLaTeX) - 推荐中文文档",
            "tools": ["latexmk_xelatex"]
        },
        {
            "name": "latexmk (pdfLaTeX) - 纯英文文档",
            "tools": ["latexmk_pdflatex"]
        },
        {
            "name": "XeLaTeX -> BibTeX -> XeLaTeX*2 - 含参考文献",
            "tools": ["xelatex", "bibtex", "xelatex", "xelatex"]
        }
    ],
    // 具体编译工具定义
    "latex-workshop.latex.tools": [
        {
            "name": "latexmk_xelatex",
            "command": "latexmk",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-xelatex",
                "-cd", //确保在源文件目录下工作，避免路径问题
                "-outdir=%OUTDIR%",
                "-auxdir=%OUTDIR%", //辅助文件也统一放进 build 文件夹
                "%DOC%"
            ],
            "env": {}
        },
        {
            "name": "latexmk_pdflatex",
            "command": "latexmk",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-pdf",
                "-cd",
                "-outdir=%OUTDIR%",
                "-auxdir=%OUTDIR%",
                "%DOC%"
            ],
            "env": {}
        },
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-outdir=%OUTDIR%",
                "%DOC%"
            ]
        },
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": ["%DIR%/build/%DOCFILE%"]
        }
    ],
    // 设置默认编译配方（推荐使用 latexmk，它自动处理多轮编译）
    "latex-workshop.latex.recipe.default": "latexmk (XeLaTeX) - 推荐中文文档",
    // 编译输出目录：统一放在 build 文件夹，保持根目录整洁
    "latex-workshop.latex.outDir": "%DIR%/build",
    // 清理辅助文件时保留的格式
    "latex-workshop.latex.autoClean.run": "onFailed",
    "latex-workshop.latex.clean.fileTypes": [
        "*.aux", "*.bbl", "*.blg", "*.idx", "*.ind", "*.lof",
        "*.lot", "*.out", "*.toc", "*.acn", "*.acr", "*.alg",
        "*.glg", "*.glo", "*.gls", "*.ist", "*.fls", "*.log",
        "*.fdb_latexmk", "*.synctex.gz"
    ],
    // 启用右键菜单和智能提示
    "latex-workshop.showContextMenu": true,
    "latex-workshop.intellisense.package.enabled": true,
    // PDF 查看器配置：默认使用 VS Code 内置查看器，支持正向/反向搜索
    "latex-workshop.view.pdf.viewer": "tab",
    "latex-workshop.view.pdf.internal.synctex.keybinding": "ctrl-click",
    // 保存时自动编译（可选，建议开启）
    "latex-workshop.latex.autoBuild.run": "onSave",
    // 关闭默认的 pdflatex 警告
    "latex-workshop.message.warning.show": false,
    "latex-workshop.message.error.show": false,
    "workbench.editorAssociations": {
        "*.pdf": "latex-workshop-pdf-hook"
    }
```

### 创建并运行文件

1. 在纯英文路径下创建纯英文名的`.tex`文件
2. 右上角打开pdf预览
3. 保存文件自动编译

## 编写
