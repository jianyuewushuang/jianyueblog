---
title: web技术文档
date: 2026-07-05
tags: 技术文档
---

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

用腾讯云托管可以用私有github仓库部署。

### Hexo

```bash
# 创建博客文件夹（替换成你想要的路径）
hexo init ~/blog
# 进入目录
cd ~/blog
# 安装项目依赖（或用yarn）yarn install
npm install
# 本地预览博客
hexo s
hexo server
npm run server
# 生成静态文件
hexo g
hexo generate
npm run build
# 部署（需提前配置_config.yml deploy）
hexo d
hexo deploy
npm run deploy
# 清理缓存
hexo clean
npm run clean
# 创建新文章
hexo new "文章标题"
# 创建草稿
hexo new draft "文章标题"
```
