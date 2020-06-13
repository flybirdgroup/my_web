---
id: dataproc3
title: dataproc--跑pyspark(从big query获取数据)
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataproc, GCP, Spark,Hadoop]
---

# 今天有意思啦 !! big query + pyspark + Dataproc

## 流程很简单
我们要用spark读取从bigquery读取table,然后我们对这个table做一个简单的处理,再分成两dataframe对象,然后把两个对象写入bigquery

### 1. spark 初始化,因为要读取成dataframe或者sql形式,导入SparkSession
```
#!/usr/bin/python
from pyspark.sql import SparkSession
```
### 2. 创建spark对象
```
spark = SparkSession.builder.master('yarn').appName('your app name').getOrCreate()
```
### 3 我们通过connector连接一个google storage bucket 给Bigquery输出数据临时用
```
bucket = "haha_mm_bucket"
spark.conf.set('temporaryGcsBucket',bucket)
```
### 4 配置好tmp bucket,我们可以开始读取数据,并且把数据框注册为视图
```
df = spark.read.format('bigquery').option('table','datasetid:tableid').load()
df.createTempView("temp table name(比如words)")
也可以是df.createOrReplaceTempView('words') 这样就可以覆盖原来同样名字的临时视图
```
### 5 开始使用sql语句
```
lefttable = spark.sql("SELECT ACNO, FIELD_1, FIELD_2 FROM words")
righttable = spark.sql("SELECT ACNO, FIELD_3, FIELD_4 FROM words")
lefttable.show()
lefttable.printSchema()
righttable.show()
righttable.printSchema()
```

### 6 处理好的dataframe对象写入bigquery (注意,用sql处理过后的还是dataframe对象)
```
lefttable.write.format('bigquery').option('table','query-11:newdata.lefttable').save()
righttable.write.format('bigquery').option('table','query-11:newdata.righttable').save()
```

### 7 去到终端输入命令,提交spark job
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