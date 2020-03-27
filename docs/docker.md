---
id: docker
title: 部署Docker容器映像+mac os Cloud SDK -谷歌云快速入门(三)

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
tags: [facebook, hello, docusaurus,google cloud, linux]
---
### 使用 Cloud Shell 配置 gcloud 并运行一个容器映像。

### 产品：Kubernetes Engine、Cloud SDK

#### 平均所需时间：30 分钟

link to [谷歌云快速入门(二) 存储文件然后共享](GoogleCloudStorage)
link to [谷歌云快速入门(四) 训练TensorFlow模型](TensorFlow)

## step 1 选择 shell
为完成本快速入门，您可以使用 Cloud Shell 或本地 shell。

Cloud Shell 是一种 shell 环境，用于管理托管在 Google Cloud 上的资源。Cloud Shell 预安装有 gcloud 命令行工具和 kubectl 命令行工具。gcloud 工具为 Google Cloud 提供了主要的命令行界面，kubectl 则为 Kubernetes 集群运行命令提供了主要命令行界面。

使用本地 shell，则必须在您的环境中安装 gcloud 工具和 kubectl 工具。

```python
gcloud components install kubectl
```
登录谷歌云账号
因为墙的原因,我们要设置Cloud SDK 以与代理/防火墙搭配使用
```python
gcloud config set proxy/type socks5
gcloud config set proxy/address 127.0.0.1
gcloud config set proxy/port 1086(your proxy port)
```
```python
gcloud auth login
```

## step2 设置默认项目
如需设置默认项目，请在 Cloud Shell 中运行以下命令：
将 project-id 替换为您的项目 ID。或者创建一个
```python
gcloud config set project project-id
```
设置默认计算地区
```python
gcloud config set compute/zone compute-zone
```
其中，compute-zone 是所需的地理计算地区，例如 us-west1-a。

## 创建 GKE 集群
```python
gcloud container clusters create cluster-haha
```

