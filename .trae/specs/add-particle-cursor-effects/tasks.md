# Tasks

- [x] Task 1: 在 `_config.redefine.yml` 新增 `effects` 配置段
  - [x] SubTask 1.1: 在 `DEVELOPER MODE` 段之前添加 `effects: particles: true / cursoreffects: true` 配置块（含注释说明）
  - [x] SubTask 1.2: 在 `inject.footer` 数组中添加 `<script src="/js/effects-init.js"></script>` 条目

- [x] Task 2: 创建博客级特效初始化脚本 `source/js/effects-init.js`
  - [x] SubTask 2.1: 创建 `source/js/` 目录（若不存在）并新建 `effects-init.js`
  - [x] SubTask 2.2: 实现 swup 守卫（`window.__effectsInitialized` 提前返回）
  - [x] SubTask 2.3: 实现读取 `window.theme.effects` 运行时开关逻辑
  - [x] SubTask 2.4: 实现动态加载 particles.js CDN（仅 `typeof particlesJS === 'undefined'` 时）+ 创建 `#particles-js` 固定容器 + 调用 `particlesJS("particles-js", {...})`（参数复用文档中的配置：100 颗白色圆形、向下飘落、无连线）
  - [x] SubTask 2.5: 实现动态加载 cursor-effects CDN（仅 `typeof cursoreffects === 'undefined'` 时）+ `new cursoreffects.emojiCursor({ emoji:["❄️"], length:4, size:8 })`
  - [x] SubTask 2.6: 所有外部加载使用 `onload` 回调初始化，失败时 `console.warn` 并静默降级

- [x] Task 3: 本地构建验证
  - [x] SubTask 3.1: 运行 `npm run clean && npm run build`（hexo generate），确认无报错
  - [x] SubTask 3.2: 确认 `public/js/effects-init.js` 存在（Hexo 已将博客级 source/js 输出为静态资源）
  - [x] SubTask 3.33: 确认生成的 HTML 页面 footer 中包含 `/js/effects-init.js` 的 `<script>` 标签

# Task Dependencies
- Task 2 依赖 Task 1（脚本引用路径需与 inject 配置一致）
- Task 3 依赖 Task 1 + Task 2
