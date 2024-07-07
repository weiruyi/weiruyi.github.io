---
title: Canal数据同步
date: 2024-07-07 16:24:22
tags: 数据库
category: 八股
icon: "/img/数据同步.svg"
order: 2
---

# Canal数据同步

## 一、介绍

<img src="/image\mysql\mysql1.png" style="zoom:50%;" />

canal，译意为水道/管道/沟渠，主要用途是基于 **MySQL 数据库增量日志解析**，提供**增量数据订阅和消费**。

<!-- more -->

我们常常能遇到异构数据的同步问题，最典型的就是缓存一致性问题。之前我们需要在更新数据库后执行删除缓存操作，而这部分代码往往是高度耦合的。

canal是阿里巴巴开源的MySQL binlog 增量订阅&消费组件。它的原理是伪装成MySQL的从库来监听主库的binlog。因此，我们可以使用canal+MQ的方式把更新数据库和删除缓存进行解耦，同时还可以使用这种方式进行MySQL主从复制以及ES和MySQL的数据同步。

### 工作原理

**MySQL主备复制原理**

- MySQL master 将数据变更写入二进制日志( binary log, 其中记录叫做二进制日志事件binary log events，可以通过 show binlog events 进行查看)
- MySQL slave 将 master 的 binary log events 拷贝到它的中继日志(relay log)
- MySQL slave 重放 relay log 中事件，将数据变更反映它自己的数据

**canal 工作原理**

- canal 模拟 MySQL slave 的交互协议，伪装自己为 MySQL slave ，向 MySQL master 发送dump 协议
- MySQL master 收到 dump 请求，开始推送 binary log 给 slave (即 canal )
- canal 解析 binary log 对象(原始为 byte 流)

## 二、环境搭建

### 1、MySQL

canal的原理是基于mysql binlog技术，所以这里一定需要开启mysql的binlog写入功能。

#### 1）检查binlog写入功能是否开启

```bash
mysql> show variables like 'log_bin';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | OFF    |
+---------------+-------+
1 row in set (0.00 sec)
```

#### 2）如果log_bin为OFF，则表示未开启，开启binlog写入功能

1. 修改 mysql 的配置文件 my.cnf

```bash
vi /etc/my.cnf 
追加内容：
log-bin=mysql-bin     #binlog文件名
binlog_format=ROW     #选择row模式
server_id=1           #mysql实例id,不能和canal的slave Id重复
```

2. 重启 mysql

```bash
service mysql restart	
```

3. 登录 mysql 客户端，查看 log_bin 变量

```bash
mysql> show variables like 'log_bin';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | ON|
+---------------+-------+
1 row in set (0.00 sec)
```

log_bin 为ON表示已开启。

### 2、Canal 

我们使用docker来安装canal,首先拉取canal镜像，我们使用v1.1.5版本

```bash
docker pull canal/canal-server:v1.1.5
```

之后启动镜像，并将配置文件拷贝出来(先在root目录下创建canal文件夹)

```bash
docker run --name canal-server -id canal/canal-server:v1.1.5

# 复制配置文件
docker cp canal-server:/home/admin/canal-server/conf/ /root/canal
docker cp canal-server:/home/admin/canal-server/logs/ /root/canal
```

 删除刚刚启动的容器，修改配置文件

修改Server配置文件`root/canal/example/instance.properties`，主要修改以下几个地方

```
## mysql serverId , v1.0.26+ will autoGen
canal.instance.mysql.slaveId= 20   #1、设置从库id,需要和刚刚mysql中设置的不同

# position info
canal.instance.master.address=mysql:3306   # 2、mysql地址，由于我的canal和mysql在一个网络下，因此直接使用mysql的容器名

#3、 username/password
canal.instance.dbUsername=canal
canal.instance.dbPassword=canal
```





```
docker run --name canal -p 11111:11111 \
-v /root/canal/conf/example/instance.properties:/home/admin/canal-server/conf/example/instance.properties \
-v /root/canal/conf/canal.properties:/home/admin/canal-server/conf/canal.properties \
-v /root/canal/logs/:/home/admin/canal-server/logs/ \
--network hm-net -d canal/canal-server:v1.1.5
```

