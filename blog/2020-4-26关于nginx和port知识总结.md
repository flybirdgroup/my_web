---
id: nginx
title: 关于nginx和port知识总结
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [nginx, port, target,load-balance]
---

# kubernetes里面的port, target port 和 node port
##  port是service服务的端口
## targetport是pod也就是容器的端口
## nodeport是容器所在宿主机的端口(通过service暴露给宿主机,而port去没有)
<!--truncate-->
port的主要作用是clusters集群里面的一个pod访问其他pod的时候,需要端口port,比如集群里面nginx需要访问mysql,那么久需要mysql的target port,
```mysql
apiVersion: v1
 kind: Service
 metadata:
  name: mysql-service
 spec:
  ports:
  - port: 33306
    targetPort: 3306
  selector:
   name: mysql-pod
```
比如nginx通过访问service的33306端口,service根据selector中的name,将请求转发到mysql-pod这个pod的3306端口
通过POST创建 service
```
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "my-service"
    },
    "spec": {
        "selector": {
            "app": "MyApp"
        },
        "ports": [
            {
                "name": "http",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376
            },
            {
                "name": "https",
                "protocol": "TCP",
                "port": 443,
                "targetPort": 9377
            }
        ]
    }
}
```
对于每个运行的pod,kubernete将其添加给现有的service的全局变量, 比如叫做"redis-master"的service,对外映射6379端口,
service要想被pod使用,必须先比pod建立
所以总体流程就pod之间都是通过service来相互访问,所以先service的port,然后service通过selector找到name,再把请求发送到name对应的target port

# [Nginx基础知识](https://www.cnblogs.com/mq0036/p/9794540.html)

## nginx能做的事情:
1 [正向,方向代理](https://www.jianshu.com/p/ae76c223c6ef)
2 负载均衡
3 http服务器-动静分离

![png](../img/kubernetes/nginx/nginx.png)

### 正向代理是nginx proxy给client代理,然后对接Server,获取内容
### 方向代理是proxy给Server做代理,clients访问proxy获取内容

### nginx的负载均衡有一下几个策略:
1 RR- 按照请求时间顺序分配到不同的后端服务器,后端服务器挂掉,就自动剔除
2 权重- 给不同服务器赋予权重,权重大的,就承当更多访问
3 ip_hash- 因为客户登录信息保存在session中,如果跳转到另外一台服务器的时候,需要重新登录,所以ip_hash的方法让一个客户只访问一台服务器
4 fair(第三方)- 按后端服务器的响应时间来分配请求,响应越短,就越先分配
5 url_hash- 就是设定方向url连接是访问那台服务器,后端服务器为缓存时比较有效

### 动静分离
nginx本身就是一台服务器,所以可以保存一些静态资源,也就是我们可以把动态网站里的动态网页按照一定规则把不变的资源和经常变的资源区分开来,动静
