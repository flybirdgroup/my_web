---
id: doc2
title: GCP常用命令
sidebar_label: gcs command line
---

Cloud Storage常用命令
```python
gcloud auth list #查看用户
gcloud config list project #查看项目
```
创建bucket
```
gsutil mb gs://your-bucket-name/
```
下载文件
```
wget --output-document ada.jpg https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/800px-Ada_Lovelace_portrait.jpg
```
复制服务器的文件到google cloud storage
``` 
gsutil cp ada.jpg gs://Your bucket name
```

复制google cloud storage的图片到服务器
```google
gsutil cp -r gs://your bucket name/ada.jpg .
```

复制gcs文件到gcs一个目录里
```
gsutil cp -r gs://your-bucket-name/ada.jpg gs://your bucket name/image-folder/
```

显示gcs内容
```
gsutil ls gs://your-bucket-name
gsutil ls -l gs://YOUR-BUCKET-NAME/ada.jpg
```

让图片公开
```
gsutil acl ch -u AllUsers:R gs://YOUR-BUCKET-NAME/ada.jpg
```

删去权限
```
gsutil acl ch -d AllUsers gs://YOUR-BUCKET-NAME/ada.jpg
```
简单例子
![png](../img/google/gcs/1.png)
![png](../img/google/gcs/2.png)
![png](../img/google/gcs/3.png)
![png](../img/google/gcs/4.png)


# Bigquery 常用命令
BQ加载所有GCS文件命令
```query
    bq load \
    --source_format=AVRO \
    datasetid号.表格table \
    "gs://mybucket/00/*.avro","gs://mybucket/01/*.avro"
```

