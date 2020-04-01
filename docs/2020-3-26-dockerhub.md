---
id: dockerhub
title: push镜像到自己的dockerhub

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
## step1: 登录自己的dockerhub,点击create Repository

![png](../img/dockerhub/1.png)

## step2: 创建仓库repository
复制要保存的仓库名字和推送命令
![png](../img/dockerhub/2.png)

## step3: 查看本地仓库的镜像
```python
docker images
```
![png](../img/dockerhub/3.png)

## step4: 查看本地仓库的镜像
```python
docker tag 本地镜像名字 dockerhub仓库镜像名字
docker tag quickstart-image flybirdgroup/helloworld:lastest
```
![png](../img/dockerhub/4.png)



## step5: 推送镜像到远程仓库
```python
docker push flybirdgroup/helloworld:lastest
```
![png](../img/dockerhub/5.png)
