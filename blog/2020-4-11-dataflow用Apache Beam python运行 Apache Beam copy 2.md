---
id: dataflow
title: 5分钟在谷歌云上使用dataflow来运行job
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataproc, GCP, Spark,Hadoop]
---
# 选择项目
```
gcloud config set project query-11
```
# 创建虚拟环境,并且激活
```python
pip3 install --upgrade virtualenv --user
python3 -m virtualenv env
source env/bin/activate
```
<!--truncate-->
# 安装samples和apache Beam SDK
```python
pip3 install --quiet apache-beam[gcp]
```
# 建立一个cloud storage bucket
```python
gustil mb gs://query-11
```

# 在dataflow开启pipeline
```python
python3 -m \
    apache_beam.examples.wordcount \
    --project query-11 --runner \
    DataflowRunner --temp_location \
    gs://query-11/temp --output \
    gs://query-11/results/output \
    --job_name dataflow-intro
```

# 我们可以去到dataflow,点击flow
![png](../img/dataflow/1.png)
![png](../img/dataflow/2.png)
![png](../img/dataflow/3.png)

