# 博客粒子特效与光标特效 Spec

## Why

用户希望根据 `themes/redefine/docs/effects.md` 文档为博客启用粒子飘落特效和 ❄️ 光标拖尾特效。
该文档描述的实现方式是直接修改主题模板文件（`head.ejs` / `layout.ejs` / `scripts.ejs`），
但当前主题是** vendored 进博客仓库**（非 submodule，无独立 `.git`），后续更新主题时
手动替换主题文件会覆盖这些改动。因此本 spec 采用**注入式方案**（inject 机制 + 博客级 JS 文件），
在不修改任何主题文件的前提下实现等效效果，使特效在主题更新后依然存活。

## 对用户三个问题的回答

### Q1：可以根据该文档实现吗？
可以。文档描述的视觉效果（100 颗白色圆形粒子向下飘落 + ❄️ emoji 光标拖尾）将完整实现，
但加载方式从「修改主题模板」改为「使用主题内置 inject 注入 + 博客 `source/js/` 自有脚本」，
二者最终在浏览器中的行为一致。

### Q2：会与当前博客主题冲突吗？
基本不会，已识别并处理以下潜在冲突点：
- **swup 单页模式**（`global.single_page: true`）：inject 注入的 `<script>` 会被加上
  `data-swup-reload-script`，每次页面切换都会重新执行。初始化脚本通过
  `window.__effectsInitialized` 守卫变量避免重复创建粒子画布 / 光标实例。
- **z-index 层级**：粒子容器 `z-index:1`、`pointer-events:none`，不拦截点击；
  若内容区不透明且层级更高，粒子可能被遮挡（与文档方案一致，属于预期行为）。
- **CDN 可用性**：particles.js 走 jsdelivr，cursor-effects 走 unpkg；脚本在库加载
  完成后才初始化，库不可达时静默降级（不报错、不阻塞页面）。
- **注入位置**：inject.footer 渲染在 `<footer>` 内部，但粒子容器使用 `position:fixed`，
  脱离文档流，DOM 位置不影响视觉效果。

### Q3：后续更新博客主题时会覆盖这个效果吗？
**不会**（本方案的核心优势）：
- 特效开关配置在 `_config.redefine.yml`（博客级配置，非主题文件）。
- 初始化脚本放在博客 `source/js/effects-init.js`（博客级资源，非主题 `source/`）。
- 不修改 `themes/redefine/` 下的任何文件。
- 主题更新（替换 `themes/redefine/` 目录）不会触及上述两处。

> 对比：若按文档原方案修改 `themes/redefine/layout/*.ejs` 和
> `themes/redefine/source/js/build/layouts/setup-cursor.js`，主题更新时**会被覆盖**。

## What Changes

- 在 `_config.redefine.yml` 新增 `effects` 配置段（`particles` / `cursoreffects` 开关）。
- 在 `_config.redefine.yml` 的 `inject.footer` 数组中新增一条 `<script>` 标签，
  引用博客级 JS 文件 `/js/effects-init.js`。
- 在博客 `source/js/effects-init.js`（新建）中实现自包含的特效初始化逻辑：
  - 读取 `window.theme.effects` 运行时开关（由 `config-export.js` 注入）。
  - 动态加载 particles.js / cursor-effects CDN 库（仅在未加载时加载，避免 swup 重载浪费）。
  - 创建 `#particles-js` 固定容器并调用 `particlesJS(...)`。
  - 调用 `new cursoreffects.emojiCursor({ emoji:["❄️"], length:4, size:8 })`。
  - 全程 `window.__effectsInitialized` 守卫，兼容 swup 页面切换。

## Impact

- Affected code:
  - `_config.redefine.yml`（新增 `effects` 段 + `inject.footer` 条目）
  - `source/js/effects-init.js`（新建，博客级资源）
- 不触及 `themes/redefine/` 下任何文件。
- 不需要 `npm run build`（博客级 JS 直接由 Hexo 作为静态资源输出，无需主题构建）。

## ADDED Requirements

### Requirement: 粒子飘落特效
系统 SHALL 在 `effects.particles` 为 true 时，于全站视口铺设一层固定定位、
不拦截点击的 canvas 粒子动画：100 颗白色圆形粒子、向下飘落、无连线、无交互。

#### Scenario: 开启粒子特效
- **WHEN** `_config.redefine.yml` 中 `effects.particles: true`
- **THEN** 页面加载后视口出现向下飘落的白色粒子动画
- **AND** 粒子层 `pointer-events:none`，不影响页面点击

#### Scenario: 关闭粒子特效
- **WHEN** `effects.particles: false`
- **THEN** 不加载 particles.js CDN，不创建粒子容器，无粒子动画

### Requirement: 光标拖尾特效
系统 SHALL 在 `effects.cursoreffects` 为 true 时，使鼠标移动时拖出 ❄️ emoji 粒子。

#### Scenario: 开启光标特效
- **WHEN** `effects.cursoreffects: true`
- **THEN** 鼠标移动时产生 ❄️ emoji 拖尾（length:4, size:8）
- **AND** 拖尾不拦截点击

#### Scenario: 关闭光标特效
- **WHEN** `effects.cursoreffects: false`
- **THEN** 不加载 cursor-effects CDN，不创建光标实例

### Requirement: swup 单页模式兼容
系统 SHALL 在 swup 页面切换时不重复创建粒子画布或光标实例。

#### Scenario: swup 页面切换
- **WHEN** `global.single_page: true` 且用户通过 swup 导航到新页面
- **THEN** inject.footer 脚本重新执行，但守卫变量阻止重复初始化
- **AND** 已存在的粒子动画和光标实例继续工作，不出现叠层

### Requirement: 主题更新不丢失特效
系统 SHALL 将所有特效相关代码放在博客级文件中，不修改主题文件。

#### Scenario: 更新主题
- **WHEN** 用户替换 `themes/redefine/` 目录以更新主题
- **THEN** 特效继续正常工作（配置和脚本均在博客级文件中）
- **AND** 无需重新应用任何主题文件改动
