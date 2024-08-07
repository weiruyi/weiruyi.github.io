---
title: 学成在线
date: 2024-06-5 16:24:22
tags: 项目
category: 学成在线
icon: "/img/教育.svg"
---

<!--more--->

# 学成在线

学成在线就是一个在线学习平台，类似慕课网以及腾讯学堂，是专门针对IT行业进行在线学习的平台。学成在线采用B2B2C的业务模式，即向企业与个人提供平台实现教学服务，其中企业就是老师，提供课程，作业，考试等；个人就是学生，通过平台实现教学和学习的过程。

## 技术栈

SpringCloud+MyBatisPlus+MySQL+Redis+Nacos+RabbitMQ+Elasticsearch+xxl-job

## 实现功能

- 内容管理模块：对课程及相关信息进行维护，培训机构登录机构端，编辑课程相关的信息
- 媒资管理模块：对文档、视频等文件进行统一管理
- 选课学习模块：视频播放，课程计划查询，动态获取视频地址
- 认证授权模块：登录，登出，查询JWT用户信息，权限校验管理，Zuul网关路由，拦截
- 订单支付模块：对接微信和支付宝接口实现支付功能，支付成功后自动添加选课（分布式事务）

## 项目亮点

- 使用Elasticsearch实现课程搜索功能，从而实现全文检索的效果；
- 通过Redis技术进行数据的缓存,提高访问速度:
- 使用 RabbitMQ 作为项目消息中间件，基于RabbitMQ延迟队列处理未支付订单；
- 基于xxl-job实现任务调度，从而更加高效地实现视频转码任务，并使用FFmpeg+线程池实现多线程视频转码；
- 使用MinIO搭建分布式文件系统用来存储视频和图片，并使用断点续传的方式提高用户体验；
- 使用Freemarker实现课程详情页面的静态化
- 使用Oauth2+JWT实现单点登录
