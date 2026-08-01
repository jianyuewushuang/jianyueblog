---
title: PicInsert图床搭建教程
date: 2026-07-30
tags: 
  - 转载
  - 技术文档
---

使用图床在Markdown中插入图片

## 方案一：Github Repository

> *免费但需要科学上网才可以正常使用和阅读*

在 VS Code 中配合 **PicGo 插件** + **图床** 是目前程序员和技术写作者最主流的解决方案。它能让你在 VS Code 里直接 `Ctrl + V` 粘贴截图，自动上传并生成 Markdown 链接。

为了最快上手，推荐使用 **VS Code 纯插件版**（不需要安装 PicGo 桌面端软件，更加轻量）。

### 第一步：准备图床（存放图片的地方）

你需要一个“云端仓库”来存图片。

**GitHub（免费，但国内网络有时不稳定）**
    1.  在 GitHub 新建一个公开仓库（Public Repo），比如叫 `my-blog-images`。
    2.  点击头像 -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic)。
    3.  Generate new token，勾选 `repo` 权限，生成并**复制 Token**。

*(注：如果你追求极致速度和稳定，且有少许预算，阿里云 OSS 或腾讯云 COS 是终极方案，但配置稍繁琐)*

---

### 第二步：安装 VS Code 插件

1. 打开 VS Code。
2. 点击左侧侧边栏的 **扩展（Extensions）** 图标（快捷键 `Ctrl+Shift+X`）。
3. 搜索 `PicGo`。
4. 找到作者是 **Spades** 的那个插件（通常叫 **"PicGo"**），点击安装。

---

### 第三步：配置插件（将图床钥匙填入 VS Code）

1. 在 VS Code 中，点击左下角的**齿轮图标** -> **设置 (Settings)**。
2. 在设置搜索框中输入 `picgo`。
3. **配置上传器**：
    * 找到 `Picgo > Pic Bed: Uploader` 选项。
    * 在下拉菜单中选择你刚才准备的图床（例如 `smms` 或者 `github`）。
4. **填入密钥（Config）**：
       **如果是 GitHub**：
        *搜索 `picgo github`。
        *   `Branch`: 填 `main` (或者 master)。
        *`Custom Url`: 空着不填（除非你会用 CDN）。
        *   `Path`: 填 `images/` (图片存放的子目录，可不填)。
        *`Repo`: 填 `你的用户名/仓库名` (例如 `zhangsan/my-blog-images`)。
        *   `Token`: 粘贴 GitHub 的 Token。

---

### 第四步：开始使用

配置完成后，就可以开始写文档了。

1. **截图**：使用微信截图、QQ截图或系统截图工具（截图内容现在在剪贴板里）。
2. **粘贴**：
    * 打开你的 `.md` 文件。
    * **Windows**: 按快捷键 `Ctrl + Alt + U`。
    * **Mac**: 按快捷键 `Cmd + Opt + U`。
    * 或者：按 `F1` 打开命令面板，输入 `PicGo: Upload Image from Clipboard` 并回车。
3. **效果**：
    * 你会看到编辑器右下角提示“Uploading...”。
    * 几秒钟后，提示“Upload successfully”。
    * 你的光标处会自动变成：`![](https://s2.loli.net/2023/xx/xx/xxxx.png)`。

**此时，图片已经存储在云端，你的本地文件夹里只有一个清清爽爽的 `.md` 文件！**

---

### 进阶技巧与注意事项

#### 1. 自动重命名图片（防止文件名冲突）

默认上传的文件名可能很乱，建议开启自动重命名。

* 进入 VS Code 设置，搜索 `picgo config`。
* 找到 `Picgo: Auto Rename`，打勾。
* 这样上传时，插件会根据时间戳自动给图片起一个唯一的名字。

#### 2. 如果上传失败怎么办？

* **网络问题**：如果你用 GitHub，国内网络偶尔会抽风，报错 `Socket Error`。多试几次，或者挂代理。
* **日志查看**：在 VS Code 底部栏点击 "Output"（输出），右上角下拉框选择 "PicGo"，可以看到具体的报错信息。

#### 3. 关于图片数据的隐私与安全

