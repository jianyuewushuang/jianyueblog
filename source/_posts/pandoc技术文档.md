---
title: pandoc技术文档
date: 2026-06-06
categories: 技术文档
---

## 基础转换

```bash
# 基础转换
pandoc input.docx -o output.md
# 提取图片到指定文件夹（最重要！）
pandoc input.docx --extract-media=./images -o output.md
# 批量转换当前目录下所有docx文件
for file in *.docx; do pandoc "$file" --extract-media="./${file%.docx}_images" -o "${file%.docx}.md"; done
```
