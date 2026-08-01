---
title: agent使用文档
date: 2026-07-25
tags: 技术文档
---

> api
>
> - [deepseek](https://platform.deepseek.com/api_keys)
> - [kimi](https://platform.kimi.com/console/api-keys)
> - [openrouter](https://openrouter.ai/workspaces/default/keys)
> - [langrouter](https://langrouter.ai/)(有按分钟限流的免费模型)
> - [xiaomi](https://platform.xiaomimimo.com/console/api-keys)(tts系列大模型限时免费)

## opencode

[官网](https://opencode.ai/zh) [官方文档](https://opencode.ai/docs/zh-cn)

### 安装

#### linux

##### desktop

[官网下载链接](https://opencode.ai/zh/download/stable/linux-x64-deb)

##### tui

```bash
curl -fsSL https://opencode.ai/install | bash
source ~/.zshrc
```

### 使用

```bash
# 打开tui
opencode
# 打开web
opencode web
# 打开某个项目
opencode /项目路径
# 接入大模型
/connect
# 切换模型
/models
# 读取项目，创建AGENTS.md
/init
```

[Tab]切换模型(plan或build)

```bash
# 新对话
/new
# 新任务
/sessions
# 把对话记录导出成文件
/export
# 查看时间点
/timeline
# 撤销
/undo
# 重做
/redo
# 压缩上下文
/compact
# 退出
/exit
# bash命令（会添加到上下文中）
!ls
```

### skills

`<项目目录>/.opencode/skills/<skill文件夹>`

> skill文件夹结构：
>
> ```plaintxt
> skill-name/
>   SKILL.md
>   scripts/
>     main.py
>     shell.sh
>   referces/
>     doc.md
>   assets/
>     pic.png
> ```

## kilo code

[官网](https://kilo.ai/) [官方文档](https://kilo.ai/docs/)

[官方文档之一](../不是我写的/kilocode技术文档.md)

基于opencode开发，有subagent,多agent等。vscode插件可自动补全。适合从0开始构建整个工程。

### 安装

`curl -fsSL https://kilo.ai/cli/install | bash`

### 使用

`kilo`

## pi agent

极简agent,便于二次开发。

[官网](https://pi.dev/) [官方文档](https://pi.dev/docs/latest)
### 安装

`curl -fsSL https://pi.dev/install.sh | sh`

### 使用

`pi`

## oh my pi

pi agent的fork版本，全面改良了pi。

[官网](https://omp.sh/) [官方文档](https://omp.sh/docs)

### 安装

> 需先安装bun(脚本也会自动安装)

`curl -fsSL https://omp.sh/install | sh`

### 使用

`omp`

## qwen code

[官网](https://qwen.ai/qwencode) [官方文档](https://qwenlm.github.io/qwen-code-docs/zh/users/overview/)

### 安装

`curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.sh | bash`

### 使用

`qwen`

## kimi code

配合kimi模型有超长上下文

[官网](https://www.kimi.com/code/zh) [官方文档](https://www.kimi.com/code/docs/)

### 安装

`curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash`

### 使用

`kimi`

## crush

[github仓库](https://github.com/charmbracelet/crush)

### 安装

```bash
# 添加官方仓库源
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.charm.sh/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/charm.gpg
echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | sudo tee /etc/apt/sources.list.d/charm.list
sudo apt update && sudo apt install crush
```

### 使用

`crush`

## deep code

[官网](https://deepcode.vegamo.cn/)

## deepseek-tui

[官网](https://deepseek-tui.org/zh/)

## Langcli

根据claude code泄漏的源码二次开发，维护不稳定。

[官方文档](https://langcli.com/cn/docs)

### 安装

`bash -c "$(curl -fsSL https://assets.langcli.com/installation/install-langcli.sh)"`

## Reasonix

只能用deepseek，但很省token。

[官网](https://reasonix.io/) [官方文档](https://reasonix.cn/guide/)

### 安装

> 可同时安装

#### tui和cli

`npm i -g reasonix`

#### 桌面端

[下载链接](https://dl.reasonix.io/desktop-v1.17.20/Reasonix-linux-amd64.deb)

#### vscode扩展

### 使用

先从桌面端配置api key,tui可以共享

```bash
# tui
reasonix
# web
reasonix server
```

## mimo code

小米在opencode基础上开发的，有限时免费模型。

[好看的官网](https://mimo.xiaomi.com/coder)

### 安装

`curl -fsSL https://mimo.xiaomi.com/install | bash`

### 使用

`mimo`

> 有很多实用的中文命令。
> 切换到compose agent进行复杂工程。

## cline

[官网](https://cline.bot/) [官方文档](https://docs.cline.bot/usage/tui)

### 安装

`npm install -g cline`

### 使用

`cline`

## momo Code

可自主进化的agent

[官网](https://momozi.cc/)

### 安装

`curl -fsSL https://momozi.cc/install | bash`

### 使用

```bash
# 启动
momo
# 学习代码库模式
/learn
# 检查代码拼写
/spellcheck
# 清理代码垃圾
/rmslop
# 运行自我进化系统
/fine-tune
# 经验快环：KEP 协议：从成功中提炼的策略通过 Thompson 采样自动注入。Beta 贝叶斯追踪。
/evolve
```

## open design

用来接入本地agent进行**设计**的agent管控工具。

[官网](https://open-design.ai/zh/) [快速开始](https://open-design.ai/zh/quickstart/)

### 安装

```bash
# 安装pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
# 克隆并安装. 克隆 open-design 仓库，并用 pnpm 安装 workspace 依赖。需要 Node 24 和 pnpm 10.33.2。
git clone https://github.com/nexu-io/open-design
cd open-design
pnpm install
# 启动 daemon 和 Web UI. 运行 tools-dev 启动本地 daemon 与 Web runtime。这是唯一的本地生命周期入口。
pnpm tools-dev
```

### 使用

图形化界面
