---
id: dataflow4
title: dataflow简单入门-apache beam 基本概念
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [dataflow, bigquery, subpub,steaming]
---

# apache beam 的总点知识点

## 1 Pipeline 管道

## 2 Pcollection

## 3 Ptransform

<!--truncate-->
总体流程就是 设置pipeline >> read data >> pcollection >> ptransform >> pcollection 

其中ptransform有ParDo和耦合函数功能

ParDo()里面只能接收的是DoFn类或集成DoFn类的对象的函数,ParDo操作的是每一行的数据,就好像dataframe里面的一行
# 敲黑板时间!!
## 读取Csv和txt文件,Pipeline读取得每一行为字符串,也就是,属于pandas里面的seris, 也就是只有一列,如果要分开几列,我们就要split字符串,然后做成key:value字典格式.
## 读取avro文件时候,Pipeline读取的每一行为字典{},也就是pandas里面的一行dataframe,如果要取值,我们需要element[列名]就可以取到

聚合函数操作后,就会返回一个整体的新的Pcollection
记住字典格式要做聚合函数要变成列表或者元组
## Groupbykey--对象是一个Pcollection,首先选择要做聚合的key和值,然后tranform一个pcollection格式为turple,里面为(key,value),最后通过管道 | beam.GroupByKey()
就会生成按key分类, 以下这样的效果,具体说明[例子](https://beam.apache.org/documentation/programming-guide/#core-beam-transforms)
```
cat, 1
dog, 5
and, 1
jump, 3
tree, 2
cat, 5
dog, 2
and, 2
cat, 9
and, 6
...
```
变成
```
cat, [1,5,9]

dog, [5,2]

and, [1,2,6]

jump, [3]

tree, [2]               
...
```

##CoGroupKey--操作对象Pcollection,把两个Pcollection通过key连接起来,
比如Pcollection1:  是宠物名字和年龄
'''
"Amy", 9

"Tom", 3

"Shierly", 3

"Miccle", 4

"Dockey", 4
```
Pcollection2: 是宠物名字和主人名字
```
"Amy", "michael"

"Tom", "Tommy"

"Shierly", "Darren"

"Miccle", "Cherry"

"Dockey", "Dick"
```
```
age_list = [("Amy", 9),

       ("Tom", 3),

      ("Shierly", 3)

      ("Miccle", 4)

      ("Dockey", 4])]

Owner_list = [("Amy", "michael"),

("Tom", "Tommy"),

("Shierly", "Darren"),

("Miccle", "Cherry"),

("Dockey", "Dick")]

然后我们开始创建两个Pcollections

age = P |"create age" >> beam.Create(age_list)
owner = P | "create owner" >> beam.Create(owner_list)

我们用CoGroupbyKey的时候,是使用key,value的字典格式作为输入

格式为 results = {"Pcollection1名字":Pcollection1, "Pcollection2名字":Pcollection2} | beam.CoGroupByKey()

得到的效果是 [(Key1,{"Pcollection1名字":Pcollection1, "Pcollection2名字":Pcollection2}), (Key2,{"Pcollection1名字":Pcollection1, "Pcollection2名字":Pcollection2}),(Key3,{"Pcollection1名字":Pcollection1, "Pcollection2名字":Pcollection2})]


呈现效果是:
["Tom" , {'age':3, "owner":"Tommy"}
"Shierly" ,{'age':3,"owner":"Darren"}
"Amy",{'age':9,"owner":"michael"}
...
]
```
```
## 总结CoGroupByKey就是把两个Pcollection通过共同的Key连接起来,然后用元组(key,value)显示出来,values是一个字典格式,包含Pcollection名字:value_list

# 一句话表示: 
## COGroupByKey就是元组key包含字典pcollection与定义的value
## GroubByKey就是元组key包含value_list

## CombinePerKey(beam.combiners.MeanCombineFn)
就是把groupbykey 再对每个key的value做加权平均

## Flatten 把多个PCollection 变成一个 PCollection, 
## 说白了就是把多个列表的值放到一个列表
```
# Flatten takes a tuple of PCollection objects.
# Returns a single PCollection that contains all of the elements in the PCollection objects in that tuple.
merged = (
    (pcoll1, pcoll2, pcoll3)
    # A list of tuples can be "piped" directly into a Flatten transform.
    | beam.Flatten())
```
