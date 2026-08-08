---
title: WSL2技术文档
date: 2026-06-06
categories: 技术文档
tags:
  - wsl2
  - linux
  - windows
  - 虚拟机
excerpt: false
---

WSL2是Windows Subsystem for Linux的第二代版本。它允许你在Windows操作系统内原生运行Linux发行版（如Ubuntu、Debian等），无需传统的虚拟机或双系统启动。

WSL2的核心是一个轻量级的虚拟机，它运行一个完整的Linux内核，因此提供了与原生Linux几乎完全一致的系统调用兼容性和出色的文件系统性能。这对于开发者、学生或系统管理员来说非常有用，可以方便地在Windows环境下使用Linux工具链进行开发、学习或管理服务器。

简单来说，WSL2让你能在Windows上无缝获得一个高效的Linux工作环境。

使用WSL2主要分为安装配置和日常使用两个阶段，以下是详细指南：

## 一、安装WSL2

### 1. 系统要求检查

- **Windows版本**：Windows 10版本2004（内部版本19041）或更高，或Windows 11
- **虚拟化支持**：需要在BIOS中开启CPU虚拟化（Intel VT-x或AMD-V）
- **内存**：至少4GB，推荐8GB以上

### 2. 安装步骤（推荐命令行快速安装）

1. **以管理员身份打开PowerShell**：右键点击开始菜单，选择"Windows PowerShell（管理员）"或"终端（管理员）"
2. **启用WSL功能**：运行以下命令

   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

3. **重启电脑**：这是关键步骤，确保功能生效
4. **设置WSL2为默认版本**：重启后运行

   ```powershell
   wsl --set-default-version 2
   ```

5. **安装Linux发行版**：运行以下命令安装默认Ubuntu

   ```powershell
   wsl --install
   ```

   或指定版本：`wsl --install -d Ubuntu-22.04`

### 3. 初始化设置

安装完成后，系统会自动弹出终端窗口，需要：

- 创建UNIX用户名（纯英文，小写）
- 设置密码（输入时屏幕不显示，正常输入后回车）
- 再次确认密码

## 二、基本使用方法

### 1. 启动WSL2

- 在开始菜单搜索安装的发行版名称（如"Ubuntu"）并打开
- 在命令提示符或PowerShell中输入`wsl`直接启动

### 2. 文件系统访问

- **在WSL中访问Windows文件**：Windows的C盘、D盘挂载在`/mnt`目录下

  ```bash
  cd /mnt/d/project  # 访问D盘的project文件夹
  ```

- **在Windows中管理Linux文件**：在WSL终端中输入

  ```bash
  explorer.exe .  # 用Windows资源管理器打开当前Linux目录
  ```

### 3. 常用命令

- 查看已安装的WSL发行版：`wsl -l -v`
- 关闭WSL：`wsl --shutdown`
- 卸载发行版：`wsl --unregister <发行版名称>`

## 三、实用技巧

### 1. 开发环境集成

- **VSCode集成**：安装"Remote - WSL"扩展，可直接在Linux环境中开发
- **Docker支持**：WSL2支持Docker等虚拟化工具，适合后端开发

### 2. 性能优化

- 将工作文件存储在WSL文件系统（如`~/project`）以获得最佳性能
- 避免频繁跨操作系统访问文件，可能导致性能下降

### 3. 资源管理

- WSL2进程会显示在Windows任务管理器中，可监控资源占用
- 可通过`wsl --shutdown`完全关闭释放资源

## 四、注意事项

1. **WSL1 vs WSL2选择**：2024年后优先选择WSL2，除非Windows版本过低或仅需简单Shell命令
2. **存储位置**：WSL默认安装到C盘，如需更改位置需手动操作
3. **网络配置**：WSL2有独立虚拟网卡，部分场景需要端口转发

WSL2为Windows用户提供了接近原生Linux的开发体验，特别适合需要在Windows环境下使用Linux工具链的开发者、学生和系统管理员。

安装WSL2所需的存储空间因使用场景而异，可以分为以下几个层次：

## 一、官方最低要求

根据微软官方文档，安装WSL2的**最低存储空间要求为5GB**。这是能保证基础系统运行的最基本空间。

## 二、实际安装占用

一个全新安装的Ubuntu WSL2实例，初始物理占用空间很小：

- **最小占用**：约60MB
- **典型范围**：80MB-150MB  
- **上限情况**：可达200MB

这个空间主要用于存储Linux基础系统的核心组件，包括bash、coreutils、apt包管理系统等。

## 三、不同使用场景建议

### 1. 基础学习/简单使用

- **建议空间**：10-20GB
- **适用场景**：学习Linux命令、简单脚本开发
- **依据**：Windows 11系统安装指南建议至少10GB

### 2. 开发环境（推荐配置）

- **建议空间**：40-100GB
- **适用场景**：安装开发工具链、IDE、编译环境
- **依据**：系统更新、软件安装会显著增加占用

### 3. 容器/虚拟化开发

- **建议空间**：100GB以上
- **适用场景**：运行Docker、Kubernetes、数据库等
- **依据**：Docker Desktop集成可能增加2GB+空间，镜像和容器数据会持续增长

## 四、空间管理机制

WSL2使用动态扩展的虚拟硬盘（VHDX文件），具有以下特点：

1. **默认上限**：1TB（早期版本为512GB或256GB）
2. **动态增长**：随着Linux文件系统的写入操作逐步增大
3. **不会自动回收**：即使删除Linux内文件，Windows看到的VHDX文件大小可能保持高位

## 五、空间优化建议

1. **定期清理**：使用`sudo apt clean`清理APT缓存，删除临时文件
2. **监控使用**：在WSL中运行`df -h /`查看空间使用情况
3. **迁移位置**：如果C盘空间紧张，可将WSL迁移到其他分区

## 总结建议

对于大多数用户，**建议预留40-100GB空间**作为起点。如果只是体验Linux基础功能，10GB可能足够；但如果是专业开发或需要运行容器，建议直接预留100GB以上，避免后续空间不足的麻烦。
