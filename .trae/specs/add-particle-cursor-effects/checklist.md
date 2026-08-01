# Checklist

- [x] `_config.redefine.yml` 中存在 `effects` 配置段，含 `particles` 和 `cursoreffects` 两个布尔开关
- [x] `_config.redefine.yml` 的 `inject.footer` 中包含引用 `/js/effects-init.js` 的 `<script>` 标签
- [x] `source/js/effects-init.js` 文件存在于博客 source 目录（非主题目录）
- [x] effects-init.js 包含 `window.__effectsInitialized` 守卫，防止 swup 切页重复初始化
- [x] effects-init.js 读取 `window.theme.effects` 开关，关闭时不加载 CDN、不初始化
- [x] particles 参数与文档一致：100 颗、白色圆形、向下飘落、无连线、`pointer-events:none`
- [x] 光标参数与文档一致：`emoji:["❄️"]`、`length:4`、`size:8`
- [x] CDN 动态加载有 `typeof` 检查，避免 swup 重载时重复请求
- [x] CDN 加载失败时 `console.warn` 静默降级，不阻塞页面
- [x] 未修改 `themes/redefine/` 下任何文件（主题更新安全性）
- [x] `npm run build` 成功，`public/js/effects-init.js` 存在
- [x] 生成的 HTML 中 footer 区域包含 effects-init.js 脚本引用
