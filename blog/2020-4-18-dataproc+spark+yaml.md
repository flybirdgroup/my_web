---
id: dataproc6
title: 用yaml配置文件传参数给pyspark,然后再dataproc运行
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataproc, GCP, Spark,Hadoop]
---

首先我们要学Yaml语法:
具体yaml语法可以参考[yaml语法详情](yaml1)

整体思路
## 准备yaml文件和pyspark
1. 导入工具包
```
#!/usr/bin/env python
from pyspark.sql import SparkSession
import sys,yaml,datetime
import os
import pathlib
import google.cloud.storage as gcs
```
2. 我们写了一个Yaml文件作为config文件
3. 我们在我们的pyspark文件读取yaml文件,这里要注意的是,因为本地和GCS会有不同,本地是可以直接读取的,但是如果yaml文件在GCS,yaml文件就是object,是不可改写的,所以我们不能直接open(yaml文件,"r")
4. 我们需要在pyspark文件上创建gcs客户端,然后创建设置一个本地文件路径,然后通过客户端读取yaml文件内容并且下载到本地,然后再通过本地使用with open方法读取yaml文件内容
```
client = gcs.Client()

#set target file to write to
target = pathlib.Path("local_file.yaml")

config_file = sys.argv[1] +"config.yaml"

#set file to download
FULL_FILE_PATH = config_file

#open filestream with write permissions
with target.open(mode="wb") as downloaded_file:

        #download and write file locally
        client.download_blob_to_file(FULL_FILE_PATH, downloaded_file)

config_file="local_file.yaml"
```

读取后,我们就可以操作一下代码
```
for job in config["jobs"]:
    print("Creating source views...")
    for source in job["sources"]:
        print(source)
        if source.get("table") is not None:
            print("Creating view %s from table %s..." % (source["view"], source["table"]))
            df = spark.table(source["table"])
            df.show(5)
            print('table now')
        else:
            print("Creating view %s from object %s..." % (source["view"], source["object"]))
            df = spark.read.format(source['object'][source['object'].rfind('.')+1:]).option("header","true").load(source['object'])
            df.show(5)
        if source.get("columns") is not None:
            # columns listed, select given columns
            df = df.select(source["columns"])
            df.show(5)
        if source.get('Fillna') is not None:
            print(source['Fillna']["fields"])
            print('hah',type(source['Fillna']))
            df = df.fillna({source['Fillna']["fields"]:source['Fillna']["num"]})
            df.show(5)
        if source.get("filters") is not None:
            df.filter(source["filters"])
        if source.get("union") is not None:
            df_union = spark.sql("select * from %s"%(source['union']))
            df.union(df_union)
            df.show(1)
        if source.get("join") is not None:
            cur = df.select(source['Key'])
            pre = spark.sql("select * from %s"%(source['right']))
            df = cur.join(pre,[source['Key']],source['how'])
            df.show(5)
        df.createOrReplaceTempView(source["view"])
    print("Performing SQL Transformations...")
    if job.get("transforms") is not None:
        for transform in job["transforms"]:
            spark.sql(transform["sql"])
            print(df.count())
    if job.get("targets") is not None:
        print("Writing out final object to %s..." % (job["targets"]["target_location"]))
        start = datetime.datetime.now()
        final_df = spark.table(job["targets"]["final_object"])
        final_df.write.mode(job["targets"]["mode"]).format(job["targets"]["format"]).save(job["targets"]["target_location"])
        finish = datetime.datetime.now()
        print("Finished writing out target object...")
```
## 这端代码的逻辑就是循环config里面的jobs,jobs里面包括读取文件或者table,fillna,union,transoform等etl作业

## 准备启动dataproc代码
```
CLUSTER_NAME=newnew
gcloud beta dataproc clusters create ${CLUSTER_NAME} \
    --region=global \
    --zone=us-central1-b \
    --worker-machine-type n1-standard-1 \
    --num-workers 2 \
    --image-version 1.4-debian \
    --initialization-actions gs://dataproc-initialization-actions/python/pip-install.sh \
    --metadata 'PIP_PACKAGES=google-cloud-storage PyYAML pathlib avro-python3 dask[dataframe] gcsfs fastavro' \
    --enable-component-gateway \
    --worker-boot-disk-size=40 \
    --optional-components=ANACONDA \
    --enable-component-gateway
BUCKET_NAME=zz_michael
gcloud config set dataproc/region global
gcloud dataproc jobs submit pyspark dyyaml.py --cluster newnew \
--jars=gs://spark-lib/bigquery/spark-bigquery-latest.jar \
--jars=https://repo1.maven.org/maven2/org/apache/spark/spark-avro_2.11/2.4.4/spark-avro_2.11-2.4.4.jar \
-- gs://${BUCKET_NAME}/yaml/ 
```

## job完成后需要删除dataproc clusters
```
CLUSTER_NAME=newnew
gcloud dataproc clusters delete $CLUSTER_NAME
```







