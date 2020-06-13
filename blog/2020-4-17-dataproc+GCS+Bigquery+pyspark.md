---
id: dataproc4
title: dataproc--dataproc+GCS+Bigquery+Pyspark
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataproc, GCP, Spark,Hadoop]
---

# 今天更有意思啦 !! big query + pyspark + Dataproc

## 流程很简单
首先我们从GCS那里读取avro数据,然后我们读取avro数据变成dask.Dataframe,然后对dask.Dataframe操作,再转成pandas Dataframe,然后变成Spark Dataframe,最后通过Spark 与 bigquery 的connector对接起来,写入big query

## 安装刚才的思路写python.py
```
import dask.bag as db # 导入工具包
def run():
    b = db.read_avro('gs://zz_mm_bucket/account_id_schema_new.avro') #从GCS读取avro文件
    df = b.to_dataframe() # 转成Dataframe
    df_values = df.compute().values.tolist() #转成pandas的dataframe
    df_columns = list(df.columns)

    import pandas as pd
    from pyspark.sql import SparkSession #spark初始化
    spark = SparkSession.builder.appName("DataFrame").getOrCreate()
    bucket = "haha_mm_bucket" #设置bucket
    spark.conf.set('temporaryGcsBucket', bucket) #给spark初始化设置bucket零时存放数据的gcs

    spark_df = spark.createDataFrame(df_values, df_columns) 把dataframe转成spark的dataframe
    spark_df.show(10) #对spark的dataframe进行操作
    spark_df.write.format('bigquery').option('table','query-11:newdata.newdata').save() # 写入bigquery

if __name__ == '__main__':
    run()
```
###  去到终端输入命令,提交spark job
```
gcloud dataproc jobs submit pyspark wordcount.py \
    --cluster cluster-name \
    --region cluster-region (example: "us-central1") \
    --jars=gs://spark-lib/bigquery/spark-bigquery-latest.jar
```
主要格式: gcloud dataproc jobs submit pyspark python.py(python文件) \
        --cluster cluster-name \
        --region cluster-region(比如:us-central1,一定要对应dataproc集群的region)
        --jars 与biguqery连接的包
注意这里的jars:
If you are using Dataproc image 1.5, add the following parameter:
--jars=gs://spark-lib/bigquery/spark-bigquery-latest_2.12.jar
If you are using Dataproc image 1.4 or below, add the following parameter:
--jars=gs://spark-lib/bigquery/spark-bigquery-latest.jar


```
gcloud config set dataproc/region us-central1
BUCKET_NAME=haha_mm_bucket
input=new.avro
gcloud dataproc jobs submit pyspark wordcount3.py \
--cluster cluster-662b \
-- gs://${BUCKET_NAME}/${input} \
--jars=gs://spark-lib/bigquery/spark-bigquery-latest.jar \
--packages com.databricks:spark-avro_2.11:4.0.0
```