* **一定要备份**：虽然图床很方便，但如果 GitHub 封号，图片就没了。
* **本地备份策略**：建议每隔几个月，把图床上的图片下载一份到本地硬盘冷备份（仅仅是为了以防万一，平时不需要放在文档文件夹里）。
* **隐私**：私密的个人证件、公司机密文档，**绝对不要**用这种方式上传到公共图床！对于机密文档，请老老实实回到“方案四”（本地 assets 文件夹）。

现在，你可以试试截图并按下快捷键，享受整洁的 Markdown 写作体验了！

## 阿里云 OSS

> *稳定、无需科学上网但收费（但不多）*

阿里云 OSS（对象存储）是目前**国内最稳定、速度最快**的方案。虽然它是收费的，但对于个人写文档、博客的图片流量来说，费用极低（通常一年也就几块钱甚至几毛钱），而且**完全不需要翻墙**，几乎不会出现“上传失败”的情况。

以下是详细的配置步骤，分为 **“阿里云控制台设置”** 和 **“VS Code 设置”** 两部分。

---

### 第一阶段：在阿里云获取必要的 5 个参数

你需要获取以下信息填入 VS Code：

1. `accessKeyId`
2. `accessKeySecret`
3. `bucket` (桶名)
4. `area` (区域节点)
5. `path` (存储路径，可选)

#### 步骤 1：创建 Bucket（存储桶）

