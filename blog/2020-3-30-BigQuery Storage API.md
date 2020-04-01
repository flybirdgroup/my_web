---
id: BigQueryStorageAPI
title: Install the BigQuery Python client library version 1.9.0 or higher and the BigQuery Storage API Python client library.

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [python, hello, docusaurus,google cloud, docker]
---
安装google-cloud-bigquery and google-cloud-bigquery-storage packages.
需要认证
<!--truncate-->
## step1 一般方法是复制以下命令在mac os终端执行
``` 
pip install --upgrade google-cloud-bigquery[bqstorage,pandas]
```
## step2 我们反向step1操作,往往不成功会出现2
![png](../img/BQ_API/2.png)

## step3 我们在命令行后面加上--user
``` 
pip install --upgrade google-cloud-bigquery[bqstorage,pandas] --user
```
![png](../img/BQ_API/1.png)

通过操作就成功了