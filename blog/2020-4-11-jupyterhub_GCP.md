---
id: jupyterhub_GCP
title: 5分钟在谷歌云上创建jupyterhub
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [git, lfs, github]
---
# 在GCP创建虚拟机
这个是常规操作,所以就不解释了
![png](../img/jupyterhub/left-menu-button.png)
![png](../img/jupyterhub/vm-instances-menu.png)
![png](../img/jupyterhub/enable-billing.png)
![png](../img/jupyterhub/create-vm-first.png)
## 选择region,
## cpu要超过1GB,
## Boot disk启动磁盘选择ubuntu 18.04LTS
<!--truncate-->
![png](../img/jupyterhub/machine-type-basic.png)
![png](../img/jupyterhub/boot-disk-button.png)
![png](../img/jupyterhub/boot-disk-ubuntu.png)

## 在identity and API access 选择No service account
这样做可以防止你的jupyter hub users 进入其他云服务,提升安全
![png](../img/jupyterhub/no-service-account.png)

## 防火墙的选择,允许http和https
![png](../img/jupyterhub/firewall.png)

## copy 以下链接到startup script上来安装jupyterhub
这里admin-user-name要替换成你的用户名,用来等下的登录,如"flybird"
```python
#!/bin/bash
curl https://raw.githubusercontent.com/jupyterhub/the-littlest-jupyterhub/master/bootstrap/bootstrap.py \
  | sudo python3 - \
    --admin <admin-user-name>
```
## 创建vm实例
![png](../img/jupyterhub/create-vm-button.png)
![png](../img/jupyterhub/vm-created.png)

## 大概20分钟后,jupyterhub就创建成功,我们可以复制external ip到浏览器查看
!! 注意, 没创建成功成, 浏览器会提示diaed tcp, conection refused, 所以不用着急
![png](../img/jupyterhub/first-login.png)

## 用之前startup script写的用户名登录
![png](../img/jupyterhub/1.png)

## 选择admin,可以创建用户
![png](../img/jupyterhub/2.png)
![png](../img/jupyterhub/3.png)
![png](../img/jupyterhub/4.png)
## 开启server,开启后,用户就可以登录了
![png](../img/jupyterhub/5.png)

## 进入终端,分别安装conda/pip安装包给所有用户
管理员admin能够使用命令 sudo -E 对整个环境安装工具包
```python
sudo -E conda install -c conda-forge gdal
```
![png](../img/jupyterhub/6.png)
![png](../img/jupyterhub/7.png)
![png](../img/jupyterhub/8.png)
![png](../img/jupyterhub/9.png)
```python
sudo -E pip install there
```
![png](../img/jupyterhub/10.png)

## 测试创建文件
![png](../img/jupyterhub/11.png)

## 测试新用户登录
![png](../img/jupyterhub/12.png)
![png](../img/jupyterhub/13.png)

# 成功啦!!!

## 好啦,现在要你有了硬核了,但是要有软东西啦,package要安装,对不对啊
比如安装 [conda, pip 或者apt package](http://tljh.jupyter.org/en/latest/install/google.html)嘛

## 去到jupyter terminal,所有package都在jupyter terminal安装哦
```
sudo -E conda install -c conda-forge gdal
sudo -E pip install there
pip install jupyter_contrib_nbextensions --user #用做jupyter自动提示
jupyter contrib nbextension install --user
pip install --user jupyter_nbextensions_configurator
jupyter nbextensions_configurator enable --user
```
[jupyter 代码提示自动补全参考链接](https://blog.csdn.net/mengfei2656/article/details/89287140)
这里要敲黑板啦,想安装更多pip , apt packages和权限进入不再jupyter Hub用户环境的设置等,请看[官网文档](http://tljh.jupyter.org/en/latest/howto/env/user-environment.html#howto-env-user-environment)

引用官网一段文字:
Accessing user environment outside JupyterHub
We add /opt/tljh/user/bin to the $PATH environment variable for all JupyterHub users, so everything installed in the user environment is available to them automatically. If you are using ssh to access your server instead, you can get access to the same environment with:
```
export PATH=/opt/tljh/user/bin:${PATH}
```

