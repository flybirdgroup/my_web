---
id: avro
title: 把avro文件放到bigquery
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataproc, GCP, avro,bigquery]
---
去到控制台,确认storage和bigquery API已启用
打开gcs
设置project id
```
gcloud config set project project_id
```
<!--truncate-->

在storage上创建bucket
```
gsutil mb gs://bucket_name
gsutil ls #查看创建是否成功
```
```
上传文件夹或者文件到storage bucket, 如果storage bucket没有这个文件名,就会创建一个
```
```
gsutil cp -r faker_demo/data gs://z_bucket/sub_file
gsutil ls gs://z_bucket/sub_file/* 参看所有文件
gsutil rm gs://z_bucket/sub_file/.DS_Store #删除文件
```
去big query 创建dataset
```
bq mk fake_data
bq ls #查看命令
```
创建biq query 表格 csv, 或者avro,注意--source_format 要大写AVRO,CSV, 如果csv类型的schema可以用--autodetect,
```
bq load --source_format=AVRO fake_data.account_id_schema "gs://z_bucket/sub_file/avro_output/accountID.avro"

bq load --source_format=CSV fake_data.account_id_schema  "gs://z_bucket/sub_file/input/account_id_schema.csv" 

bq load --autodetect --source_format=CSV fake_data.account_id_schema "gs://z_bucket/sub_file/output/accountID.csv"
```
查看字段

```
bq show fake_data.account_id_schema
```

查询

```
bq query "select * from fake_data.account_id_schema limit 5"
```







