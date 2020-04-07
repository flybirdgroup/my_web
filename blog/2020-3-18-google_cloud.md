---
id: google cloud
title: 使用Google Cloud SDK来配置Google App Engine
author: 招晓贤
author_title: AI engine @ Facebook
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [google cloud, SDK, socket, google cloud init]
---

Learn how to build deep learning in Google Cloud Platform [**Docusaurus 2 alpha**](https://v2.docusaurus.io/).

<!--truncate-->

使用Google Cloud SDK来配置Google App Engine

Google App Engine 是一个脱离了基础架构束缚的全面托管型平台，功能十分强大，当今最成功的一些公司都纷纷在 App Engine 上运行他们的应用。

　　之前我曾经介绍过使用Google App Engine SDK来更新Google App Engine的工程，目前Google App Engine有了一个新的SDK：Google Cloud SDK，使用这个SDK能更快更高效地进行维护和更新。下面我就介绍一下Google Cloud SDK的简单使用方法。

　　先从这个地址来下载安装SDK环境，包括下载并安装 Python 2.7， 下载并安装 Google Cloud SDK。

　　使用 gcloud init --skip-diagnostics 来初始化并登陆Google账户，选择一个工程。支持socks5代理，用户可以在初始化的时候把代理设置上。

![png](../img/SDK/1.png)

![png](../img/SDK/2.png)

