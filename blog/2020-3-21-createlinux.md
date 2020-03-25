---
id: createlinux
title: Create Virtual Linux by Google 创建linux虚拟机

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [facebook, hello, docusaurus,google cloud, linux]
---

Learn how to build linux system in Google Cloud Platform [**Docusaurus 2 alpha**](https://v2.docusaurus.io/).

<!--truncate-->
## step1: 去compute Engine创建虚拟机实例

![png](../img/google/linuxs_object.png)

## step2: 创建实例

![png](../img/google/create_object.png)

## step3: 给虚拟机配置
<img src="../img/google/create_object_1.png" align="left"/>

## step4: 
名称,区域,机器配置,类型都是按需设置, 磁盘选择Linux 9,防火墙选择http流量

![png](../img/google/create_object_2.png)



## step 5: 

### 1) 我们可以看到有外部ip,我们要记住
   
### 2) 我们可以直接选择在浏览器窗口中打开,来进入虚拟机
   
<img src="../img/google/create_object_3.png" align="left"/>

![png](../img/google/virtual_linux.png)


# 使用终端连接到虚拟linux
## step 6: 添加本地密钥到元数据中

首先去元数据, 然后选择SSH密钥,点击修改按钮,添加本地的SSH密钥到框中
![png](../img/google/ssh.png)

## step 7: 使用本地终端连接
![png](../img/google/linxus1.png)



