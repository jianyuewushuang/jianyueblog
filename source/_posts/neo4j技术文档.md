---
title: neo4j技术文档
date: 2026-07-05
tags: 技术文档
---

## 安装

```bash
# 下载并安装秘钥
curl -fsSL https://debian.neo4j.com/neotechnology.gpg.key | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/neo4j.gpg
sudo apt update
sudo apt install neo4j
```

## 启动

```bash
# 启动服务
sudo systemctl start neo4j
# 连接neo4j数据库（初始用户名与密码均是neo4j）
cypher-shell -u neo4j -p neo4j
```

第一次连接neo4j数据库时，会要求修改密码，密码不能小于8位

在浏览器中访问localhost:7474进入可视化Web界面

用刚刚的密码登录

## 停止

```bash
sudo systemctl stop neo4j
neo4j stop
```
