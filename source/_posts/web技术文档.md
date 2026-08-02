---
title: web技术文档
date: 2026-06-06
categories: 技术文档
tags:
  - web
  - 前端
  - node.js
  - linux
  - hexo
---

## 开发环境

```bash
# 安装node.js（需翻墙）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# bash
source ~/.bashrc
# zsh
source ~/.zshrc
# fish（安装过oh my fish)
omf install nvm
# 安装最新 LTS 长期支持版
nvm install --lts

# 安装yarn和hexo
npm install -g yarn
npm install -g hexo-cli

# 安装pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

[bun官网](https://bun.sh/) [bun官方文档](https://bun.net.cn/docs)

```bash
# 安装bun
curl -fsSL https://bun.sh/install | bash
```

## 发布网页

### jihulab

1. 将除.git文件夹以外的所有文件放到public文件夹中
2. 在根目录创建一个.github-ci.yml文件

  ```yml
  ---
  pages:
    stage: deploy
    script:
      - echo "正在部署纯静态网页"
    artifacts:
      paths:
        - public/
    rules:
      - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  ```

3. 推送到jihulab仓库中
4. **构建>流水线**通过之后从项目主页右侧的**Gitlab Pages**访问网页

### github

1. 仓库首页放index.html
2. 在仓库设置中点`pages->build and deployment->branch`下拉选择`main`分支
3. 访问`https://用户名.github.io/仓库名/`

## 制作网页

### 静态网页生成器

- Jekyll
- Hexo
- Hugo
- VuePress
- ...

## 优化网页

### 网页图片加载太慢

- 压缩图片大小
- 把图片转成avif格式
  - html

    ```html
    <picture>
      <source srcset="https://image-compress-demo.oss-cn-zhangjiakou.aliyuncs.com/demo.jpg?x-oss-process=image/format,avif" type="image/avif" />
      <img src="https://image-compress-demo.oss-cn-zhangjiakou.aliyuncs.com/demo.jpg" />
    </picture>
    ```

  - javascript+css

    ```js
    async function supportsAvif() {
    if (!this.createImageBitmap) return false

    const avifData =
    'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
    const blob = await fetch(avifData).then((r) => r.blob())
    return createImageBitmap(blob).then(
    () => true,
    () => false
    )
    }

    ;(async () => {
    const classAvif = (await supportsAvif()) ? 'avif' : 'no-avif'
    document.body.classList.add(classAvif)
    })()
    ```

