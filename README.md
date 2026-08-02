# jianyueblog · 简约博客

> 一个分享知识与技术的个人博客 —— 基于 Hexo v8 + Redefine 主题构建。

在线站点：<https://blog.jianyuewushuang.top>

## 功能特性

- **Redefine 主题** —— 深色模式默认、紫蓝主色、单页（swup）体验
- **自定义特效** —— 飘雪粒子 + 鼠标 ❄️ 拖尾（`inject` 注入，不修改主题源码）
- **Giscus 评论** · **本地搜索** · **Mermaid 流程图** · **Live2D 看板娘**
- **书签页** —— 基于 `source/_data/bookmarks.yml` 聚合

## 博客技术栈

| 环节 | 选型 |
| --- | --- |
| 静态生成 | Hexo |
| 代码托管 | GitHub + GitLink 双向同步 |
| 部署上线 | 腾讯云服务器自动构建部署 |
| 域名 | 自有域名解析 |
| 文章访问量 | Vercount |
| 站点流量 | 百度统计 |
| 评论系统 | Giscus |

## 快速开始

环境要求：Node.js（≥18）、npm、C++ 工具链（`nodejieba` 为原生依赖）。

```bash
npm install        # 安装依赖
npm run server     # 本地预览，默认 http://localhost:4000
npm run build      # 构建到 public/
npm run clean      # 清理构建缓存
npx hexo new "标题" # 新建文章
```

文章为带 YAML front-matter 的 Markdown，命名沿用 `xxx技术文档.md` 风格。
`post_asset_folder` 关闭，图片以绝对路径（`/images/foo.png`）置于 `source/images/`。

## 目录结构

```text
jianyueblog/
├── _config.yml                 # Hexo 站点配置（URL、插件、Live2D）
├── _config.redefine.yml        # Redefine 主题配置（站点行为主体）
├── source/
│   ├── _posts/                 # 博文（原创，CC BY-NC-SA 4.0）
│   ├── _data/bookmarks.yml     # 书签页数据
│   ├── js/effects-init.js      # 自定义粒子 / 鼠标特效初始化
│   └── about/ bookmarks/ ...   # 自定义页面
├── themes/redefine/            # 主题源码（GPLv3，请勿直接修改）
├── LICENSE/                    # 三份协议全文
└── .github/dependabot.yml      # npm 依赖自动更新
```

> 更详尽的配置说明、特效注入机制、写作约定见 [AGENTS.md](AGENTS.md)。

## 部署

腾讯云服务器自动构建部署：`hexo generate` 产出 `public/` 后由服务器拉取发布。
`public/` 与 `db.json` 均不入库。如需自定义部署，在 `_config.yml` 的 `deploy:` 段配置。

## 版权与许可声明

本仓库包含多项相互独立的作品，按目录划分授权协议：

1. `/themes/redefine/` 目录全部文件
Copyright © EvanNotFound
License: GNU General Public License v3.0 (GPLv3)

2. `/source/_posts/` 内所有原创博文、原创配图
Copyright © jianyuewushuang
License: CC BY-NC-SA 4.0

> 补充说明：含有第三方引用、外部转载内容的文章，仅本人原创评述、总结部分适用本协议；引用素材著作权归属原作者。

3. 仓库内其余所有由本人独立创作的文件
（包含站点配置、自定义布局、独立脚本、自定义页面等，不包含上述两条范围内内容）
Copyright © jianyuewushuang
License: PolyForm Noncommercial License 1.0.0

***重要提醒***

1. GPLv3 仅适用于上游主题源代码，请勿直接修改 `/themes/redefine/` 内部源码；若修改，改动部分强制遵循 GPLv3，不可套用 PolyForm 协议。
2. 不同协议适用范围严格区分，协议之间互不覆盖。
3. 静态网站编译输出的 HTML、页面资源不属于源代码分发范围，本仓库协议仅约束仓库源码文件。

三份协议全文见 [LICENSE/](LICENSE) 目录。
