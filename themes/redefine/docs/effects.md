# 粒子特效与光标特效实现说明

> 本文档记录  `redefine` 主题中 `effects.particles` 与 `effects.cursoreffects` 两项特效的实现方式。
> 配置入口：`_config.redefine.yml`

```yaml
effects:
  particles: true
  cursoreffects: true
```

---

## 一、整体架构

两种特效都走 **服务端 EJS 渲染** 这条路：在 Hexo 生成 HTML 时，根据 `_config.yml` 里的 `theme.effects.*` 开关，决定是否把对应的 `<script>` / 模块写进页面。第三方库统一通过 CDN 在 `<head>` 中加载。

```text
_config.yml (effects)
        │
        ├── head.ejs ──────── 加载 CDN 库（particles.min.js / cursor-effects）
        │
        ├── layout.ejs ────── 服务端 if(theme.effects.particles)
        │                     └─ 内联 <script> 调用 particlesJS("particles-js", {...})
        │
        └── scripts.ejs ───── 服务端 if(theme.effects.cursoreffects)
                              └─ renderJS('layouts/setup-cursor.js', {module:true})
                                  └─ build/layouts/setup-cursor.js
                                      └─ new cursoreffects.emojiCursor({...})
```

> EJS 模板里的 `theme` 指向 `hexo.theme`（即 `_config.yml` 解析结果），是**服务端**变量，因此开关判断在生成 HTML 时即完成，不依赖浏览器端配置。

---

## 二、粒子特效（particles）

### 1. CDN 库加载

文件：[`layout/components/header/head.ejs`](../layout/components/header/head.ejs#L16-L17)

```ejs
<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
<script src="https://unpkg.com/cursor-effects@latest/dist/browser.js"></script>
```

- 同步 `<script>`，在 `<head>` 中阻塞执行，提供全局函数 `particlesJS`。

### 2. DOM 容器

文件：[`layout/layout.ejs`](../layout/layout.ejs#L11-L13)

```html
<div id="particles-js"
     style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1; pointer-events: none; background: transparent;">
</div>
```

- 全站固定定位铺满视口，`pointer-events: none` 不拦截点击。

### 3. 初始化脚本（服务端条件渲染）

文件：[`layout/layout.ejs`](../layout/layout.ejs#L14-L133)

```ejs
<% if (theme.effects.particles) { %>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const mainDiv = document.getElementById("particles-js");
      if (mainDiv) {
        particlesJS("particles-js", {
          "particles": {
            "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle", ... },
            "opacity": { "value": 0.5, "random": true, ... },
            "size": { "value": 3, "random": true, ... },
            "line_linked": { "enable": false, ... },
            "move": { "enable": true, "speed": 1, "direction": "bottom", ... }
          },
          "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false }, ... } },
          "retina_detect": true
        });
      }
    });
  </script>
<% } %>
```

执行流程：

1. Hexo 渲染时 `theme.effects.particles === true` → 该 `<script>` 被写入 HTML。
2. 浏览器解析到 `<head>` 中的 `particles.min.js`（同步）→ 全局 `particlesJS` 就绪。
3. `DOMContentLoaded` 触发 → 调用 `particlesJS("particles-js", {...})`，在 `#particles-js` 容器内创建 canvas 粒子动画。

> 粒子参数（数量 100、白色圆形、向下飘落、无连线、无交互）均硬编码在此内联脚本中。

---

## 三、光标特效（cursoreffects）

### 1. CDN 库加载

同 [head.ejs:17](../layout/components/header/head.ejs#L17)：

```ejs
<script src="https://unpkg.com/cursor-effects@latest/dist/browser.js"></script>
```

- 提供全局对象 `cursoreffects`，其上挂载 `emojiCursor` 等光标效果类。

### 2. 初始化模块（服务端条件加载）

文件：[`layout/components/scripts.ejs`](../layout/components/scripts.ejs#L131-L141)

```ejs
<% if (theme.effects.cursoreffects) { %>
  <%- renderJS('layouts/setup-cursor.js', { module: true }) %>
<% } %>
```

`renderJS('layouts/setup-cursor.js', {module:true})` 经 [theme-helpers.js:106-108](../scripts/helpers/theme-helpers.js#L106-L108) 处理后，实际加载的是：

```text
/js/build/layouts/setup-cursor.js
```

即磁盘上的 [`source/js/build/layouts/setup-cursor.js`](../source/js/build/layouts/setup-cursor.js)：

```js
new cursoreffects.emojiCursor({
  emoji: ["❄️"],
  length: 4,
  size: 8
});
```

执行流程：

1. Hexo 渲染时 `theme.effects.cursoreffects === true` → 输出 `<script type="module" src="/js/build/layouts/setup-cursor.js">`。
2. `<head>` 中的 `cursor-effects` CDN（同步经典脚本）先执行 → 全局 `cursoreffects` 就绪。
3. 模块脚本（`type="module"` 默认 defer）在解析完成后执行 → `new cursoreffects.emojiCursor({...})`，鼠标移动时拖出 ❄️ emoji 粒子。

---

## 四、renderJS 与 build 加载机制

文件：[`scripts/helpers/theme-helpers.js`](../scripts/helpers/theme-helpers.js#L105-L109)

```js
hexo.extend.helper.register("renderJS", function (path, options = {}) {
  ...
  if (Array.isArray(path)) {
    path = path.map((p) => "js/build/" + p);
  } else {
    path = "js/build/" + path;
  }
  ...
});
```

`renderJS` 总是给路径加 `js/build/` 前缀。因此 `renderJS('layouts/setup-cursor.js')` 实际加载的是 `source/js/build/layouts/setup-cursor.js`（构建产物），而非 `source/js/layouts/` 下的源文件。

---

## 五、文件清单

| 文件 | 作用 |
| ------ | ------ |
| [`_config.yml`](../_config.yml#L339-L341) | `effects.particles` / `effects.cursoreffects` 开关 |
| [`layout/components/header/head.ejs`](../layout/components/header/head.ejs#L16-L17) | 加载 particles / cursor-effects CDN 库 |
| [`layout/layout.ejs`](../layout/layout.ejs#L11-L133) | `#particles-js` 容器 + 服务端条件内联 `particlesJS(...)` |
| [`layout/components/scripts.ejs`](../layout/components/scripts.ejs#L131-L141) | 服务端条件加载 `setup-cursor.js` 模块 |
| [`source/js/build/layouts/setup-cursor.js`](../source/js/build/layouts/setup-cursor.js) | `new cursoreffects.emojiCursor({...})` |
| [`scripts/helpers/theme-helpers.js`](../scripts/helpers/theme-helpers.js#L105-L109) | `renderJS` 实现，固定加 `js/build/` 前缀 |

---

## 六、注意事项

1. **CDN 库加载未按开关守卫**：`head.ejs` 中两个 CDN `<script>` 未用 `if (theme.effects.*)` 包裹，关闭开关时库仍会下载（只是不再调用初始化）。
2. **`setup-cursor.js` 为 build-only 产物**：`source/js/layouts/` 下无对应源文件，不会被 `build.js` 重新生成，修改时需直接编辑该文件，或补建源文件后跑 `npm run build:js`。
3. **容器 z-index**：`#particles-js` 为 `z-index:1`，若内容区层级更高或不透明，粒子可能被遮挡。
4. **`cursor-effects@latest`**：未锁版本，API 变动可能导致 `emojiCursor` 失效；unpkg 在部分地区可能不可达。
