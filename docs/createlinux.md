---
id: createlinux
title: Create Virtual Linux by Google 创建linux虚拟机-谷歌云快速入门(一)

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [facebook, hello, docusaurus,google cloud, linux]
---

author: 招晓贤

author_title: AI engine

author_url:  [代码地址](https://github.com/flybirdgroup)

<!--truncate-->
Learn how to build linux system in Google Cloud Platform This This is a link to [谷歌云快速入门(二) 存储文件然后共享](GoogleCloudStorage)

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
[如果创建了SSH密钥,可以直接去终端查找](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys#linux-%E5%92%8C-macos_1)
```
ls -al ~/.ssh 查看本地是否存在ssh密钥
公钥文件：~/.ssh/[KEY_FILENAME].pub
私钥文件：~/.ssh/[KEY_FILENAME]
cat ~/.ssh/id_rsa.pub #  查看public key
```

[创建新的 SSH 密钥](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys)
在您的工作站上打开一个终端，并使用 ssh-keygen 命令生成新的密钥。指定 -C 标志以添加一条带有您的用户名的注释
```
ssh-keygen -t rsa -f ~/.ssh/[KEY_FILENAME] -C [USERNAME]
chmod 400 ~/.ssh/[KEY_FILENAME] # 限制对您的私钥的访问，只有您能读取此密钥，且任何人都不能向其写入。
```



首先去元数据, 然后选择SSH密钥,点击修改按钮,添加本地的SSH密钥到框中
![png](../img/google/ssh.png)

## step 7: [使用本地终端连接](https://cloud.google.com/compute/docs/instances/connecting-advanced#thirdpartytools) 
```
ssh -i path-to-private-key username@external-ip
```
这里username是自己元数据那里修改的,zhao这个用户名可以换成任何名字
![png](../img/google/linux2.png)
![png](../img/google/linxus1.png)



