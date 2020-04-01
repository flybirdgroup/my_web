---
id: App
title: App Engine 使用快速入门

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [python, hello, docusaurus,google cloud, docker]
---

## step1: 创建自己的独立项目

![png](../img/appengine/1.png)
<!--truncate-->
## step2: 使用App Engine
![png](../img/appengine/2.png)

## step3: 使用App Engine的两个重要命令
```
gcloud init 初始化SDK
gcloud app deploy 部署到App Engine
```
![png](../img/appengine/3.png)

## step4: 按照需要, 开启API 
![png](../img/appengine/4.png)

## step5:本地终端操作登录账号,设置默认项目
![png](../img/appengine/5.png)

![png](../img/appengine/6.png)

![png](../img/appengine/7.png)

## step6: 下载项目/或者本地项目
![png](../img/appengine/8.png)

## step7: 使用step3的命令部署, 点击得到的链接
```
gcloud app deploy 部署
gcloud app browse 查看效果
```
![png](../img/appengine/13.png)

![png](../img/appengine/9.png)

## 备注: 部署到app engine的几个重要文件
1 app.yaml

2 requirements.text

3 main.py


![png](../img/appengine/10.png)
![png](../img/appengine/11.png)
![png](../img/appengine/12.png)
