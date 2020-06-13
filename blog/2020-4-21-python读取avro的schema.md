---
id: avro
title: 读取avro文件的schema
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataproc, GCP, avro,bigquery]
---
首先安装包
```
pip install avro-python3
```
然后在py文件倒入包
```
from avro.datafile import DataFileReader, DataFileWriter
import avro.io
reader = avro.datafile.DataFileReader(open('./account_id_schema_new.avro',"rb"),avro.io.DatumReader())
schema = reader.meta
print(schema)
```
<!--truncate-->
显示的效果如下:
```
{'avro.schema': b'{"fields": [{"type": ["null", "string"], "name": "ACNO"}, {"type": ["null", "double"], "name": "FIELD_1"}, {"type": ["null", "double"], "name": "FIELD_2"}, {"type": ["null", "double"], "name": "FIELD_3"}], "type": "record", "name": "Root"}',
 'avro.codec': b'null'}
 ```










