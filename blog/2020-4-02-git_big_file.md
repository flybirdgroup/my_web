---
id: git_big_file
title: 轻松上传超过100M的文件至GitHub
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [git, lfs, github]
---
# 轻松上传超过100M的文件至GitHub
GitHub有一个限制，不能上传超过100M的文件。想要上传超过100M的文件，就需要借助Git LFS
<!--truncate-->

## step1: 安装LFS,执行命令
```python
brew install git-lfs
```

## step2: 进入仓库目录,执行命令

```python
git lfs track "file"
git add .gitattributes
git commit -m "submit file"
git push -u origin master 
```
file是要上传的文件,一般执行完step2后,会生成".gitattributes"文件，文件内记录了我们要上传文件的信息。只有先把".gitattributes"传上去，才可以上传大文件。

## step3: 上传大文件

```python
git add file
git commit -m "add file"
git push -u origin master
```
## 实战demo如下:
### 切换到仓库目录,是git status查看状态
![png](../img/git/1.png)
### 执行刚才的所有命令
![png](../img/git/2.png)
我们发现上传失败,是因为connection失败了

### 我们尝试设置全球变量
```python
git config --global user.name"name"
```
![png](../img/git/3.png)

### 重新执行push命令,最后上传成功啦
```python
git push -u origin master
```