```
#################################################
## mysql serverId , v1.0.26+ will autoGen
canal.instance.mysql.slaveId= 20

# enable gtid use true/false
canal.instance.gtidon=false

# position info
canal.instance.master.address=mysql:3306
canal.instance.master.journal.name=
canal.instance.master.position=
canal.instance.master.timestamp=
canal.instance.master.gtid=

# rds oss binlog
canal.instance.rds.accesskey=
canal.instance.rds.secretkey=
canal.instance.rds.instanceId=

# table meta tsdb info
canal.instance.tsdb.enable=true
#canal.instance.tsdb.url=jdbc:mysql://127.0.0.1:3306/canal_tsdb
#canal.instance.tsdb.dbUsername=canal
#canal.instance.tsdb.dbPassword=canal

#canal.instance.standby.address =
#canal.instance.standby.journal.name =
#canal.instance.standby.position =
#canal.instance.standby.timestamp =
#canal.instance.standby.gtid=

# username/password
canal.instance.dbUsername=canal
canal.instance.dbPassword=canal
canal.instance.connectionCharset = UTF-8
# enable druid Decrypt database password
canal.instance.enableDruid=false
#canal.instance.pwdPublicKey=MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALK4BUxdDltRRE5/zXpVEVPUgunvscYFtEip3pmLlhrWpacX7y7GCMo2/JM6LeHmiiNdH1FWgGCpUfircSwlWKUCAwEAAQ==

# table regex
# canal.instance.filter.regex=.*\\..*
canal.instance.filter.regex=hm-item\\..*
# table black regex
canal.instance.filter.black.regex=mysql\\.slave_.*
# table field filter(format: schema1.tableName1:field1/field2,schema2.tableName2:field1/field2)
#canal.instance.filter.field=test1.t_product:id/subject/keywords,test2.t_company:id/name/contact/ch
# table field black filter(format: schema1.tableName1:field1/field2,schema2.tableName2:field1/field2)
#canal.instance.filter.black.field=test1.t_product:subject/product_image,test2.t_company:id/name/contact/ch

# mq config
canal.mq.topic=example
# dynamic topic route by schema or table regex
#canal.mq.dynamicTopic=mytest1.user,mytest2\\..*,.*\\..*
canal.mq.partition=0
# hash partition config
#canal.mq.partitionsNum=3
#canal.mq.partitionHash=test.table:id^name,.*\\..*
#canal.mq.dynamicTopicPartitionNum=test.*:4,mycanal:6
#################################################

```



