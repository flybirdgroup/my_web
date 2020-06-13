---
id: dataflow2
title: dataflow简单入门-使用apache_beam创建,运行作业
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataflow, bigquery, subpub,steaming]
---

# 创建dataflow作业的思路
1. 在本地创建来测试运行
2. 放到dataflow上运行
<!--truncate-->
## 本地创建job
1 首先是安装我们需要打工具包,因为我是将来是要运行到GCP上的,所以我们安装的是
```
pip install apache_beam[gcp]
```
2 导入各种包
```
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.options.pipeline_options import GoogleCloudOptions
from apache_beam.options.pipeline_options import StandardOptions
from apache_beam.io.textio import ReadFromText, WriteToText #用来读写文件
```
3 设置配置
```
# 输入输出路径
input_filename = "./input.txt"
output_filename = "./output.txt"

#指定执行选项,以告诉Pipeline运行位置和运行方式
options = PipelineOptions()
options.view_as(StandardOptions).runner = "direct" #表示本地运行

# 写功能类
#DoFn就是把类,转换,callable的功能集合在一起,我们可以直接继承,方便后面管道使用
#所有ParDo的操作都必须要跟DoFn类的函数,比如ParDo(DoFn())


class Split(beam.DoFn):
    def process(self, element):
        """
        Splits each row on commas and returns a dictionary representing the row
        我们这里做的事情就是类似mapper, 将所有元素变成字典
        """
        country,duration,user = element.split(",")
        print(len(element))# element就是每行的数据,跟hdfs一样,视力有问题
        return [
            {
                'country':country,
                'duration':duration,
                'user':user
            }
        ]
    
class CollectTimings(beam.DoFn):
    def process(self,element):
        result = [element('country'),element('duration')]
        return result

class CollectUsers(beam.DoFn):
    def process(self,element):
        """
        Returns a list of tuples containing country and user name
        """
        return [element('country'),element('user')]

class WriteToCSV(beam.DoFn):
    def process(self,element):
        """
        Prepares each row to be written in the csv
        """
        result = ["%s,%s,%s"%(element[0],element[1]['user'][0],element[1]['timings'][0])]
        return result

#创建管道对象, 创建变量接收Pcollection, 一定要加上(),防止歧义,如果变成 rows = P 然后 再管 | ReadFromText(input_filename), 很容易报错
with beam.Pipeline(options=options) as p:
    rows = (
        P | ReadFromText(input_filename) | beam.ParDo(SPlit())
    )
    timings = (
        rows |
        beam.ParDo(CollectTimings()) |
        "Grouping timings" >> beam.GroupByKey() | 
        "Calculating average" >> beam.CombineValues(
            beam.combiners.MeanCombineFn()
        )
    )
    users = (
        rows |
        beam.ParDo(CollectUsers()) |
        "Grouping users" >> beam.GroupByKey() |
        "Counting users" >> beam.CombineValues(
            beam.combiners.CountCombineFn()
        )
    )
    to_be_joined = (
        {
            'timings': timings,
            'users': users
        } |
        beam.CoGroupByKey() |
        beam.ParDo(WriteToCSV()) |
        WriteToText(output_filename)
    )


#这里的格式为pvalue | "label" >> transform
为什么要为什么要用"label" >>,其实如果任务不重复的时候,是可以不用的,但是比如这里耦合函数groupbykey出现已经在pipeline了,如果没有label就会报错,执行users时候就会报错

GroupByKey是把key相同的拼为为一组,CombineValues是把值累积相加
CoGroupByKey是根据key拼接一起
```

# 好的,本地测试好后, 我们要放到dataflow上跑了

1 我们需要改的就是 input,ouput 路径,记住storage bucket的权限
```
input_filename = "gs://dataflow_s/input.txt"
output_filename = "gs://dataflow_s/output.txt"
```

2 options
```
dataflow_options = ['--project=query-11','--job_name=test-job','--temp_location=gs://dataflow_s/tmp','--region=us-central1']
dataflow_options.append('--staging_location=gs://dataflow_s/stage')
options = PipelineOptions(dataflow_options)
gcloud_options = options.view_as(GoogleCloudOptions)
options.view_as(StandardOptions).runner = "dataflow" # 指定后端跑在dataflow
```
这里有个坑,如果你的apache beam是2.15版本以上的话,是需要写region这个参数的
然后其他的都很本地一样,整体代码如下:
```
import logging
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.options.pipeline_options import SetupOptions
from apache_beam.options.pipeline_options import GoogleCloudOptions
from apache_beam.options.pipeline_options import StandardOptions
from apache_beam.io.textio import ReadFromText, WriteToText


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


input_filename = "gs://dataflow_s/input.txt"
output_filename = "gs://dataflow_s/output.txt"


dataflow_options = ['--project=query-11','--job_name=test-job','--temp_location=gs://dataflow_s/tmp']
dataflow_options.append('--staging_location=gs://dataflow_s/stage')
options = PipelineOptions(dataflow_options)
gcloud_options = options.view_as(GoogleCloudOptions)

# gcloud_options.job_name = "test-job"


options.view_as(StandardOptions).runner = "dataflow"


class Split(beam.DoFn):

    def process(self, element):
        """
        Splits each row on commas and returns a dictionary representing the
        row
        """
        country, duration, user = element.split(",")

        return [{
            'country': country,
            'duration': float(duration),
            'user': user
        }]


class CollectTimings(beam.DoFn):

    def process(self, element):
        """
        Returns a list of tuples containing country and duration
        """

        result = [
            (element['country'], element['duration'])
        ]
        return result


class CollectUsers(beam.DoFn):

    def process(self, element):
        """
        Returns a list of tuples containing country and user name
        """
        result = [
            (element['country'], element['user'])
        ]
        return result


class WriteToCSV(beam.DoFn):

    def process(self, element):
        """
        Prepares each row to be written in the csv
        """
        result = [
            "{},{},{}".format(
                element[0],
                element[1]['users'][0],
                element[1]['timings'][0]
            )
        ]
        return result




with beam.Pipeline(options=options) as p:
    rows = (
        p |
        ReadFromText(input_filename) |
        beam.ParDo(Split())
    )

    timings = (
        rows |
        beam.ParDo(CollectTimings()) |
        "Grouping timings" >> beam.GroupByKey() |
        "Calculating average" >> beam.CombineValues(
            beam.combiners.MeanCombineFn()
        )
    )

    users = (
        rows |
        beam.ParDo(CollectUsers()) |
        "Grouping users" >> beam.GroupByKey() |
        "Counting users" >> beam.CombineValues(
            beam.combiners.CountCombineFn()
        )
    )

    to_be_joined = (
        {
            'timings': timings,
            'users': users
        } |
        beam.CoGroupByKey() |
        beam.ParDo(WriteToCSV()) |
        WriteToText(output_filename)
    )
```

# 然后把这段代码放到gcloud上
使用命令启动,具体是安装虚拟环境,进入虚拟环境,安装apache beam包,运行python文件
```
pip3 install --upgrade virtualenv --user
python3 -m virtualenv env
source env/bin/activate
pip3 install --quiet apache-beam[gcp]
python dataflow.py
```

# 然后我们就可以去job上看到运行情况



