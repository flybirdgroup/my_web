---
id: GCP_shell_python
title: 谷歌安装GCP_shell_python命令

author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
tags: [shell, python, apache-beam,google cloud, linux]
---
Install virtualenv version 13.1.0 or above if it is not installed already.
```python
pip3 install --upgrade virtualenv \
    --user
```
Create a Python virtual environment 创建虚拟环境
```
python3 -m virtualenv env
```

activate it 激活环境
```
source env/bin/activate
```

In order to write a Python Dataflow job, you will first need to download the SDK from the repository.

When you run this command, pip3 will download and install the appropriate version of the Apache Beam SDK.

```python
pip3 install --quiet \
    apache-beam[gcp]
```







