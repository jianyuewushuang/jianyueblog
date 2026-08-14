---
title: agent使用文档
date: 2026-07-21
categories: 技术文档
tags:
  - agent
  - api
  - linux
  - tui
  - ai
excerpt: false
---

> api
>
> - [deepseek](https://platform.deepseek.com/api_keys)
> - [kimi](https://platform.kimi.com/console/api-keys)
> - [openrouter](https://openrouter.ai/workspaces/default/keys)
> - [langrouter](https://langrouter.ai/)(有按分钟限流的免费模型)
> - [xiaomi](https://platform.xiaomimimo.com/console/api-keys)(tts系列大模型限时免费)
> - [魔搭社区](https://modelscope.cn/my/access/token)(每日免费调用很多模型)
> - [NVIDIA](https://build.nvidia.com/settings/api-keys)(大量免费模型)
> - cloudflare Workers Ai(每日10,000 Neurons) [创建](https://dash.cloudflare.com/550872c4009c042afb8726ab10aab08b/ai/workers-ai/api-quick-start) [管理](https://dash.cloudflare.com/profile/api-tokens)
> - [商汤日日新](https://platform.sensenova.cn/console/keys)(按小时限流)
>
> 联网搜索
>
> - [阿里云百炼websearch](https://bailian.console.aliyun.com/cn-beijing/?tab=app&spm=0.0.0.i2#/mcp-market/detail/WebSearch)

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

### 联网搜索

在`~/.config/opencode/opencode.jsonc`中写入：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "grep": "allow",
    "glob": "allow",
    "todowrite": "allow",
    "webfetch": "allow",
    "websearch": "allow",
    "question": "allow"
  }
}
```

**如果用的不是opencode提供商，需要启动`OPENCODE_ENABLE_EXA`环境变量：**

- 单次命令生效：`OPENCODE_ENABLE_EXA=1 opencode`
- 当前终端会话生效：

```bash
export OPENCODE_ENABLE_EXA=1
opencode
```

- 全局永久生效：
    1. bash:在`~/.bashrc`文件末尾添加`export OPENCODE_ENABLE_EXA=1`，`source ~/.bashrc`。
    2. zsh:在`~/.zshrc`文件末尾添加`export OPENCODE_ENABLE_EXA=1`，`source ~/.zshrc`。
    3. fish:在`nano ~/.config/fish/config.fish`文件末尾添加`set -gx OPENCODE_ENABLE_EXA 1`，`source ~/.config/fish/config.fish`。

### oh my openagent

opencode全能插件

[官网](https://omo.dev/zh) [官方文档](https://omo.dev/zh/docs) [github](https://github.com/code-yeongyu/oh-my-openagent) [菜鸟教程](https://www.runoob.com/opencode/opencode-oh-my-openagent.html)

#### 安装

> 需先安装opencode和bun

`bunx oh-my-openagent install`

检查安装:执行`/status`，查看`plugin`

#### 使用

ultrawork <任务>

> **关闭遥测：**
> 在`～/.config/opencode/oh-my-openagent.json`中添加：
>
> ```json
> {
>   "teletry": false
> }
> ```

##### ultrawork

##### Prometheus

架构师。与你访谈，探索代码库，并创建详细的执行计划。从不写代码。使用 Metis 和 Momus 作为质量关卡。

##### Atlas

## kilo code

[官网](https://kilo.ai/) [官方文档](https://kilo.ai/docs/) [菜鸟教程](https://www.runoob.com/vibe-coding/kilo-code-usage.html)

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

[官网](https://omp.sh/) [官方文档](https://omp.sh/docs) [github](https://github.com/can1357/oh-my-pi) [菜鸟教程](https://www.runoob.com/vibe-coding/omp-usage.html)

### 安装

> 需先安装bun(脚本也会自动安装)

`curl -fsSL https://omp.sh/install | sh`

### 使用

开箱即用的联网功能。

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

## codewhale

[中文官网](https://codewhale.net/zh) [英文官网](https://www.codewhale.ai/) [官方文档](https://codewhale.net/zh/docs) [github](https://github.com/Hmbown/CodeWhale)

### 安装

```bash
npm install -g codewhale
curl -fsSL https://codewhale.net/install.sh | sh
```

### 使用

```bash
codewhale auth set --provider deepseek   # or export ANTHROPIC_API_KEY, etc.
codewhale                                # open the TUI
codewhale exec "fix the failing test"    # headless
codewhale web                            # local browser client on 127.0.0.1
```

## Langcli

根据claude code泄漏的源码二次开发，维护不稳定。

[官方文档](https://langcli.com/cn/docs)

### 安装

`bash -c "$(curl -fsSL https://assets.langcli.com/installation/install-langcli.sh)"`

## Reasonix

只能用deepseek，但很省token。

[官网](https://reasonix.io/) [官方文档](https://reasonix.cn/guide/) [菜鸟教程](https://www.runoob.com/vibe-coding/reasonix-usage.html)

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

小米在opencode基础上开发的，有限时免费模型。自带联网搜索功能。（需配置）

[好看的官网](https://mimo.xiaomi.com/coder) [官方文档](https://mimo.xiaomi.com/zh/mimocode/start)

### 安装

`curl -fsSL https://mimo.xiaomi.com/install | bash`

### 使用

`mimo`

> 有很多实用的中文命令。
> 切换到compose agent进行复杂工程。

### 联网搜索

在`～/.config/mimocode/mimocode.jsonc`中写入：

```jsonc
{
  "$schema": "https://mimo.xiaomi.com/mimocode/config.json",
  "permission": {
    "grep": "allow",
    "glob": "allow",
    "todowrite": "allow",
    "webfetch": "allow",
    "websearch": "allow",
    "question": "allow"
  }
}
```

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

## 手机agent

### PokeClaw

可本地部署大模型离线使用

[官网](https://agents-io.github.io/PokeClaw/)

### operit

可本地部署大模型离线使用

[官网](https://operit.app/) [官方文档](https://operit.app/#/guide/new)

### X-OmniClaw

OPPO开源的手机agent,OPPO手机可以调用摄像头。

[github](https://github.com/OPPO-Mente-Lab/X-OmniClaw)

### hermes app

[github](https://github.com/SelectXn00b/HermesApp)

### zoo code

vscode扩展

[官网](https://www.zoocode.dev/) [官方文档](https://docs.zoocode.dev/)

## zeroclaw

openclaw的rust替代，性能强，安全性高，资源占用低。可部署在单片机上。

[官网](https://www.zeroclawlabs.ai/) [官方文档](https://docs.zeroclawlabs.ai/v0.8.3/zh-CN/) [github](https://github.com/zeroclaw-labs/zeroclaw)

### 安装

`curl -fsSL https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/install.sh | bash`

### 使用

```bash
# 命令行界面
zeroclaw quickstart
# web网关
zeroclaw daemon
# 终端界面
zerocode
```
