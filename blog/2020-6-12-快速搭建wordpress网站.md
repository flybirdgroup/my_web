---
id: WordPress
title: 云上快速搭建WordPress网站

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
tags: [facebook, hello, docusaurus,google cloud, linux]
---

# 整个流程是

我们将会在这台服务器上搭建和部署LAMP环境，然后安装WordPress网站，最后向大家展示如何在WordPress网站使用微博挂件和网站统计平台

## step1 Login the vm instance

![png](../img/aliyun/wordpress/1.png)

## step2.1 搭建开发环境
```
yum -y install httpd
yum -y install httpd-manual mod_ssl mod_perl mod_auth_mysql #安装 apache 的扩展文件。
service httpd start #启动 apache http 服务。
chkconfig httpd on 设置开机自动启动 apache http 服务。
```

## step2.2 校验
去公网ip查看

## step2.3: 下载和安装MySQL数据库

```
yum -y install mysql mysql-server
service mysqld start #启动服务
mysql_secure_installation #修改 MySQL 数据库 root 用户的密码，并提高 MySQL 数据库的安全性。
```
```
# 输入以下命令
mysql -uroot -p123

show databases;

create database wordpress;

show databases;

exit

chkconfig mysqld on #设置开机自动启动MySQL服务
```
![png](../img/aliyun/wordpress/2.png)


## step2.4: 安装PHP语言环境
```
yum -y install php php-mysql
yum -y install gd php-gd gd-devel php-xml php-common php-mbstring php-ldap php-pear php-xmlrpc php-imap #安装 php 常用扩展包
service httpd restart #重启服务,这步很重要,必须重启

echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php #执行此命令，创建一个 php 页面，测试 PHP 环境
```

## step2.5 在浏览器测试php页面
```
弹性ip/phpinfo.php
```
![png](../img/aliyun/wordpress/3.png)

## step3 安装部署wordpress
下载中文版WordPress安装包，请点击链接 https://cn.wordpress.org/，这个是WordPress中文官网，可以找到最新的版本并下载安装； 下载完成后,解压
```
tar -xzf wordpress-4.7.4-zh_CN.tar.gz
ls
```
### 备份 WordPress 配置文件，并将原有的示例配置文件样本保留。
```
cd wordpress
cp wp-config-sample.php wp-config.php
```
### 进入 wp-config.php 的编辑页面：
```
vim wp-config.php
```
### 按键盘 i ，进入编辑状态，修改配置文件的数据库信息：修改 DB_NAME 的参数值 database_name_here 为之前创建的数据库 wordpress：
```
define('DB_NAME', 'wordpress');
```

### 修改 DB_USER 的参数值 username_here 为 root :
```
define('DB_USER', 'root');
```

### 修改 DB_PASSWORD 的参数值 password_here 为 123 :

### 修改完毕后，点击 esc ，退出编辑状态，然后输入 :wq ，保存修改信息并退出配置文件

### 在 Apache 的根目录 /var/www/html 下，创建一个 wp-blog 文件夹。
```
mkdir /var/www/html/wp-blog
```
### 然后，将 wordpress 迁移到这个新建文件夹中。
```
mv * /var/www/html/wp-blog/
```

### 完成如上配置后，返回浏览器，并访问 http://xxx.xxx.xx.x/wp-blog/wp-admin/install.php ，其中 xxx.xxx.xx.x 为 ECS 实例的 弹性IP ，填写如下信息，完成后，点击页面底部的 安装WordPress ，开始安装 WordPress 。
![png](../img/aliyun/wordpress/4.png)

获得密码: MsLE1ppUhzV!95xOyq

![png](../img/aliyun/wordpress/5.png)
![png](../img/aliyun/wordpress/6.png)

## step4 使用CNZZ帮你成为合格“站长”
1. 本小节介绍主要：借助 CNZZ  平台观察 WordPress 网站一天有多少 IP 访问，那些 IP 都是从哪个页面进入到自己网站的等内容。

2. 点击链接 https://web.umeng.com/main.php?c=user&a=login 进行注册、登录。

登录网址(https://workbench.umeng.com/)

3.  登录 CNZZ 数据统计专家网站后，填写以下信息，完成后点击 确认添加站点 。
https://web.umeng.com/main.php?c=site&a=add

![png](../img/aliyun/wordpress/7.png)
![png](../img/aliyun/wordpress/8.png)
![png](../img/aliyun/wordpress/9.png)

4. 切换回 WordPress 网站的主页面，点击 外观 ，并选择子菜单下的 小工具
![png](../img/aliyun/wordpress/10.png) 
5. 嵌入代码
![png](../img/aliyun/wordpress/11.png) 
![png](../img/aliyun/wordpress/12.png) 
![png](../img/aliyun/wordpress/13.png) 
![png](../img/aliyun/wordpress/14.png)  

6. 删除统计
![png](../img/aliyun/wordpress/15.png)  