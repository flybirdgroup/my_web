---
id: dataproc5
title: dataproc参数化跑spark和读写avro文件
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataproc, GCP, Spark,Hadoop]
---

# 今天有意思啦 !! spark 读取 GCS avro文件 + ETL操作 + 写avro文件



### 1. spark 初始化,因为要读取成dataframe或者sql形式,导入SparkSession
```
from pyspark.sql import SparkSession
import sys
```
### 2. 创建spark对象
```
spark = SparkSession \
  .builder \
  .master('yarn') \
  .appName('gcs-sparkdataframe-sql-avro') \
  .getOrCreate()
```
### 参数判断和参数设置
```
if len(sys.argv) != 4:
  raise Exception("Exactly 3 arguments are required: <inputUri> <table1><table2>")

inputUri=sys.argv[1]
table1=sys.argv[2]
table2=sys.argv[3]
```
### 4 读取avro文件
```
df = spark.read.format('avro').load(inputUri)
```
### 5 注册视图,实行查询语句
```
df1 = spark.sql("select ACNO,%s from bigtable" % (",".join(df.columns[1:round(len(df.columns) / 2)])))
df2 = spark.sql("select ACNO,%s from bigtable" % (",".join(df.columns[round(len(df.columns) / 2):])))
df1.show(10)
df2.show(10)
```

### 6 处理好的dataframe对象写成avro文件 (注意,用sql处理过后的还是dataframe对象)
```
df1.write.format('avro').save(table1,'avro')

df2.write.format('avro').save(table2,'avro')
```

### 7 去到终端输入命令,创建dataproc集群,然后提交spark job
```
CLUSTER_NAME=newnew
gcloud beta dataproc clusters create ${CLUSTER_NAME} \
    --region=global \
    --zone=us-central1-b \
    --worker-machine-type n1-standard-1 \
    --num-workers 2 \
    --image-version 1.4-debian \
    --initialization-actions gs://dataproc-initialization-actions/python/pip-install.sh \
    --metadata 'PIP_PACKAGES=google-cloud-storage avro-python3 dask[dataframe] gcsfs fastavro' \
    --enable-component-gateway \
    --worker-boot-disk-size=40 \
    --optional-components=ANACONDA \
    --enable-component-gateway
BUCKET_NAME=zz_mm_bucket
gcloud config set dataproc/region global
gcloud dataproc jobs submit pyspark avrosqlargs.py --cluster newnew \
--jars=gs://spark-lib/bigquery/spark-bigquery-latest.jar \
--jars=https://repo1.maven.org/maven2/org/apache/spark/spark-avro_2.11/2.4.4/spark-avro_2.11-2.4.4.jar \
-- gs://${BUCKET_NAME}/input/gs://zz_mm_bucket/input/ gs://${BUCKET_NAME}/output/table1 gs://${BUCKET_NAME}/output/table2
```
## 这里注意的是gcloud dataproc jobs sumbit的参数格式是 pyspark.py文件, files
所以例子中我们的参数总共有4个
1 avrosqlargs.py

2 gs://${BUCKET_NAME}/input/gs://zz_mm_bucket/input/

3 gs://${BUCKET_NAME}/output/table1 

4 gs://${BUCKET_NAME}/output/table2

jars和cluster都不算为参数

还有就是files的是文件夹形式而不能是文件形式,所以读入文件夹后,可以根据需要读取你需要的文件,比如sys.argv+'文件名'

所以整体可以改成:
```
#!/usr/bin/python
"""BigQuery I/O PySpark example."""
from pyspark.sql import SparkSession
import sys



spark = SparkSession \
  .builder \
  .master('yarn') \
  .appName('gcs-sparkdataframe-sql-avro') \
  .getOrCreate()

# get spark datafrom from avro file in GCS

if len(sys.argv) != 4:
  raise Exception("Exactly 3 arguments are required: <inputUri> <table1><table2>")

inputUri=sys.argv[1]
table1=sys.argv[2]
table2=sys.argv[3]

file = inputUri+'account_id_schema_new.avro'
df = spark.read.format('avro').load(file)


#create temp table
df.createOrReplaceTempView('bigtable')

# split temp table into 2 spark dataframes
df1 = spark.sql("select ACNO,%s from bigtable" % (",".join(df.columns[1:round(len(df.columns) / 2)])))
df2 = spark.sql("select ACNO,%s from bigtable" % (",".join(df.columns[round(len(df.columns) / 2):])))
df1.show(10)
df2.show(10)

# Saving the dataframes into avro files and dump avro files into GCS

df1.write.mode("overwrite").format('avro').save(table1,'avro')

df2.write.mode("overwrite").format('avro').save(table2,'avro')
```

## 关于生成文件,因为spark是基于hadoop的,所以文件也会分布式存储,所以我们可以看到
```
df = spark.read.format('avro').load(sys.argv[3])
```
## 一般是分区是会根据你的电脑的cpu核数自动分配,我的电脑是core i5,也就是四核的,所以默认是4
我们可以重分区:
```
df.repartition(10) # 就是分10区
df.rdd.getNumPartitions() #查看分区数
df.coalesce(1)
```