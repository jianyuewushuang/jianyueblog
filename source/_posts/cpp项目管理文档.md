---
title: C++项目管理文档
date: 2026-11-08
categories: 技术文档
tags:
    - cpp
excerpt: "在大型C++或C语言工程中进行团队协作时有效避免红温和头秃。"
---

## clang-format

格式化代码文件。

在项目根目录新建`.clang-format`：

```yaml
BasedOnStyle: Google
IndentWidth: 4
AccessModifierOffset: -2
ColumnLimit: 300
SortIncludes: true
IncludeBlocks: Regroup
AllowShortFunctionsOnASingleLine: None
UseTab: Never
# // clang-format off
# 关闭代码格式化
# // clang-format on
```

配置编辑器在保存时自动格式化文件。

批量格式化文件：

```bash
# 找到./src中除了third_party和driver文件夹下所有有问题的文件
find ./src -type f \( -name "*.c" -o -name "*.cpp" -o -name "*.h" -o -name "*.hpp" \) \
! -path "*/third_party/*" ! -path "*/driver/*" -print0 | while IFS= read -r -d '' file; do
  if ! clang-format --style=file --dry-run -Werror "$file" >/dev/null 2>&1; then
    echo "$file"
  fi
done
# 格式化这些文件
find ./src -type f \( -name "*.c" -o -name "*.cpp" -o -name "*.h" -o -name "*.hpp" \) ! -path "*/third_party/*" ! -path "*/driver/*" -print0 | xargs -0 clang-format -i --style=file
```

## clang-tidy

clang-tidy 是 LLVM 配套的 C/C++ 静态检查工具，能查 bug、风格、现代 C++ 改造，支持自动修复代码。

安装23版llvm和clang-tidy：

```bash
sudo apt update
wget https://apt.llvm.org/llvm.sh && chmod +x llvm.sh
sudo ./llvm.sh 23
sudo apt install clang-tidy-23
```

在项目根目录新建`clang-tidy`：

```yaml
# 开启或关闭检查内容(-表示关闭，不加-表示开启)
Checks: >
  -*,
  modernize-*,
  readability-*,
  -modernize-use-trailing-return-type,
  -readability-convert-member-functions-to-static,
  -modernize-loop-convert,
  -modernize-use-nodiscard
# 当有第三方依赖命名不规范时可添加-readability-identifier-naming跳过命名检查
# 规定命名风格
CheckOptions:
  readability-identifier-naming.ClassCase: CamelCase
  readability-identifier-naming.StructCase: CamelCase
  readability-identifier-naming.FunctionCase: lower_case
  readability-identifier-naming.VariableCase: lower_case
  readability-identifier-naming.ConstantCase: UPPER_CASE
  readability-identifier-naming.MacroCase: UPPER_CASE

# 配置会被格式化的文件
HeaderFilterRegex: 'src/(app|common|guidance|test)/.*|src/detection-rt/(src|include)/.*|src/vio/(estimator/(src|include)|extrinsic|imu_accel|imu_noise|intrinsic)/.*'

# 使用.clang-format进行格式化
FormatStyle: file

# 开启终端彩色输出
UseColor: true
```

可在`third_party`和`driver`文件夹中新建子`.clang-tidy`防止修改第三方库文件:

```yaml
Checks: '-*,readability-identifier-naming'
```

```bash
# 扫描单文件
clang-tidy src/app/main.cpp -p build --fix | grep error:
# 扫描整个仓库
run-clang-tidy -p build -fix -format | grep error:
# 代码提交到暂存区之后：
# 自动修复和格式化新增代码
git diff -U0 --no-color --cached | clang-tidy-diff.py -p1 -p build --fix --format
# tidy修复新增代码
git diff -U0 --no-color --cached | clang-tidy-diff.py -p1 -p build --fix
# 只格式化本次改动行
git diff -U0 --no-color --cached | clang-format-diff.py -p1 -i
```

## pre-commit

安装：

```bash
sudo apt update
sudo apt install pipx
pipx ensurepath
# 全局安装
pipx install pre-commit
pre-commit --version
```

使用：

```bash
# 使用示例配置
pre-commit sample-config > .pre-commit-config.yaml
```

或在项目根目录新建`.pre-commit-config.yaml`:

```yaml
# See https://pre-commit.com for more information
# See https://pre-commit.com/hooks.html for more hooks
repos:
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v6.0.0
    hooks:
    -   id: trailing-whitespace # 删掉行尾空格
    -   id: end-of-file-fixer # 保证文件末尾换行
    -   id: check-yaml # yaml语法检查
    -   id: check-added-large-files # 禁止提交大文件
```

完全版示例：

```yaml
# See https://pre-commit.com for more information
# See https://pre-commit.com/hooks.html for more hooks
repos:
- repo: https://github.com/pre-commit/pre-commit-hooks
  rev: v6.0.0
  hooks:
  - id: trailing-whitespace # 删掉行尾空格
  - id: end-of-file-fixer # 保证文件末尾换行
  - id: check-yaml # yaml语法检查
  - id: check-added-large-files # 禁止提交大文件
  - id: check-json          # JSON语法校验
  - id: check-toml          # TOML校验
  - id: check-merge-conflict # 检查有没有残留的<<<<<<<合并标记
  - id: check-case-conflict # 大小写重名文件
  - id: detect-private-key  # 禁止提交私钥
  - id: no-commit-to-branch # 禁止直接commit到main/master
    args: [--branch, main]

# clang-format C++格式化
- repo: https://github.com/cpp-linter/cpp-linter-hooks
  rev: v1.8.4
  hooks:
  - id: clang-format
    args: [--style=file]

# cmake-lint 检查CMakeLists.txt
- repo: https://github.com/cheshirekow/cmake-format-precommit
  rev: v0.6.13
  hooks:
  - id: cmake-lint
  - id: cmake-format

# Shell 脚本检查
- repo: https://github.com/shellcheck-py/shellcheck-py
  rev: v0.11.0.1-1
  hooks:
  - id: shellcheck

# markdown 文档检查
- repo: https://github.com/markdownlint/markdownlint
  rev: v0.18.1
  hooks:
  - id: markdownlint
    args: [--fix, --rules, ~MD013]

# python检查
# ruff（替代 flake8 + isort，速度极快，推荐）
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.9.2
  hooks:
  - id: ruff
    args: [--fix]
  - id: ruff-format

# pyupgrade：自动升级Python语法（比如旧版f-string）
- repo: https://github.com/asottile/pyupgrade
  rev: v3.19.0
  hooks:
  - id: pyupgrade
    args: [--py310-plus]

# codespell：检查代码/文档里英文拼写错误
- repo: https://github.com/codespell-project/codespell
  rev: v2.3.0
  hooks:
  - id: codespell

# 敏感信息检查(密钥、token)
- repo: https://github.com/Yelp/detect-secrets
  rev: v1.4.0
  hooks:
  - id: detect-secrets
```

```bash
# 安装钩子到当前仓库
pre-commit install
# 只检查当前暂存文件
pre-commit run
# 检查仓库全部文件（首次跑、改配置后强烈建议）
pre-commit run --all-files
# 单独跑某一个hook（比如只跑black）
pre-commit run black
# 更新所有hook版本（拉取最新rev）
pre-commit autoupdate
# 卸载pre-commit钩子
pre-commit uninstall
# 提交时跳过
git commit --no-verify -m "skip check"
```
