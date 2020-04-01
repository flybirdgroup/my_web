---
id: dockerhub_2
title: 从Dockerhub拉取镜像并且使用命令运行

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [facebook, hello, docusaurus,google cloud, docker]
---
<!--truncate-->
link to [谷歌云快速入门(二) 存储文件然后共享](GoogleCloudStorage)

link to [谷歌云快速入门(四) 训练TensorFlow模型](TensorFlow)

link to [Container Registry 快速入门快速入门](docker)

link to [docker知识1](dockerhub)

link to [docker知识2](dockerhub_2)

link to [谷歌云快速入门(三) 使用GKE(Google Kubernetes Engine)部署容器化应用](Kubernetes)
## step1: 登录自己的dockerhub,选择需要拉下的镜像

![png](../img/dockerhub/6.png)

## step2: 点击镜像,点击public view获取拉取命令

![png](../img/dockerhub/7.png)

## step3: 复制获取拉取命令

![png](../img/dockerhub/8.png)

## step4: 在终端输入拉取命令
1) 拉取镜像
```python
docker pull 镜像名字
```
2)查看镜像
```python
docker images
```
![png](../img/dockerhub/9.png)

## step4: 运行镜像
```python
docker run -p 127.0.0.1:80:5000/tcp flybirdgroup/classifier
```
![png](../img/dockerhub/10.png)

## step5:浏览器运行
```python
在浏览器输入: 127.0.0.1
```
![png](../img/dockerhub/11.png)

## step6:完美运行

![png](../img/dockerhub/12.png)









