---
id: dataflow3
title: dataflow sql
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataflow, GCP, apache beam,sql]
---

[总体流程](https://www.youtube.com/watch?v=GBNBnobxsiI)
# 选择项目 
```
gcloud config set project query-11
```
# 启用API
启用 Cloud Dataflow, Compute Engine, Stackdriver Logging, Cloud Storage, Cloud Storage JSON, BigQuery, Cloud Pub/Sub, and Cloud Resource Manager API。

具体流程可查看[Dataflow SQL 界面](https://cloud.google.com/dataflow/docs/guides/sql/dataflow-sql-ui-walkthrough)

<!--truncate-->
# 创建Pub/Sub主题和发布脚步

(1)
```
gcloud pubsub topics create transactions
```

(2)
创建python文件, transactions_injector.py,内容为一下
```
#!/usr/bin/env python

import datetime, json, os, random, time

# Set the `project` variable to a Google Cloud project ID.
project = 'query-11'

FIRST_NAMES = ['Monet', 'Julia', 'Angelique', 'Stephane', 'Allan', 'Ulrike', 'Vella', 'Melia',
'Noel', 'Terrence', 'Leigh', 'Rubin', 'Tanja', 'Shirlene', 'Deidre', 'Dorthy', 'Leighann',
'Mamie', 'Gabriella', 'Tanika', 'Kennith', 'Merilyn', 'Tonda', 'Adolfo', 'Von', 'Agnus',
'Kieth', 'Lisette', 'Hui', 'Lilliana',]
CITIES = ['Washington', 'Springfield', 'Franklin', 'Greenville', 'Bristol', 'Fairview', 'Salem',
'Madison', 'Georgetown', 'Arlington', 'Ashland',]
STATES = ['MO','SC','IN','CA','IA','DE','ID','AK','NE','VA','PR','IL','ND','OK','VT','DC','CO','MS',
'CT','ME','MN','NV','HI','MT','PA','SD','WA','NJ','NC','WV','AL','AR','FL','NM','KY','GA','MA',
'KS','VI','MI','UT','AZ','WI','RI','NY','TN','OH','TX','AS','MD','OR','MP','LA','WY','GU','NH']
PRODUCTS = ['Product 2', 'Product 2 XL', 'Product 3', 'Product 3 XL', 'Product 4', 'Product 4 XL', 'Product 5',
'Product 5 XL',]

while True:
    first_name, last_name = random.sample(FIRST_NAMES, 2)
    data = {
    'tr_time_str': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    'first_name': first_name,
    'last_name': last_name,
    'city': random.choice(CITIES),
    'state':random.choice(STATES),
    'product': random.choice(PRODUCTS),
    'amount': float(random.randrange(50000, 70000)) / 100,
    }
    message = json.dumps(data)
    command = "gcloud --project={} pubsub topics publish transactions --message='{}'".format(project, message)
    print(command)
    os.system(command)
    time.sleep(random.randrange(1, 5))
```
## python脚本下的PubSub的主要命令有:
```
gcloud pubsub topics create transactions 创建 topics
gcloud --project=project_id pubsub topics publish transactions(topic名字) --message=(json格式的data,最后用json.dump(data))
command = "gcloud --project={} pubsub topics publish transactions --message='{}'".format(project, message)
os.system(command)
```



# 创建数据集和表
```
bq mk dataflow_sql_dataset
```
# 创建一个us_state_salesregions.csv文件,把以下数据复制到csv文件
```
state_id,state_code,state_name,sales_region
1,MO,Missouri,Region_1
2,SC,South Carolina,Region_1
3,IN,Indiana,Region_1
6,DE,Delaware,Region_2
15,VT,Vermont,Region_2
16,DC,District of Columbia,Region_2
19,CT,Connecticut,Region_2
20,ME,Maine,Region_2
35,PA,Pennsylvania,Region_2
38,NJ,New Jersey,Region_2
47,MA,Massachusetts,Region_2
54,RI,Rhode Island,Region_2
55,NY,New York,Region_2
60,MD,Maryland,Region_2
66,NH,New Hampshire,Region_2
4,CA,California,Region_3
8,AK,Alaska,Region_3
37,WA,Washington,Region_3
61,OR,Oregon,Region_3
33,HI,Hawaii,Region_4
59,AS,American Samoa,Region_4
65,GU,Guam,Region_4
5,IA,Iowa,Region_5
32,NV,Nevada,Region_5
11,PR,Puerto Rico,Region_6
17,CO,Colorado,Region_6
18,MS,Mississippi,Region_6
41,AL,Alabama,Region_6
42,AR,Arkansas,Region_6
43,FL,Florida,Region_6
44,NM,New Mexico,Region_6
46,GA,Georgia,Region_6
48,KS,Kansas,Region_6
52,AZ,Arizona,Region_6
56,TN,Tennessee,Region_6
58,TX,Texas,Region_6
63,LA,Louisiana,Region_6
7,ID,Idaho,Region_7
12,IL,Illinois,Region_7
13,ND,North Dakota,Region_7
31,MN,Minnesota,Region_7
34,MT,Montana,Region_7
36,SD,South Dakota,Region_7
50,MI,Michigan,Region_7
51,UT,Utah,Region_7
64,WY,Wyoming,Region_7
9,NE,Nebraska,Region_8
10,VA,Virginia,Region_8
14,OK,Oklahoma,Region_8
39,NC,North Carolina,Region_8
40,WV,West Virginia,Region_8
45,KY,Kentucky,Region_8
53,WI,Wisconsin,Region_8
57,OH,Ohio,Region_8
49,VI,United States Virgin Islands,Region_9
62,MP,Commonwealth of the Northern Mariana Islands,Region_9
```
创建表
```
bq load --autodetect --source_format=CSV dataflow_sql_dataset.us_state_salesregions us_state_salesregions.csv
```

# 查找 Pub/Sub 来源
首先把dataset设置成Gloud dataflow engine

然后再点击添加数据下拉列表，然后选择 Cloud Dataflow 来源

在右侧打开的添加 Cloud Dataflow 来源面板中，选择 Pub/Sub 主题。在搜索框中，搜索 transactions。 选择相应主题，然后点击添加。

在Cloud dataflow sources的 cloud pub/sub topics下选择transactions >> 去到Schema >> edit schema,
然后输入一下schema格式
```
[
  {
      "description": "Pub/Sub event timestamp",
      "name": "event_timestamp",
      "mode": "REQUIRED",
      "type": "TIMESTAMP"
  },
  {
      "description": "Transaction time string",
      "name": "tr_time_str",
      "type": "STRING"
  },
  {
      "description": "First name",
      "name": "first_name",
      "type": "STRING"
  },
  {
      "description": "Last name",
      "name": "last_name",
      "type": "STRING"
  },
  {
      "description": "City",
      "name": "city",
      "type": "STRING"
  },
  {
      "description": "State",
      "name": "state",
      "type": "STRING"
  },
  {
      "description": "Product",
      "name": "product",
      "type": "STRING"
  },
  {
      "description": "Amount of transaction",
      "name": "amount",
      "type": "FLOAT64"
  }
]
```
# 运行python脚本,这样我们就开始不停发送数据
```
python transactions_injector.py
```

# 创建SQL查询
创建SQL查询来运行Dataflow jobs
我们这里例子是添加一个处理PubSub发送的字段再添加一个字段
```
SELECT tr.*, sr.sales_region
FROM pubsub.topic.`project-id`.transactions as tr
  INNER JOIN bigquery.table.`project-id`.dataflow_sql_dataset.us_state_salesregions AS sr
  ON tr.state = sr.state_code
```

# 我们设置好查询后就可以开始创建job了

1 在Query editor下面,选择Create Dataflow job (这个按钮只有在设置好query后才能生效)

2 点击进去后,我们填写job name, Primary ouput(选择Bigquery), Project, Dataset id和填写table name (自己命名)

3 write disposition中 选择write if empty

4 点击create

# 这样job就开启了
大概5分钟job应该差不多开启了,我们可以去dataflow查看job的运行情况,同时我们也可以去bigquery查看我们的table是否创立成功和数据有没有更新









