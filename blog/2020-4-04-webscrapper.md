---
id: webscrapper
title: 使用webscrapper爬取信息
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [web, scrapper, shopping]
---
# 爬取电商网站的信息

<!--truncate-->
## step 1: 比如在一个网站搜索纸尿裤, 我们在google chrome的更多工具中点击开发者工具

![png](../img/scrapper/1.png)

## step 2: 
### 1 .选择web scrapper
### 2 .选择create new sitemap
### 3 .选择select, 然后在商品页面选择能够覆盖商品所有信息的位置,然后点击done selecting, 选择mulitple

## step3: 
done selecting后,你发现selector第四个字段是link_54224078139(这个是特点商品的编号),我们去除它,使他泛化,变成div.search_prolist_info


![png](../img/scrapper/2.png)

## step4: 点击save selector,用element preview查看效果是否所有页面都包含
![png](../img/scrapper/3.png)


## step5: 点击item,然后创建新的selector
流程基本一样,但是不选择multiple,然后评论字段的regex写[0-9]+

## step6: 保存selector

### 如果要怕所有页,可以去Sitemap下选择edit metadata来设置

![png](../img/scrapper/4.png)

## step7: 回到root,然后选择sitemap的下拉菜单的Scrape
![png](../img/scrapper/5.png)

## step8: 点击start scraping
![png](../img/scrapper/6.png)

## step9: Sitemap选择browse,可以查看所有data
![png](../img/scrapper/7.png)

## 选择Sitemap,导出csv文件

