---
id: Kubernetes1
title: 使用GKE(Google Kubernetes Engine)部署容器化应用 谷歌云快速入门(三)

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
tags: [facebook, hello, docusaurus,google cloud, linux]
---

link to [谷歌云快速入门(二) 存储文件然后共享](GoogleCloudStorage)

link to [谷歌云快速入门(四) 训练TensorFlow模型](TensorFlow)

link to [Container Registry 快速入门快速入门](docker)

link to [docker知识1](dockerhub)

link to [docker知识2](dockerhub_2)

## step 1 选择项目,启动Kubernetes Engine页面
![png](../img/kubernetes/1_create_project.png)
<!--truncate-->
![png](../img/kubernetes/2_create_API.png)

![png](../img/kubernetes/3_Kubernetes.png)

![png](../img/kubernetes/4_activate_API.png)


![png](../img/kubernetes/5_kubernetes.png)


## step 2 配置gcloud工具的默认设置
如需设置默认项目，请在 Cloud Shell 中运行以下命令：
```python
gcloud config set project project-id
```
如需设置默认计算地区，请运行以下命令：
```python
gcloud config set compute/zone compute-zone
```
![png](../img/kubernetes/2.png)

## step3 创建GKE集群
一个集群包含至少一台群主实例机器和多台工作器机器,这些工作机器称为"节点".节点是运行Kubernetes进程的Compute Engine虚拟机实例,如下图
![png](../img/kubernetes/10_cluster.png)

如需创建集群，请运行以下命令, 其中，cluster-name 是集群选择的名称。：
```python
gcloud container clusters create cluster-name
```

#### 获取用于该集群的身份验证凭据
创建集群后,需要获取身份验证凭据以便与该集群交互,命令为:
```python
gcloud container clusters get-credentials cluster-name
```
此命令将 kubectl 配置为使用您创建的集群。

### step4 创建Deployment

如果需要在集群中运行应用,需要运行一下命令:
```python
kubectl create deployment abc-server --image=gcr.io/clean-mountain-272313/flybirdgroup/classifier:latest
```
这个Kubernetes命令kubectl create deployment 会创建名为 abc-server 的 Deployment. 这个Deployment的Pod在其容器中运行hello-app映像

在此命令中:
--image 指定了要部署的容器镜像. 这个命令会从Container Registry(私有容器映像注册表)拉取gcr.io/clean-mountain-272313/flybirdgroup/classifier:latest

如何创建镜像和上传到私有容器镜像注册表

link to [Container Registry 快速入门快速入门](docker)

link to [docker知识1](dockerhub)

link to [docker知识2](dockerhub_2)

### step 5 公开deployment

部署应用后,需要将其公开到互联网,以便用户访问该应用.我们可以通过创建Service来公开应用,这是一种Kubernetes资源,可以将应用公开给外部流量.
```python
kubectl expose deployment abc-server --type LoadBalancer \
  --port 80 --target-port 8080 (这里请注意,如果是flask应用,target-port 选择5000)
```
#### 检查和查看应用
```python
kubectl get pods (查看正在运行的pod)
```
![png](../img/kubernetes/3.png)
如果status 是 Running 和 Ready的状态是1/1, 就可以进行下一步

#### 使用 kubectl get service 检查 abc-server Service：
```python
kubectl get service abc-server 
```
通过这个命令可以得到external-ip,复制service的外部ip地址,替换external-ip
```python
http://external-ip/
```
这样就想GKE(google Kebernetes Engine部署了一个容器化web应用)

![png](../img/kubernetes/7.png)

![png](../img/kubernetes/8.png)

# 查看service
可以查看kubernetes的所有service
```kubernetes
kubectl get service # 
```
这些service非常重要,因为pod之间的相连就是通过这些service的

# 删除pod
```
kubectl delete pod jenkins2-8698b5449c-grbdm(pod的名字)
kubectl get pod 
```
我们会发现pod没有被删除,这时候我们要输入一下命令
```
kubectl get deployment
kubectl delete deployment 名字name
kubectl get pod
```
就完全删除了






