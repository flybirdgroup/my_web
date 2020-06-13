---
id: jenkins
title: 设立Jenkins在GKE上
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [Jenkins, GKE]
---

设置zone和下载代码
```
gcloud config set compute/zone us-east1-d
git clone https://github.com/GoogleCloudPlatform/continuous-deployment-on-kubernetes.git
cd continuous-deployment-on-kubernetes
```
<!--truncate-->
创建GKE集群
```
gcloud container clusters create jenkins-cd \
--num-nodes 2 \
--machine-type n1-standard-2 \
--scopes "https://www.googleapis.com/auth/projecthosting,cloud-platform"
```
查询cluster是否运行
```
gcloud container clusters list
```

获取凭证去连接你的GKE
```
gcloud container clusters get-credentials jenkins-cd
```
确认是否能连接到集群
```
kubectl clusters-info
```

安装Helm
```
wget https://storage.googleapis.com/kubernetes-helm/helm-v2.9.1-linux-amd64.tar.gz
```
解压
```
tar zxfv helm-v2.9.1-linux-amd64.tar.gz
cp linux-amd64/helm .
```

添加自己作为云的管理者🙆给jenkins权限到集群
```
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=$(gcloud config get-value account)
```

给Tiller集群管理者权限
```
kubectl create serviceaccount tiller --namespace kube-system
kubectl create clusterrolebinding tiller-admin-binding --
clusterrole=cluster-admin --serviceaccount=kube-system:tiller
```

初始化helm,这样可以保证Helm(Tiller)服务端是正确安装到集群上
```
./helm init --service-account=tiller
./helm repo update
```

确认helm是否安装成功,应该看到出现在服务端和客户端是v2.9.1
```
./helm version
```


用Helm CLI命令去部署设置
```
./helm install -n cd stable/jenkins -f jenkins/values.yaml --version 0.16.6 --wait
```

确认jenkins pod运行
```
kubectil get pods
```

运行命令去设置jenkins UI界面
```
export POD_NAME=$(kubectl get pods -l "component=cd-jenkins-master" -o jsonpath="{.items[0].metadata.name}")
kubectl port-forward $POD_NAME 8080:8080 >> /dev/null &
```

测试Jenkins Service是否创建正确
```
kubectl get svc
```

连接到Jenkins-Jenkins会自动创建密码,获取它,运行一下命令:
```
printf $(kubectl get secret cd-jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode);echo
```

我这边出现的密码是
```
JrK3zwoGFI
```
然后去gcloud shell 的Web Preview上选择Preview on Port 8080,
![png](../img/Jenkins/1.png)
然后输入
```
username: admin
password: JrK3zwoGFI
```
![png](../img/Jenkins/2.png)


## 删除命令:
```
kubectl get deployment
kubectl delete deployment 名字name
kubectl get pod 

#删除pod后,删除clusters
```
gcloud containers clusters delete name
```
![png](../img/Jenkins/3.png)

