---
id: docker
title: Container Registry 快速入门快速入门

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

link to [Container Registry 快速入门快速入门](docker)

link to [docker知识1](dockerhub)

link to [docker知识2](dockerhub_2)

link to [谷歌云快速入门(三) 使用GKE(Google Kubernetes Engine)部署容器化应用](Kubernetes)

这里主要简述三个知识点:

构建 Docker 映像

将映像推送到项目的 Container Registry

从项目的 Container Registry 中拉取映像

## step1  构建Docker映像
1 首先创建一个目录
2 在此目录创建Dockfile,requirements.txt 和 app.py三个文件

Dockerfile
```dockerfile
# The file Dockerfile defines the image's environment
# Import Python runtime and set up working directory
FROM python:3.5-slim
WORKDIR /app
ADD . /app

# Install any necessary dependencies
RUN pip install -r requirements.txt

# Open port 80 for serving the webpage
EXPOSE 80

# Run app.py when the container launches
CMD ["python", "app.py"]

```
requirements.txt (这里使用pip freeze >requirements.txt 把工具包写入文件)

Flask

```
app.py
```

# The Docker image contains the following code in app.py
```
from flask import Flask
import os
import socket

app = Flask(__name__)

@app.route("/")
def hello():
    html = "<h3>Hello, World!</h3>"
    return html

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=80)

```

如需构建 Docker 映像，请从包含映像文件的目录运行以下 Docker 命令：
```python
docker build -t 名字 .
```
这样就创建了一个本地的Docker镜像了
如果想把它上传到Dockerhub, 请看link to [push镜像到自己的dockerhub](dockerhub)

# 如果需要进入容器修改,可输入一下命令
```python
sudo docker exec -it 容器id /bin/bash
```
然后使用vi来修改

# 修改后把容器变回镜像
```python
docker commit -m "备注内容" container ID 镜像名字
```
## step2 将映像添加到 Container Registry
将 docker 配置为使用 gcloud 命令行工具作为凭据帮助程序
如需推送或拉取映像，您必须将 Docker 配置为使用 gcloud 命令行工具对向 Container Registry 发出的请求进行身份验证。为此，请运行以下命令（您只需要执行此操作一次）
```python
gcloud auth configure-docker
```
## step3 映像推送到Container Registry了
### 因为国内墙的原因,我们可以使用Google Gloud Shell来操作push的动作
#### 步骤1 
登录Google Gloud Shell
    ![png](../img/kubernetes/4.png)
#### 步骤2
拉取在Dockerhub的镜像
    ![png](../img/kubernetes/5.png)
#### 步骤3    
```python
docker tag quickstart-image gcr.io/[PROJECT-ID]/quickstart-image:tag1
```
[PROJECT-ID] 是您的 Google Cloud Console 项目 ID，您需要将此 ID 添加到命令中。如果您的项目 ID 包含英文冒号 (:)，请参阅网域级项目。
gcr.io 是主机名
quickstart-image 是 Docker 映像的名称
tag1 是要添加到 Docker 映像的标记。如果您没有指定标记，Docker 将应用默认标记 latest。

![png](../img/kubernetes/6.png)

```
docker push gcr.io/[PROJECT-ID]/quickstart-image:tag1
```

## 清理
运行以下命令，以将 Docker 映像从 Container Registry 中删除
```python
gcloud container images delete gcr.io/[PROJECT-ID]/quickstart-image:tag1 --force-delete-tags
```


