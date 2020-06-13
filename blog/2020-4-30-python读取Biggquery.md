---
id: bigquery1
title: python读取bigquery
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [linux, command line, cat,<<EOF,loop]
---

## 安装客户端
```
pip install --upgrade google-cloud-bigquery[bqstorage,pandas]
```
<!--truncate-->
## 导入工具包,创建客户端对象
```
from google.cloud import bigquery

client = bigquery.Client()
```
## 运行查询
```
query_job = client.query("""
    SELECT
      CONCAT(
        'https://stackoverflow.com/questions/',
        CAST(id as STRING)) as url,
      view_count
    FROM `bigquery-public-data.stackoverflow.posts_questions`
    WHERE tags like '%google-bigquery%'
    ORDER BY view_count DESC
    LIMIT 10""")

results = query_job.result()  # Waits for job to complete.
```

## 转成dataframe
```
df = results.to_dataframe()
```

## 显示查询结果
```
df.iloc[:,:5] #显示dataframe
```

