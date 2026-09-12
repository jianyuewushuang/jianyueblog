---
title: pandoc技术文档
date: 2026-05-09
categories: 技术文档
tags:
    - pandoc
excerpt: false
---

## 安装

### windows

```powershell
winget install JohnMacFarlane.Pandoc
```

### linux

```bash
sudo apt update
sudo apt install pandoc
```

> 验证：`pandoc --version`

## 基础转换

```bash
# 基础转换
pandoc input.docx -o output.md
# 提取图片到指定文件夹（最重要！）
pandoc input.docx --extract-media=./images -o output.md
# 批量转换当前目录下所有docx文件
for file in *.docx; do pandoc "$file" --extract-media="./${file%.docx}_images" -o "${file%.docx}.md"; done
```

## 高级转换

[一篇教程](https://blog.chillywall.com/2025/06/29/%E4%BD%BF%E7%94%A8Pandoc%E5%92%8CLatex%E5%B0%86Markdown%E8%BD%AC%E4%B8%BA%E6%BC%82%E4%BA%AE%E7%9A%84PDF/)

从[模板库](https://pandoc-templates.org/)中clone一个[模板仓库](https://github.com/Wandmalfarbe/pandoc-latex-template/tree/master)：

```bash
git clone https://github.com/Wandmalfarbe/pandoc-latex-template.git
```

按照README写好markdown文件后执行转换命令：

```bash
pandoc "document.md" -o "document.pdf" --from markdown --template "../../dist/eisvogel.latex" --syntax-highlighting idiomatic --pdf-engine "xelatex" -V CJKmainfont="SimSun"
```

循环转换命令（windows）：

```powershell
chcp 65001 | Out-Null
Set-Location $PSScriptRoot
Get-ChildItem -Path "./src" -Filter "*.md" | ForEach-Object {
    $inputFile = $_.FullName
    $outputFile = Join-Path "./build" ($_.BaseName + ".pdf")
    pandoc $inputFile `
        -o $outputFile `
        --from markdown `
        --template "./resources/latex/eisvogel.latex" `
        --syntax-highlighting idiomatic `
        --pdf-engine "xelatex" `
        -V CJKmainfont="SimSun"
}
```

示例markdown:

```markdown
---
title: "标题"
author: [你的名字]
date: "2026-09-12"
subject: "Markdown"
keywords: [关键词, markdown]
subtitle: "副标题"
titlepage: true,
titlepage-rule-color: "360049"
titlepage-background: "绝对路径"
page-background: "绝对路径"
---

## 二级标题

正文
```
