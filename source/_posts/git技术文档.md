---
title: git技术文档
date: 2026-07-05
categories: 技术文档
tags:
  - git
  - linux
---

[菜鸟教程](https://www.runoob.com/git/git-tutorial.html)
[图形化git学习](https://learngitbranching.js.org/?demo=&locale=zh_CN)
[官方参考教程](https://git-scm.com/book/zh/v2)

> ## ***警告***
>
> ***每次修改文件之前确保目前处在某一分支上，不然工作全白做！***

## 本地仓库

### 全局修改默认分支名称

```bash
git config --global init.defaultBranch main
```

### 初始化

```bash
git init
git add .
git commit -m "提交信息"
#空信息
git commit --allow-empty-message -m " "
#添加已追踪的文件并提交
git commit -a -m "提交信息"
#添加已追踪的文件并提交空信息
git commit -a --allow-empty-message -m " "
```

### 分支管理

#### 创建并切换到新分支

```bash
git checkout -b <newbranch>
```

#### 查看分支

```bash
#查看本地分支
git branch
#查看远程分支
git branch -r
#查看所有分支
git branch -a
```

#### 删除分支

>需切换到其他分支

```bash
#删除已合并的本地分支
git branch -d <branch>
#删除未合并的本地分支
git branch -D <branch>
#删除远程分支
git push origin :<branch>
```

#### 修改分支名

```bash
# 先切换到需要修改分支名的分支
git checkout -m <newBranchName>
```

#### 其他分支管理命令

```bash
git merge origin/main
git rebase
#交互式
git rebase -i <commit>
git cherry-pick
git branch
git checkout
git switch
......
```

### 暂存与取出

```bash
git stash
git stash pop
#清空所有暂存
git stash clear
```

### 撤销与删除

#### `git reset`

更改当前分支的提交历史，重置当前分支到特定提交

```bash
# 最佳实践
git reset HEAD^
#只重置 HEAD 到指定的提交，暂存区和工作目录保持不变
git reset --soft <commit>
#重置 HEAD 到指定的提交，暂存区重置，但工作目录保持不变(默认)
git reset --mixed <commit>
#重置 HEAD 到指定的提交，暂存区和工作目录都重置
git reset --hard <commit>
```

#### `git revert`

创建一个新的提交，用来撤销指定的提交，它不会改变提交历史，适用于已经推送到远程仓库的提交

```bash
# 最佳实践
git revert HEAD
git revert <commit>
```

### 图形化命令

```bash
#命令行图形
git log --graph
git log --oneline --graph
#图形化窗口
gitk
```

>图形化窗口乱码解决方法
>
>```bash
># 1. 设置提交日志的编码为UTF-8
>git config --global i18n.commitencoding utf-8
>
># 2. 设置日志输出、界面展示的编码为UTF-8
>git config --global i18n.logoutputencoding utf-8
>
># 3. 设置Git核心文件编码为UTF-8
>git config --global core.encoding utf-8
>
># 4. 关闭文件名转义，解决中文文件名乱码
>git config --global core.quotepath false
>
># 5. 针对Git GUI/gitk设置界面编码
>git config --global gui.encoding utf-8
>```

### 忽略特定文件

1. 创建`.gitignore`文件

```bash
touch .gitignore
```

2. 编写忽略规则

>每行写一个忽略规则

```gitignore
# 忽略单个文件
secret.txt

# 忽略整个目录
node_modules/
dist/

# 忽略特定类型的文件
*.log
*.tmp

# 忽略目录下的特定文件
build/*.log

# 不忽略某个文件（即使前面规则匹配了）
!important.log
```

3. 提交`.gitignore`文件

```bash
git add .gitignore
git commit -m "Add .gitignore file"
```

4. 处理已被 Git 跟踪的文件

>如果文件已经被 Git 跟踪，需要先从 Git 缓存中移除

```bash
# 移除单个文件（不删除本地文件）
git rm --cached secret.txt

# 移除整个目录（不删除本地目录）
git rm -r --cached node_modules/

# 提交更改
git commit -m "Stop tracking ignored files"
```

### 打包本地仓库

```bash
# 创建bundle文件
git bundle create repo.bundle --all
# 从bundle文件克隆仓库
git clone repo.bundle

git clone --mirror
```

### 删除提交历史

```bash
# 安装git-filter-repo
sudo apt install git-filter-repo
# 删除dist/目录提交历史
git filter-repo --path dist/ --invert-paths --force
# 删除appimage
git filter-repo --path hello.appimage --invert-paths --force
```

### 其他本地命令

```bash
#修改上一次提交的注释
git commit --amend -m "This is the correct message"
#修改分支名
git branch -m master master_copy
#查看修改
git diff
#查看状态
git status
#子模块
git submodule
#标签
git tag
```

## 远程仓库

### 推送

```bash
git remote add origin git@jihulab.com:jianyuewushuang/technicaldocumentation.git
#将远程仓库地址改为 HTTPS 格式
git remote set-url origin https://jihulab.com/jianyuewushuang/technicaldocumentation.git

#绑定远程仓库
git remote add origin https://jihulab.com/jianyuewushuang/technicaldocumentation.git
# 首次拉取远程分支
git pull origin main
#首次推送绑定分支
git push -u origin main
#单独绑定
git branch --set-upstream-to=origin/main main
```

### 拉取

```bash
# 第一次拉取或拉取失败时
git pull origin main --rebase
#有新文件
git pull origin main --allow-unrelated-histories
```

***拉取失败时:***

1. `git stash`暂存未提交的修改`git stash clear`清楚暂存的修改
2. `git clean -f`删除未跟踪的文件

### 断开与远程仓库的连接

```bash
git remote remove origin
```

### 克隆

```bash
git clone <远程仓库地址>
# 浅克隆
git clone --depth 1 <远程仓库地址>
# 后续克隆完整仓库
git fetch --unshallow
```

### 调整缓冲区大小

```bash
# 把缓冲区调至500M
git config --global http.postBuffer 524288000
```

## 图形化git工具

- Git GUI
- Sourcetree
- Git Extensions
- GitKraken（界面友好）
- Tower
- GitHub Desktop
- TortoiseGit(右键操作)
- GitButler(生成并在软件里管理虚拟分支)
- Gitnuro
- Git Cola
- sourcegit（界面友好，中文支持）