1. 登录 [阿里云控制台](https://home.console.aliyun.com/)。
2. 搜索 **“OSS”** 或 **“对象存储”** 并进入。
3. 点击右侧的 **“创建 Bucket”** 按钮。
4. **填写关键配置（重点！）**：
    * **Bucket 名称**：起个名字（例如 `my-notes-img`），**记住它**。
    * **地域 (Region)**：选一个离你近的（例如 `华东1（杭州）`）。
    * **读写权限 (ACL)**：**必须选择【公共读】**。
        * *解释：因为 Markdown 里的图片需要被展示，如果是“私有”，别人（或者过期的你自己）就无法看到图片了。*
    * 其他选项保持默认即可。
5. 点击“确定”创建。

#### 步骤 2：获取 Region 代码 (area)

在 Bucket 列表里，点击你刚才创建的桶，找到 **“概览”** 页面。
找到 **“外网 Endpoint（地域节点）”**，通常长这样：`oss-cn-hangzhou.aliyuncs.com`。
你需要记下的 **Region 代码** 是前面的部分，即：`oss-cn-hangzhou`。

> **注意**：不要带 `.aliyuncs.com`，也不要带 `http://`。

#### 步骤 3：获取 AccessKey (账号钥匙)

为了安全，阿里云建议使用子用户（RAM），但为了方便上手，这里演示直接获取 AccessKey（请保管好，不要泄露）。

1. 鼠标悬停在右上角的**头像**上，点击 **“AccessKey 管理”**。
2. 点击 **“创建 AccessKey”**。
3. 进行手机验证。
4. 创建成功后，屏幕上会显示：
    * **AccessKey ID**
    * **AccessKey Secret**
5. **立刻复制并保存这两个字符串**（关掉窗口后 Secret 就再也看不到了！）。

---

### 第二阶段：在 VS Code 中配置 PicGo

1. 打开 VS Code。
2. 点击左下角**齿轮** -> **设置 (Settings)**。
3. 在搜索框输入 `picgo aliyun`。

请依次填写以下 5 项设置（对应刚才获取的信息）：

#### 1. 配置 AccessKey ID

* 设置项：`Picgo > Pic Bed > Aliyun: Access Key Id`
* 填入：刚才复制的 **ID**。

#### 2. 配置 AccessKey Secret

* 设置项：`Picgo > Pic Bed > Aliyun: Access Key Secret`
* 填入：刚才复制的 **Secret**。

#### 3. 配置 Bucket

* 设置项：`Picgo > Pic Bed > Aliyun: Bucket`
* 填入：你在步骤 1 创建的桶名称（例如 `my-notes-img`）。

#### 4. 配置 Area (地域)

* 设置项：`Picgo > Pic Bed > Aliyun: Area`
* 填入：你在步骤 2 确定的代码。
  * 如果你选的杭州，填 `oss-cn-hangzhou`
  * 如果你选的上海，填 `oss-cn-shanghai`
  * 如果你选的深圳，填 `oss-cn-shenzhen`
  * *切记不要填中文，也不要填完整的网址。*

#### 5. 配置 Path (可选，建议配置)

* 设置项：`Picgo > Pic Bed > Aliyun: Path`
* 填入：`img/`
  * *作用：这会自动把你上传的图片都放在 bucket 下的一个 img 文件夹里，方便以后管理。*

#### 6. 切换默认上传器

* 在设置搜索框输入 `picgo uploader`。
* 找到 `Picgo > Pic Bed: Current` (或者叫 `Uploader`)。
* 在下拉菜单中选择 **`aliyun`**。

---

### 第三阶段：测试与常见问题

#### 测试步骤

1. 随便截个图。
2. 在 VS Code 的 Markdown 文件里，按 `Ctrl + Alt + U` (Mac: `Cmd + Opt + U`)。
3. 观察右下角提示 `Upload successfully`。
4. 链接应该会自动变成类似：
    `![](https://my-notes-img.oss-cn-hangzhou.aliyuncs.com/img/2023xxxx.png)`

#### 如果图片能上传，但在 VS Code 里不显示（裂图）

* **原因**：你在创建 Bucket 时，权限没有选 **“公共读”**，而是选了“私有”。
* **解决**：
    1. 回到阿里云控制台 -> OSS -> 你的 Bucket。
    2. 点击 **“权限管理”** -> **“读写权限”**。
    3. 点击“设置”，修改为 **“公共读”**。

#### 开启自动重命名（强烈建议）

为了防止文件名冲突导致上传失败：

1. VS Code 设置搜索 `picgo auto rename`。
2. 勾选 `Picgo: Auto Rename`。

---

### 关于费用的定心丸

阿里云 OSS 是按量付费的，分为两部分：

1. **存储费**：存几张图片几乎可以忽略不计（几分钱）。
2. **流量费**：只有当你在公网上查看（下载）这张图片时才扣费。
    * 标准型存储大概是 0.5元/GB。
    * 写文档这种文本图片，假设你写了 100 张图，每张 100KB，一共才 10MB。被浏览 100 次，流量费可能还不到 1 分钱。
    * **充值建议**：往阿里云里充 **10 块钱**，足够你写好几年的文档了。

# <center>使用图床</br>在Markdown中插入图片</center>

## 方案一：Github Repository

> *免费但需要科学上网才可以正常使用和阅读*

在 VS Code 中配合 **PicGo 插件** + **图床** 是目前程序员和技术写作者最主流的解决方案。它能让你在 VS Code 里直接 `Ctrl + V` 粘贴截图，自动上传并生成 Markdown 链接。

为了最快上手，推荐使用 **VS Code 纯插件版**（不需要安装 PicGo 桌面端软件，更加轻量）。

### 第一步：准备图床（存放图片的地方）

你需要一个“云端仓库”来存图片。

**GitHub（免费，但国内网络有时不稳定）**
    1.  在 GitHub 新建一个公开仓库（Public Repo），比如叫 `my-blog-images`。
    2.  点击头像 -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic)。
    3.  Generate new token，勾选 `repo` 权限，生成并**复制 Token**。

*(注：如果你追求极致速度和稳定，且有少许预算，阿里云 OSS 或腾讯云 COS 是终极方案，但配置稍繁琐)*

---

### 第二步：安装 VS Code 插件

1. 打开 VS Code。
2. 点击左侧侧边栏的 **扩展（Extensions）** 图标（快捷键 `Ctrl+Shift+X`）。
3. 搜索 `PicGo`。
4. 找到作者是 **Spades** 的那个插件（通常叫 **"PicGo"**），点击安装。

---

### 第三步：配置插件（将图床钥匙填入 VS Code）

1. 在 VS Code 中，点击左下角的**齿轮图标** -> **设置 (Settings)**。
2. 在设置搜索框中输入 `picgo`。
3. **配置上传器**：
    * 找到 `Picgo > Pic Bed: Uploader` 选项。
    * 在下拉菜单中选择你刚才准备的图床（例如 `smms` 或者 `github`）。