```
#################################################
######### 		common argument		#############
#################################################
# tcp bind ip
canal.ip =
# register ip to zookeeper
canal.register.ip =
canal.port = 11111
canal.metrics.pull.port = 11112
# canal instance user/passwd
# canal.user = canal
# canal.passwd = E3619321C1A937C46A0D8BD1DAC39F93B27D4458

# canal admin config
#canal.admin.manager = 127.0.0.1:8089
canal.admin.port = 11110
canal.admin.user = admin
canal.admin.passwd = 4ACFE3202A5FF5CF467898FC58AAB1D615029441
# admin auto register
#canal.admin.register.auto = true
#canal.admin.register.cluster =
#canal.admin.register.name =

canal.zkServers =
# flush data to zk
canal.zookeeper.flush.period = 1000
canal.withoutNetty = false
# tcp, kafka, rocketMQ, rabbitMQ
canal.serverMode = rabbitMQ
# flush meta cursor/parse position to file
canal.file.data.dir = ${canal.conf.dir}
canal.file.flush.period = 1000
## memory store RingBuffer size, should be Math.pow(2,n)
canal.instance.memory.buffer.size = 16384
## memory store RingBuffer used memory unit size , default 1kb
canal.instance.memory.buffer.memunit = 1024 
## meory store gets mode used MEMSIZE or ITEMSIZE
canal.instance.memory.batch.mode = MEMSIZE
canal.instance.memory.rawEntry = true

## detecing config
canal.instance.detecting.enable = false
#canal.instance.detecting.sql = insert into retl.xdual values(1,now()) on duplicate key update x=now()
canal.instance.detecting.sql = select 1
canal.instance.detecting.interval.time = 3
canal.instance.detecting.retry.threshold = 3
canal.instance.detecting.heartbeatHaEnable = false

# support maximum transaction size, more than the size of the transaction will be cut into multiple transactions delivery
canal.instance.transaction.size =  1024
# mysql fallback connected to new master should fallback times
canal.instance.fallbackIntervalInSeconds = 60

# network config
canal.instance.network.receiveBufferSize = 16384
canal.instance.network.sendBufferSize = 16384
canal.instance.network.soTimeout = 30

# binlog filter config
canal.instance.filter.druid.ddl = true
canal.instance.filter.query.dcl = false
canal.instance.filter.query.dml = false
canal.instance.filter.query.ddl = false
canal.instance.filter.table.error = false
canal.instance.filter.rows = false
canal.instance.filter.transaction.entry = false
canal.instance.filter.dml.insert = false
canal.instance.filter.dml.update = false
canal.instance.filter.dml.delete = false

# binlog format/image check
canal.instance.binlog.format = ROW,STATEMENT,MIXED 
canal.instance.binlog.image = FULL,MINIMAL,NOBLOB

# binlog ddl isolation
canal.instance.get.ddl.isolation = false

# parallel parser config
canal.instance.parser.parallel = true
## concurrent thread number, default 60% available processors, suggest not to exceed Runtime.getRuntime().availableProcessors()
#canal.instance.parser.parallelThreadSize = 16
## disruptor ringbuffer size, must be power of 2
canal.instance.parser.parallelBufferSize = 256

# table meta tsdb info
canal.instance.tsdb.enable = true
canal.instance.tsdb.dir = ${canal.file.data.dir:../conf}/${canal.instance.destination:}
canal.instance.tsdb.url = jdbc:h2:${canal.instance.tsdb.dir}/h2;CACHE_SIZE=1000;MODE=MYSQL;
canal.instance.tsdb.dbUsername = canal
canal.instance.tsdb.dbPassword = canal
# dump snapshot interval, default 24 hour
canal.instance.tsdb.snapshot.interval = 24
# purge snapshot expire , default 360 hour(15 days)
canal.instance.tsdb.snapshot.expire = 360

#################################################
######### 		destinations		#############
#################################################
canal.destinations = example
# conf root dir
canal.conf.dir = ../conf
# auto scan instance dir add/remove and start/stop instance
canal.auto.scan = true
canal.auto.scan.interval = 5
# set this value to 'true' means that when binlog pos not found, skip to latest.
# WARN: pls keep 'false' in production env, or if you know what you want.
canal.auto.reset.latest.pos.mode = false

canal.instance.tsdb.spring.xml = classpath:spring/tsdb/h2-tsdb.xml
#canal.instance.tsdb.spring.xml = classpath:spring/tsdb/mysql-tsdb.xml

canal.instance.global.mode = spring
canal.instance.global.lazy = false
canal.instance.global.manager.address = ${canal.admin.manager}
#canal.instance.global.spring.xml = classpath:spring/memory-instance.xml
canal.instance.global.spring.xml = classpath:spring/file-instance.xml
#canal.instance.global.spring.xml = classpath:spring/default-instance.xml

##################################################
######### 	      MQ Properties      #############
##################################################
# aliyun ak/sk , support rds/mq
canal.aliyun.accessKey =
canal.aliyun.secretKey =
canal.aliyun.uid=

canal.mq.flatMessage = true
canal.mq.canalBatchSize = 50
canal.mq.canalGetTimeout = 100
# Set this value to "cloud", if you want open message trace feature in aliyun.
canal.mq.accessChannel = local

canal.mq.database.hash = true
canal.mq.send.thread.size = 30
canal.mq.build.thread.size = 8

##################################################
######### 		     Kafka 		     #############
##################################################
kafka.bootstrap.servers = 127.0.0.1:9092
kafka.acks = all
kafka.compression.type = none
kafka.batch.size = 16384
kafka.linger.ms = 1
kafka.max.request.size = 1048576
kafka.buffer.memory = 33554432
kafka.max.in.flight.requests.per.connection = 1
kafka.retries = 0

kafka.kerberos.enable = false
kafka.kerberos.krb5.file = "../conf/kerberos/krb5.conf"
kafka.kerberos.jaas.file = "../conf/kerberos/jaas.conf"

##################################################
######### 		    RocketMQ	     #############
##################################################
rocketmq.producer.group = test
rocketmq.enable.message.trace = false
rocketmq.customized.trace.topic =
rocketmq.namespace =
rocketmq.namesrv.addr = 127.0.0.1:9876
rocketmq.retry.times.when.send.failed = 0
rocketmq.vip.channel.enabled = false
rocketmq.tag = 

##################################################
######### 		    RabbitMQ	     #############
##################################################
rabbitmq.host = 192.168.175.129
rabbitmq.virtual.host = /hmall
rabbitmq.exchange = canal.direct
rabbitmq.username = hmall
rabbitmq.password = 123
rabbitmq.deliveryMode = 
```