- 把图片转成WebP格式
  - 工具：
    - [多张jpg转webp](https://cdkm.com/cn/jpg-to-webp)
    - [单张jpg转webp等](https://squoosh.app/)
- 截去部分图片
- 懒加载

  ```html
  <img src="resources/张浩.jpg" alt="张浩头像" loading="lazy">
  ```

- 预加载(不知道咋弄)
- 部署到国内服务器(jihulab)
- 渐进式图片加载(需准备多组图片)
  - 先加载小尺寸预览图
- 显示加载进度
- 图片缓存(不知道咋弄)

## 统计网站数据

- 点击量
  - 百度统计
- 用户行为分析
  - Microsoft Clarity

## 个人博客

> 旧博客
>
> ```archive
> 用腾讯云托管可以用私有github仓库部署。
> 
> ### Hexo
> 
> ```bash
> # 创建博客文件夹（替换成你想要的路径）
> hexo init ~/blog
> # 进入目录
> cd ~/blog
> # 安装项目依赖（或用yarn）yarn install
> npm install
> # 生成静态文件
> hexo g
> hexo generate
> npm run build
> # 本地预览博客
> hexo s
> hexo server
> npm run server
> # 部署（需提前配置_config.yml deploy）
> hexo d
> hexo deploy
> npm run deploy
> # 清理缓存
> hexo clean
> npm run clean
> # 创建新文章
> hexo new "文章标题"
> # 创建草稿
> hexo new draft "文章标题"
> ```
>
> ```

### Hexo

[官网](https://hexo.io/zh-cn/) [官方文档](https://hexo.io/zh-cn/docs/)

以redefine主题为例：

[github](https://github.com/evannotfound/hexo-theme-redefine/tree/main) [官方文档](https://redefine-docs.ohevan.com/zh) [演示站点](https://redefine.ohevan.com/) [某个个人博客](https://ohevan.com/)

#### 创建

##### npm包管理器安装

```bash
mkdir jianyueblog && cd jianyueblog
npx hexo init .
npm install hexo-theme-redefine@latest
# 更新博客框架
npm install hexo-theme-redefine@latest
```

##### git clone仓库源码

```bash
mkdir jianyueblog && cd jianyueblog
npx hexo init .
git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine
# 然后删除.git仓库
```

更新博客框架：删除原来的`themesk/redefine`仓库，重新`git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine`

##### 之后的统一步骤

把`_config.yml`中的theme修改为`theme: redefine`

在项目根目录创建`_config.redefine.yml`，写入：

```yml
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# THEME REDEFINE CONFIGURATION FILE V2
# BY EVANNOTFOUND
# GITHUB: https://github.com/EvanNotFound/hexo-theme-redefine
# DOCUMENTATION: https://redefine-docs.ohevan.com
# DEMO: https://redefine.ohevan.com
# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# BASIC INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/basic/info
info:
  # Site title
  title: Theme Redefine
  # Site subtitle
  subtitle: Redefine Your Hexo Journey.
  # Author name
  author: The Redefine Team
  # Site URL
  url: https://redefine.ohevan.com
# BASIC INFORMATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# IMAGE CONFIGURATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/basic/defaults
defaults:
  # Favicon
  favicon: /images/redefine-favicon.svg
  # Site logo
  logo: 
  # Site avatar
  avatar: /images/redefine-avatar.svg
# IMAGE CONFIGURATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# COLORS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/basic/colors
colors:
  #Primary color
  primary: "#A31F34"
  # Secondary color (TBD)
  secondary:
  # Default theme mode initial value (will be overwritten by prefer-color-scheme)
  default_mode: light # light, dark
# COLORS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# SITE CUSTOMIZATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/basic/global
global:
  # Custom global fonts
  fonts:
    # Chinese fonts
    chinese: 
      enable: false # Whether to enable custom chinese fonts
      family:  # Font family
      url:  # Font URL to CSS file
    # English fonts
    english: 
      enable: false # Whether to enable custom english fonts
      family:  # Font family
      url:  # Font URL to CSS file
    # Custom title fonts (navbar, sidebar)
    title:
      enable: false # Whether to enable custom title fonts
      family:  # Font family
      url:  # Font URL to CSS file
  # Content max width
  content_max_width: 1000px
  # Sidebar width
  sidebar_width: 210px
  # Effects on mouse hover
  hover:
    shadow: true # shadow effect
    scale: false # scale effect
  # Scroll progress
  scroll_progress:
    bar: false # progress bar
    percentage: true # percentage
  # Website counter
  website_counter:
    url: https://cn.vercount.one/js # counter API URL (no need to change)
    enable: true # enable website counter or not
    site_pv: true # site page view
    site_uv: true # site unique visitor
    post_pv: true # post page view
  # Whether to enable single page experience (using swup). See https://swup.js.org/. similar to pjax
  single_page: true
  # Whether to enable Preloader.
  preloader:
    enable: false
    custom_message: # Custom message. If empty, the site title will be displayed
  # Side tools settings
  side_tools:
    # Whether to enable gear rotation animation for settings button
    gear_rotation: true
    # Whether to auto expand tools list on page load
    auto_expand: false
  # Whether to enable open graph
  open_graph:
    enable: true
    image: /images/redefine-og.webp  # default og:image
    description: Hexo Theme Redefine, Redefine Your Hexo Journey.
  # Google Analytics
  google_analytics:
    enable: false # Whether to enable Google Analytics
    id:  # Google Analytics Measurement ID
# SITE CUSTOMIZATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
    

# FONTAWESOME >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/basic/fontawesome
fontawesome: # Pro v6.2.1
  # Thin version
  thin: false
  # Light version
  light: false
  # Duotone version
  duotone: false
  # Sharp Solid version
  sharp_solid: false
# FONTAWESOME <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# HOME BANNER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/home/home_banner
home_banner:
  # Whether to enable home banner
  enable: true
  # style of home banner
  style: fixed # static or fixed
  # Home banner image
  image: 
    light: /images/wallhaven-wqery6-light.webp # light mode
    dark: /images/wallhaven-wqery6-dark.webp # dark mode
  # Home banner title
  title: Theme Redefine
  # Home banner subtitle
  subtitle:
    text: [] # subtitle text, array
    hitokoto:  # 一言配置
      enable: false # Whether to enable hitokoto
      show_author: false # Whether to show author
      api: https://v1.hitokoto.cn # API URL, can add types, see https://developer.hitokoto.cn/sentence/#%E5%8F%A5%E5%AD%90%E7%B1%BB%E5%9E%8B-%E5%8F%82%E6%95%B0
    typing_speed: 100 # Typing speed (ms)
    backing_speed: 80 # Backing speed (ms)
    starting_delay: 500 # Start delay (ms)
    backing_delay: 1500 # Backing delay (ms)
    loop: true # Whether to loop
    smart_backspace: true # Whether to smart backspace
  # Color of home banner text
  text_color: 
    light: "#fff" # light mode
    dark: "#d1d1b6" # dark mode
  # Specific style of the text
  text_style: 
    # Title font size
    title_size: 2.8rem
    # Subtitle font size
    subtitle_size: 1.5rem
    # Line height between title and subtitle
    line_height: 1.2
  # Home banner custom font
  custom_font: 
    # Whether to enable custom font
    enable: false
    # Font family
    family: 
    # URL to font CSS file
    url:
  # Home banner social links
  social_links:
    # Whether to enable
    enable: false
    # Social links style
    style: default # default, reverse, center
    # Social links
    links:
      - icon: github # can also be "fa-brands fa-github"
        url:
      - icon: twitter
        url:
      - icon: email
        url: you@example.com
      - icon: telegram
        url:
      - icon: /images/custom-icon.svg
        url:
    # Social links with QRcode drawers
    qrs:
      - icon: weixin
        qr:
      - icon: /images/custom-icon.svg
        qr:
# HOME BANNER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# NAVIGATION BAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/home/navbar
navbar:
  # Auto hide navbar
  auto_hide: false
  # Navbar background color
  color:
    left: "#f78736" #left side 
    right: "#367df7"  #right side
    transparency: 35 #percent (10-99)
  # Navbar width (usually no need to modify)
  width:
    home: 1200px #home page
    pages: 1000px #other pages
  # Navbar links
  links:
    Home: 
      path: / 
      icon: fa-regular fa-house # can be empty
    # Archives: 
    #   path: /archives 
    #   icon: fa-regular fa-archive # can be empty
    # Status: 
    #   path: https://status.ohevan.com/
    #   icon: fa-regular fa-chart-bar
    # About: 
    #   icon: fa-regular fa-user
    #   submenus:
    #     Me: /about
    #     Github: https://github.com/EvanNotFound/hexo-theme-redefine
    #     Blog: https://ohevan.com
    #     Friends: /friends
    # Links: 
    #   icon: fa-regular fa-link
    #   submenus:
    #     Link1: /link1
    #     Link2: /link2
    #     Link3: /link3
    # ...... # you can add more
  # Navbar search (local search). Requires hexo-generator-searchdb (npm i hexo-generator-searchdb). See https://github.com/theme-next/hexo-generator-searchdb
  search:
    # Whether to enable
    enable: false
    # Preload search data when the page loads
    preload: true
# NAVIGATION BAR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# HOME PAGE ARTICLE SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/home/home
home:
  # Sidebar settings
  sidebar:
    enable: true # Whether to enable sidebar
    position: left # Sidebar position. left, right
    first_item: menu # First item in sidebar. menu, info
    announcement: # Announcement text
    show_on_mobile: true # Whether to show sidebar navigation on mobile sheet menu
    links:
      # Archives: 
      #   path: /archives 
      #   icon: fa-regular fa-archive # can be empty
      # Tags: 
      #   path: /tags 
      #   icon: fa-regular fa-tags # can be empty
      # Categories: 
      #   path: /categories 
      #   icon: fa-regular fa-folder # can be empty
      # ...... # you can add more
  # Article date format
  article_date_format: auto # auto, relative, YYYY-MM-DD, YYYY-MM-DD HH:mm:ss etc.
  # Article excerpt length
  excerpt_length: 200 # Max length of article excerpt
  # Article categories visibility
  categories:
    enable: true  # Whether to enable
    limit: 3 # Max number of categories to display
  # Article tags visibility
  tags:
    enable: true  # Whether to enable
    limit: 3  # Max number of tags to display
# HOME PAGE ARTICLE SETTINGS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# ARTICLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/posts/articles
articles:
  # Set the styles of the article
  style:
    font_size: 16px # Font size
    line_height: 1.5 # Line height
    image_border_radius: 14px # image border radius
    image_alignment: center # image alignment. left, center
    image_caption: false # Whether to display image caption
    link_icon: true # Whether to display link icon
    delete_mask: false # Add mask effect to <del> tags, hiding content by default and revealing on hover
    title_alignment: left # Title alignment. left, center
    headings_top_spacing: # Top spacing for headings from h1-h6
      h1: 3.2rem
      h2: 2.4rem
      h3: 1.9rem
      h4: 1.6rem
      h5: 1.4rem
      h6: 1.3rem
  # Word count. Requires hexo-wordcount (npm install hexo-wordcount). See https://github.com/willin/hexo-wordcount
  word_count:
    enable: true # Whether to enable
    count: true # Whether to display word count
    min2read: true # Whether to display reading time
  # Author label
  author_label: 
    enable: true # Whether to enable
    auto: false # Whether to automatically add author label, e.g. Lv1, Lv2, Lv3...
    list: []
  # Code block settings
  code_block:
    copy: true # Whether to enable code block copy button
    style: mac # mac | simple
    highlight_theme: # Color scheme for highlightjs code highlighting. For preview, see https://highlightjs.org/examples
      light: github # light mode theme, support: github, atom-one-light, default
      dark: vs2015 # dark mode theme, support: github-dark, monokai-sublime, vs2015, night-owl, atom-one-dark, nord, tokyo-night-dark, a11y-dark, agate
    font: # Custom font
      enable: false # Whether to enable
      family: # Font family
      url: # Font URL to CSS file
  # Table of contents settings
  toc:
    enable: true # Whether to enable TOC
    max_depth: 3 # TOC depth
    number: false # Whether to add number to TOC automatically
    expand: true # Whether to expand TOC
    init_open: true # Open toc by default
  # Whether to enable copyright notice
  copyright:
    enable: true # Whether to enable
    default: cc_by_nc_sa # Default license, can be cc_by_nc_sa, cc_by_nd, cc_by_nc, cc_by_sa, cc_by, all_rights_reserved, public_domain
  # Whether to enable lazyload for images
  lazyload: true
  # Pangu.js (automatically add space between Chinese and English). See https://github.com/vinta/pangu.js
  pangu_js: false
  # Article recommendation. Requires nodejieba (npm install nodejieba). Transplanted from hexo-theme-volantis.
  recommendation:
    # Whether to enable article recommendation
    enable: false
    # Article recommendation title
    title: 推荐阅读
    # Max number of articles to display
    limit: 3
    # Max number of articles to display mobile
    mobile_limit: 2
    # Placeholder image
    placeholder: /images/wallhaven-wqery6-light.webp
    # Skip directory
    skip_dirs: []
# ARTICLE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# COMMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/posts/comment
comment:
  # Whether to enable comment
  enable: true
  # Comment system
  system: waline # waline, gitalk, twikoo, giscus, utterances, artalk
  # System configuration
  config:
    # Waline comment system. See https://waline.js.org/
    waline:
      serverUrl: https://example.example.com # Waline server URL. e.g. https://example.example.com
      lang: zh-CN # Waline language. e.g. zh-CN, en-US. See https://waline.js.org/guide/client/i18n.html
      emoji: [] # Waline emojis, see https://waline.js.org/guide/features/emoji.html
      recaptchaV3Key: # Google reCAPTCHA v3 key. See https://waline.js.org/reference/client/props.html#recaptchav3key
      turnstileKey: # Turnstile key. See https://waline.js.org/reference/client/props.html#turnstilekey
      reaction: false # Waline reaction. See https://waline.js.org/reference/client/props.html#reaction
    # Gitalk comment system. See https://github.com/gitalk/gitalk
    gitalk:
      clientID: # GitHub Application Client ID
      clientSecret: # GitHub Application Client Secret
      repo: # GitHub repository
      owner: # GitHub repository owner
      proxy: # GitHub repository proxy
    # Twikoo comment system. See https://twikoo.js.org/
    twikoo:
      version: 1.6.10 # Twikoo version, do not modify if you dont know what it is
      server_url: # Twikoo server URL. e.g. https://example.example.com
      region: # Twikoo region. can be empty
    # Giscus comment system. See https://giscus.app/
    giscus:
      repo: # Github repository name e.g. EvanNotFound/hexo-theme-redefine
      repo_id: # Github repository id
      category: # Github discussion category
      category_id: # Github discussion category id
      mapping: pathname # Which value to use as the unique identifier for the page. e.g. pathname, url, title, og:title. DO NOT USE og:title WITH PJAX ENABLED since pjax will not update og:title when the page changes
      strict: 0 # Whether to enable strict mode. e.g. 0, 1
      reactions_enabled: 1 # Whether to enable reactions. e.g. 0, 1
      emit_metadata: 0 # Whether to emit metadata. e.g. 0, 1
      lang: en # Giscus language. e.g. en, zh-CN, zh-TW
      input_position: bottom # Place the comment box above/below the comments. e.g. top, bottom
      loading: lazy # Load the comments lazily
    # Artalk comment system. See https://artalk.js.org/
    artalk:
      server: # Artalk server URL. e.g. https://artalk.example.com
      site: # Site name shown in Artalk admin (should match server-side site config)
    # Utterances comment system. See https://utteranc.es/
    utterances:
      repo: # GitHub repository name e.g. owner/repo (Issues must be enabled)
      issue_term: pathname # pathname, url, title, og:title (recommended: pathname for single-page mode)
      issue_number: # Use a specific issue number instead of issue_term
      label: # Optional label for created issues
      theme_light: github-light # Light theme
      theme_dark: github-dark # Dark theme
# COMMENT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# FOOTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/footer
footer:
  # Show website running time
  runtime: true # show website running time or not
  # Icon in footer, write fontawesome icon code here
  icon: '<i class="fa-solid fa-heart fa-beat" style="--fa-animation-duration: 0.5s; color: #f54545"></i>'
  # The start time of the website, format: YYYY/MM/DD HH:mm:ss
  start: 2022/8/17 11:45:14
  # Site statistics
  statistics: true # show site statistics or not (total articles, total words)
  # Footer message
  customize:
  # ICP record number. See https://beian.miit.gov.cn/
  icp:
    enable: false # Whether to enable
    number: # ICP record number
    url: # ICP record url
# FOOTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# INJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/inject
inject:
  # Whether to enable inject
  enable: false
  # Inject custom head html code
  head: 
    -
    -
  # Inject custom footer html code
  footer:
    -
    -
# INJECT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# PLUGINS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/plugins
plugins:
  # RSS feed. Requires hexo-generator-feed (npm i hexo-generator-feed). See https://github.com/hexojs/hexo-generator-feed
  feed:
    enable: false # Whether to enable
  # Aplayer. See https://github.com/DIYgod/APlayer
  aplayer:
    enable: false # Whether to enable
    type: fixed # fixed, mini
    audios:
      - name: # audio name
        artist: # audio artist
        url: # audio url
        cover: # audio cover url
        lrc: # audio cover lrc
#      - name: # audio name
#        artist: # audio artist
#        url: # audio url
#        cover: # audio cover url
#        lrc: # audio cover lrc
      # .... you can add more audios here
  # Mermaid JS. Requires hexo-filter-mermaid-diagrams (npm i hexo-filter-mermaid-diagrams). See https://mermaid.js.org/
  mermaid:
    enable: false # enable mermaid or not
    version: "11.4.1" # default v11.4.1
    theme:
      light: "default"
      dark: "dark"
# PLUGINS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# PAGE TEMPLATES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/page_templates
page_templates:
  # Friend Links page column number
  friends_column: 2
  # Tags page style
  tags_style: blur # blur, cloud
  # Masonry page batch size
  masonry:
    batch_size: 12
    initial_batch_size: 24
# PAGE TEMPLATES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end


# CDN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/cdn
cdn:
  # Whether to enable CDN
  enable: false
  # CDN Provider
  provider: npmmirror # npmmirror, zstatic, cdnjs, jsdelivr, unpkg, custom
  # Custom CDN URL
  # format example: https://cdn.custom.com/hexo-theme-redefine/${version}/source/${path}
  # The ${path} must leads to the root of the "source" folder of the theme
  custom_url: 
# CDN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end

# DEVELOPER MODE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/developer
developer:
  # Whether to enable developer mode (only for developers who want to modify the theme source code, not for ordinary users)
  enable: false
# DEVELOPER MODE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
```

之后所有配置项均在此文件中修改

#### 使用

```bash
 # 本地预览
npx hexo server
npm run server
# 生成静态文件
npx hexo generate
npm run build
# 清理缓存
npx hexo clean
npm run clean
# 新建文章
npx hexo new "文章名"
npm run new -- "文章名"
```