4. **填入密钥（Config）**：
       **如果是 GitHub**：
        *搜索 `picgo github`。
        *   `Branch`: 填 `main` (或者 master)。
        *`Custom Url`: 空着不填（除非你会用 CDN）。
        *   `Path`: 填 `images/` (图片存放的子目录，可不填)。
        *`Repo`: 填 `你的用户名/仓库名` (例如 `zhangsan/my-blog-images`)。
        *   `Token`: 粘贴 GitHub 的 Token。

---

### 第四步：开始使用

配置完成后，就可以开始写文档了。

1. **截图**：使用微信截图、QQ截图或系统截图工具（截图内容现在在剪贴板里）。
2. **粘贴**：
    * 打开你的 `.md` 文件。
    * **Windows**: 按快捷键 `Ctrl + Alt + U`。
    * **Mac**: 按快捷键 `Cmd + Opt + U`。
    * 或者：按 `F1` 打开命令面板，输入 `PicGo: Upload Image from Clipboard` 并回车。
3. **效果**：
    * 你会看到编辑器右下角提示“Uploading...”。
    * 几秒钟后，提示“Upload successfully”。
    * 你的光标处会自动变成：`![](https://s2.loli.net/2023/xx/xx/xxxx.png)`。

**此时，图片已经存储在云端，你的本地文件夹里只有一个清清爽爽的 `.md` 文件！**

---

### 进阶技巧与注意事项

#### 1. 自动重命名图片（防止文件名冲突）

默认上传的文件名可能很乱，建议开启自动重命名。

* 进入 VS Code 设置，搜索 `picgo config`。
* 找到 `Picgo: Auto Rename`，打勾。
* 这样上传时，插件会根据时间戳自动给图片起一个唯一的名字。

#### 2. 如果上传失败怎么办？

* **网络问题**：如果你用 GitHub，国内网络偶尔会抽风，报错 `Socket Error`。多试几次，或者挂代理。
* **日志查看**：在 VS Code 底部栏点击 "Output"（输出），右上角下拉框选择 "PicGo"，可以看到具体的报错信息。

#### 3. 关于图片数据的隐私与安全

* **一定要备份**：虽然图床很方便，但如果 GitHub 封号，图片就没了。
* **本地备份策略**：建议每隔几个月，把图床上的图片下载一份到本地硬盘冷备份（仅仅是为了以防万一，平时不需要放在文档文件夹里）。
* **隐私**：私密的个人证件、公司机密文档，**绝对不要**用这种方式上传到公共图床！对于机密文档，请老老实实回到“方案四”（本地 assets 文件夹）。

现在，你可以试试截图并按下快捷键，享受整洁的 Markdown 写作体验了！

## 阿里云 OSS

> *稳定、无需科学上网但收费（但不多）*

阿里云 OSS（对象存储）是目前**国内最稳定、速度最快**的方案。虽然它是收费的，但对于个人写文档、博客的图片流量来说，费用极低（通常一年也就几块钱甚至几毛钱），而且**完全不需要翻墙**，几乎不会出现“上传失败”的情况。

以下是详细的配置步骤，分为 **“阿里云控制台设置”** 和 **“VS Code 设置”** 两部分。

---

### 第一阶段：在阿里云获取必要的 5 个参数

你需要获取以下信息填入 VS Code：

1. `accessKeyId`
2. `accessKeySecret`
3. `bucket` (桶名)
4. `area` (区域节点)
5. `path` (存储路径，可选)

#### 步骤 1：创建 Bucket（存储桶）

