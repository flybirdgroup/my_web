---
id: BIGQUERY2
title: Bigquery (二)--在BigQuery中创建授权视图
sidebar_label: Style Guide
---

# 创建授权视图以与特定用户和群组共享查询结果,而无需授予基础表个访问权限

# 目标
## 1 创建数据集并对其应用访问权限控制
## 2 向项目分配访问权限控制
## 3 创建一个以获取授权的视图,它用于限制用户可查询的数据

## 创建项目，选择项目
![png](../img/bigquery/bigquery2/1.png)

## 开启big query api， 一般项目默认开启Big Query API
![png](../img/bigquery/bigquery2/2.png)

# 创建源数据集

## 在项目下选择创建数据集
数据集ID填写github_source_data

![png](../img/bigquery/bigquery2/3.png)

## 创建后，我们可以使用sql语句查询
```
select commit,author,committer,repo_name from `bigquery-public-data.github_repos.commits` limit 100
```
![png](../img/bigquery/bigquery2/4.png)

## 然后我们在展开(more)选择查询设置
![png](../img/bigquery/bigquery2/5.png)

## 查询设置里面我们填写数据集名称,表名称,选择保存
![png](../img/bigquery/bigquery2/6.png)

## 运行后,可以看到查询结果
![png](../img/bigquery/bigquery2/7.png)

## 重新点击表,看看预览是否呈现查询数据,如果有,证明成功
![png](../img/bigquery/bigquery2/8.png)

# 创建单独的数据集来存储视图
创建源数据后,我们可以新建一个数据集来存储要与数据分析师共享的视图.该视图将有权访问源数据集中的数据.但是数据分析师将有权访问视图却无法访问源数据

创建该视图时,必须在与视图所查询的源数据不同的数据集中进行.我们只能在数据集层分配访问权限控制,因此如果在与源数据相同的数据集中创建视图,数据分析师将有权同时访问视图和数据
## 开始创建数据集
![png](../img/bigquery/bigquery2/9.png)

## 填写数据集名称,表名称
![png](../img/bigquery/bigquery2/10.png)

## 选择保存视图
![png](../img/bigquery/bigquery2/11.png)

## 填写数据集名称,表名称
![png](../img/bigquery/bigquery2/12.png)
![png](../img/bigquery/bigquery2/13.png)

## 去IAM设置权限

![png](../img/bigquery/bigquery2/14.png)

## 添加数据分析师账号,必须是gmail或者使用谷歌服务的账号,添加角色
![png](../img/bigquery/bigquery2/15.png)

## 添加user 和 data viewer角色
![png](../img/bigquery/bigquery2/16.png)

# 向视图授予访问源数据集的权限
当为包含视图的数据集创建访问权限控制后,会将视图添加为源数据集中已经获取授权的视图.这样,视图就可访问源数据,而数据分析师群组则无法访问.
```
从资源中选择 github_source_data 数据集，然后点击共享数据集。

在数据集权限面板中，点击已获授权的视图标签页。

在共享已获授权的视图下：

在选择项目部分，验证是否已选定您的项目。
在选择数据集部分，选择 shared_views。
在选择视图部分，输入视图名称：github_analyst_view。
点击确定。
点击添加，然后点击完成。
```
![png](../img/bigquery/bigquery2/17.png)
![png](../img/bigquery/bigquery2/18.png)
![png](../img/bigquery/bigquery2/19.png)

## 验证配置
```
SELECT * FROM `shared_views.github_analyst_view`
```
![png](../img/bigquery/bigquery2/20.png)