```
package com.hmall.search;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.otter.canal.client.CanalConnector;
import com.alibaba.otter.canal.client.CanalConnectors;
import com.alibaba.otter.canal.protocol.CanalEntry;
import com.alibaba.otter.canal.protocol.CanalEntry.*;
import com.alibaba.otter.canal.protocol.Message;
import com.google.protobuf.ByteString;
import com.google.protobuf.InvalidProtocolBufferException;
import org.junit.jupiter.api.Test;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;


public class CanalClient {

    //sql队列
    private Queue<String> SQL_QUEUE = new ConcurrentLinkedQueue<>();

    @Resource
    private DataSource dataSource;

    /**
     * canal入库方法
     */
    @Test
    public void run() throws InterruptedException, InvalidProtocolBufferException {

        CanalConnector connector = CanalConnectors.newSingleConnector(new InetSocketAddress("192.168.175.129",
                11111), "example", "", "");
        int batchSize = 10;
        int emptyCount = 0;
        while(true){
            connector.connect();
            connector.subscribe("hm-item.*");
            Message message = connector.get(batchSize);
            List<Entry> entries = message.getEntries();

            if(entries.size() <= 0){
//                System.out.println("当次抓取没有数据");
                Thread.sleep(10000);
            }else {
                for (Entry entry : entries) {
                    //获取表名
                    String tableName = entry.getHeader().getTableName();
                    //获取类型
                    EntryType entryType = entry.getEntryType();
                    //获取序列化后的数据
                    ByteString storeValue = entry.getStoreValue();
                    //
                    if(EntryType.ROWDATA.equals(entryType)){
                        RowChange rowChange = RowChange.parseFrom(storeValue);
                        EventType eventType = rowChange.getEventType();
                        List<RowData> rowDatasList = rowChange.getRowDatasList();
                        for (RowData rowData : rowDatasList) {
                            JSONObject beforeData = new JSONObject();
                            List<Column> beforeColumnsList = rowData.getBeforeColumnsList();
                            for (Column column : beforeColumnsList) {
                                beforeData.put(column.getName(), column.getValue());
                            }
                            JSONObject afterData = new JSONObject();
                            List<Column> afterColumnsList = rowData.getAfterColumnsList();
                            for (Column column : afterColumnsList) {
                                afterData.put(column.getName(), column.getValue());
                            }

                            System.out.println("===============================");
                            System.out.println("table:" + tableName+",eventType:"+eventType);
                            System.out.println("beforeData:"+beforeData);
                            System.out.println("afterData:"+afterData);
                            System.out.println("================================");
                        }

                    }

                }
            }
        }



    }


}

```



```
docker exec -it [c_id]/bin/bash
cd canal-server/bin/
./start.sh  // 启动服务
cd canal-server/logs/example/
tail -100f example.log  // 查看日志

```

![](/image\mysql\mysql2.png)

# 参考：

[1] [https://github.com/alibaba/canal](https://github.com/alibaba/canal)

[2] [https://blog.csdn.net/weixin_42194695/article/details/125935200?utm_source=miniapp_weixin](https://blog.csdn.net/weixin_42194695/article/details/125935200?utm_source=miniapp_weixin)

[3] [https://blog.csdn.net/weixin_42763696/article/details/132188296](https://blog.csdn.net/weixin_42763696/article/details/132188296)