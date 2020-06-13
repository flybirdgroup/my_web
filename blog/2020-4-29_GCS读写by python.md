---
id: GCS1
title: GCS 读写 by python
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [terraform, gcp, compute engine,vm]
---

我们可以使用谷歌的Python客户端API将文件上传到谷歌云存储。


# 方法一: 
首先，如下安装api客户端。

>
```
pip install --upgrade google-api-python-client 
```
然后，启用api身份验证以获取应用程序默认凭据。

>
```
gcloud beta auth application-default login 
```
以下是使用应用程序默认凭据将本地文件上传到Google云存储的示例代码。

```
from googleapiclient import discovery
from oauth2client.client import GoogleCredentials

credentials = GoogleCredentials.get_application_default()
service = discovery.build('storage', 'v1', credentials=credentials)

filename = './account_id_schema_new.csv'

bucket = 'bq-pandas-bucket'

body = {'name': 'dest_file_name.csv'}

req = service.objects().insert(bucket=bucket, body=body, media_body=filename)
esp = req.execute()
```

# 方法二--仅仅需要安装两个包
```
pip install dask[dataframe] --upgrade --user
pip install gcsfs --user
```

## 例子
![png](../img/google/gcs/gcs1/1.png)

原来无论用pandavro或者pandas都是读取不了GCS的文件的

但是安装包后,就可以读取GCS文件了
![png](../img/google/gcs/gcs1/2.png)

然后写入gcs,就想平时那样,直接to_csv就可以了
![png](../img/google/gcs/gcs1/3.png)

```
import dask.bag as db
b = db.read_avro('gs://zz_mm_bucket/account_id_schema_new.avro')
df = b.to_dataframe()
```
