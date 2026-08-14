---
title: LLVM技术文档
date: 2026-07-17
categories: 技术文档
tags:
  - llvm
  - 编译链
excerpt: "LLVM是新一代编译链，对比传统GUN编译链有大量优势，也是MacOS的默认编译链。"
---

在Kubuntu（Ubuntu的KDE桌面版本）上使用LLVM编译链非常方便，主要通过系统的`apt`包管理器安装。

## 1. 安装LLVM编译链

打开终端，执行以下命令即可完成安装：

```bash
# 1. 更新软件包列表
sudo apt update

# 2. 安装 LLVM 和 Clang (核心编译器和工具链)
sudo apt install llvm clang

# 3. (可选) 安装额外工具，如LLD链接器和开发库
sudo apt install lld llvm-dev clang-dev
```

* `llvm`：包含LLVM核心库和工具。
* `clang`：C/C++/Objective-C的编译器前端。
* `lld`：LLVM项目自带的链接器，速度很快。
* `llvm-dev` 和 `clang-dev`：如果你打算基于LLVM开发自己的工具，则需要安装这些开发库。

## 2. 验证安装

安装完成后，可以运行以下命令来验证是否安装成功并查看版本信息：

```bash
clang --version
llvm-config --version
```

## 3. 基本使用方法

安装完成后，`clang`和`clang++`的使用方法与`gcc`和`g++`非常相似。

* **编译C程序**：

    ```bash
    clang hello.c -o hello
    ```

* **编译C++程序**：

    ```bash
    clang++ hello.cpp -o hello
    ```

## 4. 进阶用法：安装特定版本

如果你需要特定版本的LLVM（例如，LLVM 18），可以通过LLVM官方提供的APT仓库来安装。

1. **添加LLVM官方仓库**：
    首先，访问 [https://apt.llvm.org/](https://apt.llvm.org/) 获取适用于你Kubuntu版本的安装脚本并执行。
2. **安装特定版本**：
    仓库添加成功后，就可以像安装默认版本一样安装特定版本了。

    ```bash
    # 例如，安装 LLVM 18 的 Clang
    sudo apt install clang-18
    ```

    注意，安装特定版本后，对应的可执行文件名称会包含版本号，例如 `clang-18`。

## 5. 交叉编译

LLVM的一大优势是易于进行交叉编译。例如，在x86机器上编译ARM架构的程序：

```bash
# 1. 安装ARM目标平台的系统库
sudo apt install libc6-armel-cross libc6-dev-armel-cross gcc-arm-linux-gnueabihf g++-arm-linux-gnueabihf

# 2. 使用 --target 参数指定目标平台
clang --target=arm-linux-gnueabihf --sysroot=/usr/arm-linux-gnueabihf -fuse-ld=lld hello.c -o hello_arm
```

## 6. 故障排除：`llvm-config` 未找到

如果你在编译依赖LLVM的项目时遇到 `llvm-config` 命令未找到的错误，可以安装对应的开发包：

```bash
sudo apt install llvm-dev
```

`llvm-dev` 包会提供 `llvm-config` 工具，它用于获取已安装LLVM的编译和链接参数。