1. 登录 [阿里云控制台](https://home.console.aliyun.com/)。
2. 搜索 **“OSS”** 或 **“对象存储”** 并进入。
3. 点击右侧的 **“创建 Bucket”** 按钮。
4. **填写关键配置（重点！）**：
    * **Bucket 名称**：起个名字（例如 `my-notes-img`），**记住它**。
    * **地域 (Region)**：选一个离你近的（例如 `华东1（杭州）`）。
    * **读写权限 (ACL)**：**必须选择【公共读】**。
        * *解释：因为 Markdown 里的图片需要被展示，如果是“私有”，别人（或者过期的你自己）就无法看到图片了。*
    * 其他选项保持默认即可。
5. 点击“确定”创建。

#### 步骤 2：获取 Region 代码 (area)

在 Bucket 列表里，点击你刚才创建的桶，找到 **“概览”** 页面。
找到 **“外网 Endpoint（地域节点）”**，通常长这样：`oss-cn-hangzhou.aliyuncs.com`。
你需要记下的 **Region 代码** 是前面的部分，即：`oss-cn-hangzhou`。

> **注意**：不要带 `.aliyuncs.com`，也不要带 `http://`。

#### 步骤 3：获取 AccessKey (账号钥匙)

为了安全，阿里云建议使用子用户（RAM），但为了方便上手，这里演示直接获取 AccessKey（请保管好，不要泄露）。

1. 鼠标悬停在右上角的**头像**上，点击 **“AccessKey 管理”**。
2. 点击 **“创建 AccessKey”**。
3. 进行手机验证。
4. 创建成功后，屏幕上会显示：
    * **AccessKey ID**
    * **AccessKey Secret**
5. **立刻复制并保存这两个字符串**（关掉窗口后 Secret 就再也看不到了！）。

---

### 第二阶段：在 VS Code 中配置 PicGo

1. 打开 VS Code。
2. 点击左下角**齿轮** -> **设置 (Settings)**。
3. 在搜索框输入 `picgo aliyun`。

请依次填写以下 5 项设置（对应刚才获取的信息）：

#### 1. 配置 AccessKey ID

* 设置项：`Picgo > Pic Bed > Aliyun: Access Key Id`
* 填入：刚才复制的 **ID**。

#### 2. 配置 AccessKey Secret

* 设置项：`Picgo > Pic Bed > Aliyun: Access Key Secret`
* 填入：刚才复制的 **Secret**。

#### 3. 配置 Bucket

* 设置项：`Picgo > Pic Bed > Aliyun: Bucket`
* 填入：你在步骤 1 创建的桶名称（例如 `my-notes-img`）。

#### 4. 配置 Area (地域)

* 设置项：`Picgo > Pic Bed > Aliyun: Area`
* 填入：你在步骤 2 确定的代码。
  * 如果你选的杭州，填 `oss-cn-hangzhou`
  * 如果你选的上海，填 `oss-cn-shanghai`
  * 如果你选的深圳，填 `oss-cn-shenzhen`
  * *切记不要填中文，也不要填完整的网址。*

#### 5. 配置 Path (可选，建议配置)

* 设置项：`Picgo > Pic Bed > Aliyun: Path`
* 填入：`img/`
  * *作用：这会自动把你上传的图片都放在 bucket 下的一个 img 文件夹里，方便以后管理。*

#### 6. 切换默认上传器

* 在设置搜索框输入 `picgo uploader`。
* 找到 `Picgo > Pic Bed: Current` (或者叫 `Uploader`)。
* 在下拉菜单中选择 **`aliyun`**。

---

### 第三阶段：测试与常见问题

#### 测试步骤

1. 随便截个图。
2. 在 VS Code 的 Markdown 文件里，按 `Ctrl + Alt + U` (Mac: `Cmd + Opt + U`)。
3. 观察右下角提示 `Upload successfully`。
4. 链接应该会自动变成类似：
    `![](https://my-notes-img.oss-cn-hangzhou.aliyuncs.com/img/2023xxxx.png)`

#### 如果图片能上传，但在 VS Code 里不显示（裂图）

* **原因**：你在创建 Bucket 时，权限没有选 **“公共读”**，而是选了“私有”。
* **解决**：
    1. 回到阿里云控制台 -> OSS -> 你的 Bucket。
    2. 点击 **“权限管理”** -> **“读写权限”**。
    3. 点击“设置”，修改为 **“公共读”**。

#### 开启自动重命名（强烈建议）

为了防止文件名冲突导致上传失败：

1. VS Code 设置搜索 `picgo auto rename`。
2. 勾选 `Picgo: Auto Rename`。

---

### 关于费用的定心丸

阿里云 OSS 是按量付费的，分为两部分：

1. **存储费**：存几张图片几乎可以忽略不计（几分钱）。
2. **流量费**：只有当你在公网上查看（下载）这张图片时才扣费。
    * 标准型存储大概是 0.5元/GB。
    * 写文档这种文本图片，假设你写了 100 张图，每张 100KB，一共才 10MB。被浏览 100 次，流量费可能还不到 1 分钱。
    * **充值建议**：往阿里云里充 **10 块钱**，足够你写好几年的文档了。

> 原作者未知
