---
title: AliOSS
date: 2024-05-22 16:24:22
tags: code
category: 工具
description: aliOSS上传文件操作
---

<!--more--->

# AliOSS

## 一、什么是OSS

### 1、介绍

OSS的英文全称是Object Storage Service ，对象存储服务，是一种使用 HTTP API 存储和检索非结构化数据和元数据对象的工具。
可以理解成是一个资源托管的地方，这些资源，就是上面提到的对象。网站或者系统运营的过程中，可能会存储大量的图片、视频、音频这样的静态资源。如果是在服务器本机存储这些内容，维护成本高，不利于迁移，而且容灾效果不佳。为了解决这些问题，可以将这些静态资源托管到第三方服务中 ，而这个资源托管的服务就是对象存储服务。
  

如果只有存储功能，那么OSS服务就跟硬盘没啥区别了，OSS还要有外部访问的能力，这样才能把静态资源传上去（上行流量），别人才可以把这些静态资源下载下来（下行流量）。
  

总结来讲，**OSS就是集存储与访问于一身的资源对象托管服务，用于存储静态资源，同时还提供备份、容灾等常见功能**。

::: tip 注意点：

- 对象，指的是非结构化的静态资源，如图片、音频、视频、日志文件等。
- OSS提供的服务有存储、访问、备份、容灾等。
- OSS一般指第三方云厂商提供的对象存储服务，当然也可以自己在本地机房搭建自己的对象存储，如使用Minio等搭建分布式文件存储服务，用作对象存储。

:::

### 2、OSS中的相关术语

**1.存储空间（Buket）**

存储空间是用于存储对象的容器，所有的对象都存储在某个存储空间中。

**2.对象/文件（Object）**

对象是OSS存储数据的基本单元，也被称为OSS的文件，对象由元信息（Object Meta）、用户数据（Data）和文件名（Key）组成。对象由存储空间内部唯一的key来标识。

**3.地域（Region）**

地域表示OSS的数据中心所在的物理位置，可以根据费用、请求来源等来选择数据存储的地域。

**4.访问域名（Endpoint）**

Endpoint表示对外提供服务的访问域名，OSS以 HTTP restful API 对外提供服务，当访问不同地域的时候，需要不同的域名。通过内网和外网访问同一个地域所需要的域名是不同的。

**5.访问密钥（AccessKey）**

简称AK，指的是访问身份验证中用到的AccessKeyId和AccessKeySecret。OSS通过使用AccessKeyId和AccessKeySecret对称加密的方法来验证某个请求发送者的身份。AccessKeyId用来标识用户，AccessKeySecret用于加密签名字符串和OSS用来验证签名字符串的密钥，AccessKeySecret必须保密。


## 二、使用

### 1、UUID

**1）介绍**

UUID全称：Universally Unique Identifier，即通用唯一识别码。

UUID是由一组32位数的16进制数字所构成，是故UUID理论上的总数为16^32 = 2^128，约等于3.4 x 10^38。也就是说若每纳秒产生1兆个UUID，要花100亿年才会将所有UUID用完。

UUID的标准型式包含32个16进制数字，以连字号分为五段，形式为8-4-4-4-12的32个字符，如：550e8400-e29b-41d4-a716-446655440000。

**UUID的作用：**

UUID的是让分布式系统中的所有元素都能有唯一的辨识信息，而不需要通过中央控制端来做辨识信息的指定。如此一来，每个人都可以创建不与其它人冲突的UUID。在这样的情况下，就不需考虑数据库创建时的名称重复问题。目前最广泛应用的UUID，是微软公司的全局唯一标识符（GUID），而其他重要的应用，则有Linux ext2/ext3文件系统、LUKS加密分区、GNOME、KDE、Mac OS X等等。

**UUID的组成：**

UUID是指在一台机器上生成的数字，它保证对在同一时空中的所有机器都是唯一的。通常平台会提供生成的API。按照开放软件基金会(OSF)制定的标准计算，用到了以太网卡地址、纳秒级时间、芯片ID码和许多可能的数字。

**UUID由以下几部分的组合**：

当前日期和时间，UUID的第一个部分与时间有关，如果你在生成一个UUID之后，过几秒又生成一个UUID，则第一个部分不同，其余相同。

**2）使用**

使用UUID可以生成唯一文件名

```java
 UUID.randomUUID().toString()
```

### 2、本地存储

```java
    @PostMapping("/upload")
    public Result upload(String username, String age, MultipartFile image) throws IOException {
        log.info("文件上传：{},{},{}",username, age, image);


        //获取原始文件名
        String originalFilename = image.getOriginalFilename();
        int index = originalFilename.lastIndexOf(".");
        String extname = originalFilename.substring(index);

        //构造唯一文件名  uuid 通用唯一识别码
        String newFileName = UUID.randomUUID().toString() + extname;
        log.info("新文件名：{}",newFileName);
        // 将接收到的文件存储到本地
        image.transferTo(new File("D:\\hnu\\javaStudy\\最新版JavaWeb开发教程\\资料\\day11-SpringBootWeb案例\\资料\\03. 文件上传\\"+newFileName));

        return Result.success();
    }
```

### 3、阿里云OSS

**1）依赖** 

```xml
        <dependency>
            <groupId>com.aliyun.oss</groupId>
            <artifactId>aliyun-sdk-oss</artifactId>
            <version>3.15.1</version>
        </dependency>
```

**2）配置文件**

```java
@Data
@Component
@ConfigurationProperties(prefix = "aliyun.oss")
public class AliOSSProperties {
    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;
}
```

**3）工具类**

```java
@Component
public class AliOSSUtils {

    @Autowired
    private AliOSSProperties aliOSSProperties;

    /**
     * 实现上传图片到OSS
     */
    public String upload(MultipartFile file) throws IOException {

        String endpoint = aliOSSProperties.getEndpoint();
        String accessKeyId = aliOSSProperties.getAccessKeyId();
        String accessKeySecret = aliOSSProperties.getAccessKeySecret();
        String bucketName = aliOSSProperties.getBucketName();

        // 获取上传的文件的输入流
        InputStream inputStream = file.getInputStream();

        // 避免文件覆盖
        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));

        //上传文件到 OSS
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        ossClient.putObject(bucketName, fileName, inputStream);

        //文件访问路径
        String url = endpoint.split("//")[0] + "//" + bucketName + "." + endpoint.split("//")[1] + "/" + fileName;
        // 关闭ossClient
        ossClient.shutdown();
        return url;// 把上传到oss的路径返回
    }

}
```

**4）使用示例**

```java
@PostMapping("/upload")
    public Result upload( MultipartFile image) throws IOException {
        log.info("文件上传：{}", image.getOriginalFilename());

        //阿里云OSS工具类上传
        String url = aliOSSUtils.upload(image);

        log.info("文件上传完成，文件访问的url：{}",url);

        return Result.success(url);
    }
```

# 参考

[1] [https://blog.csdn.net/tianjiliuhen/article/details/126954490](https://blog.csdn.net/tianjiliuhen/article/details/126954490)
