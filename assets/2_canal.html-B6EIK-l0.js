import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,b as n,o as s}from"./app-BEOon9vG.js";const l="/image/mysql/mysql1.png",d="/image/mysql/mysql2.png",t={},r=n('<h1 id="canal数据同步" tabindex="-1"><a class="header-anchor" href="#canal数据同步"><span>Canal数据同步</span></a></h1><h2 id="一、介绍" tabindex="-1"><a class="header-anchor" href="#一、介绍"><span>一、介绍</span></a></h2><img src="'+l+'" style="zoom:50%;"><p>canal，译意为水道/管道/沟渠，主要用途是基于 <strong>MySQL 数据库增量日志解析</strong>，提供<strong>增量数据订阅和消费</strong>。</p>',4),c=n(`<p>我们常常能遇到异构数据的同步问题，最典型的就是缓存一致性问题。之前我们需要在更新数据库后执行删除缓存操作，而这部分代码往往是高度耦合的。</p><p>canal是阿里巴巴开源的MySQL binlog 增量订阅&amp;消费组件。它的原理是伪装成MySQL的从库来监听主库的binlog。因此，我们可以使用canal+MQ的方式把更新数据库和删除缓存进行解耦，同时还可以使用这种方式进行MySQL主从复制以及ES和MySQL的数据同步。</p><h3 id="工作原理" tabindex="-1"><a class="header-anchor" href="#工作原理"><span>工作原理</span></a></h3><p><strong>MySQL主备复制原理</strong></p><ul><li>MySQL master 将数据变更写入二进制日志( binary log, 其中记录叫做二进制日志事件binary log events，可以通过 show binlog events 进行查看)</li><li>MySQL slave 将 master 的 binary log events 拷贝到它的中继日志(relay log)</li><li>MySQL slave 重放 relay log 中事件，将数据变更反映它自己的数据</li></ul><p><strong>canal 工作原理</strong></p><ul><li>canal 模拟 MySQL slave 的交互协议，伪装自己为 MySQL slave ，向 MySQL master 发送dump 协议</li><li>MySQL master 收到 dump 请求，开始推送 binary log 给 slave (即 canal )</li><li>canal 解析 binary log 对象(原始为 byte 流)</li></ul><h2 id="二、环境搭建" tabindex="-1"><a class="header-anchor" href="#二、环境搭建"><span>二、环境搭建</span></a></h2><h3 id="_1、mysql" tabindex="-1"><a class="header-anchor" href="#_1、mysql"><span>1、MySQL</span></a></h3><p>canal的原理是基于mysql binlog技术，所以这里一定需要开启mysql的binlog写入功能。</p><h4 id="_1-检查binlog写入功能是否开启" tabindex="-1"><a class="header-anchor" href="#_1-检查binlog写入功能是否开启"><span>1）检查binlog写入功能是否开启</span></a></h4><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>mysql<span class="token operator">&gt;</span> show variables like <span class="token string">&#39;log_bin&#39;</span><span class="token punctuation">;</span>
+---------------+-------+
<span class="token operator">|</span> Variable_name <span class="token operator">|</span> Value <span class="token operator">|</span>
+---------------+-------+
<span class="token operator">|</span> log_bin       <span class="token operator">|</span> OFF    <span class="token operator">|</span>
+---------------+-------+
<span class="token number">1</span> row <span class="token keyword">in</span> <span class="token builtin class-name">set</span> <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-如果log-bin为off-则表示未开启-开启binlog写入功能" tabindex="-1"><a class="header-anchor" href="#_2-如果log-bin为off-则表示未开启-开启binlog写入功能"><span>2）如果log_bin为OFF，则表示未开启，开启binlog写入功能</span></a></h4><ol><li>修改 mysql 的配置文件 my.cnf</li></ol><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">vi</span> /etc/my.cnf 
追加内容：
log-bin<span class="token operator">=</span>mysql-bin     <span class="token comment">#binlog文件名</span>
<span class="token assign-left variable">binlog_format</span><span class="token operator">=</span>ROW     <span class="token comment">#选择row模式</span>
<span class="token assign-left variable">server_id</span><span class="token operator">=</span><span class="token number">1</span>           <span class="token comment">#mysql实例id,不能和canal的slave Id重复</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>重启 mysql</li></ol><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">service</span> mysql restart	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3"><li>登录 mysql 客户端，查看 log_bin 变量</li></ol><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>mysql<span class="token operator">&gt;</span> show variables like <span class="token string">&#39;log_bin&#39;</span><span class="token punctuation">;</span>
+---------------+-------+
<span class="token operator">|</span> Variable_name <span class="token operator">|</span> Value <span class="token operator">|</span>
+---------------+-------+
<span class="token operator">|</span> log_bin       <span class="token operator">|</span> ON<span class="token operator">|</span>
+---------------+-------+
<span class="token number">1</span> row <span class="token keyword">in</span> <span class="token builtin class-name">set</span> <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>log_bin 为ON表示已开启。</p><h3 id="_2、canal" tabindex="-1"><a class="header-anchor" href="#_2、canal"><span>2、Canal</span></a></h3><p>我们使用docker来安装canal,首先拉取canal镜像，我们使用v1.1.5版本</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">docker</span> pull canal/canal-server:v1.1.5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>之后启动镜像，并将配置文件拷贝出来(先在root目录下创建canal文件夹)</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">--name</span> canal-server <span class="token parameter variable">-id</span> canal/canal-server:v1.1.5

<span class="token comment"># 复制配置文件</span>
<span class="token function">docker</span> <span class="token function">cp</span> canal-server:/home/admin/canal-server/conf/ /root/canal
<span class="token function">docker</span> <span class="token function">cp</span> canal-server:/home/admin/canal-server/logs/ /root/canal
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>删除刚刚启动的容器，修改配置文件</p><p>修改Server配置文件<code>root/canal/example/instance.properties</code>，主要修改以下几个地方</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## mysql serverId , v1.0.26+ will autoGen
canal.instance.mysql.slaveId= 20   #1、设置从库id,需要和刚刚mysql中设置的不同

# position info
canal.instance.master.address=mysql:3306   # 2、mysql地址，由于我的canal和mysql在一个网络下，因此直接使用mysql的容器名

#3、 username/password
canal.instance.dbUsername=canal
canal.instance.dbPassword=canal
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>docker run --name canal -p 11111:11111 \\
-v /root/canal/conf/example/instance.properties:/home/admin/canal-server/conf/example/instance.properties \\
-v /root/canal/conf/canal.properties:/home/admin/canal-server/conf/canal.properties \\
-v /root/canal/logs/:/home/admin/canal-server/logs/ \\
--network hm-net -d canal/canal-server:v1.1.5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#################################################
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
# canal.instance.filter.regex=.*\\\\..*
canal.instance.filter.regex=hm-item\\\\..*
# table black regex
canal.instance.filter.black.regex=mysql\\\\.slave_.*
# table field filter(format: schema1.tableName1:field1/field2,schema2.tableName2:field1/field2)
#canal.instance.filter.field=test1.t_product:id/subject/keywords,test2.t_company:id/name/contact/ch
# table field black filter(format: schema1.tableName1:field1/field2,schema2.tableName2:field1/field2)
#canal.instance.filter.black.field=test1.t_product:subject/product_image,test2.t_company:id/name/contact/ch

# mq config
canal.mq.topic=example
# dynamic topic route by schema or table regex
#canal.mq.dynamicTopic=mytest1.user,mytest2\\\\..*,.*\\\\..*
canal.mq.partition=0
# hash partition config
#canal.mq.partitionsNum=3
#canal.mq.partitionHash=test.table:id^name,.*\\\\..*
#canal.mq.dynamicTopicPartitionNum=test.*:4,mycanal:6
#################################################

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#################################################
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
canal.file.data.dir = \${canal.conf.dir}
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
canal.instance.tsdb.dir = \${canal.file.data.dir:../conf}/\${canal.instance.destination:}
canal.instance.tsdb.url = jdbc:h2:\${canal.instance.tsdb.dir}/h2;CACHE_SIZE=1000;MODE=MYSQL;
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
# set this value to &#39;true&#39; means that when binlog pos not found, skip to latest.
# WARN: pls keep &#39;false&#39; in production env, or if you know what you want.
canal.auto.reset.latest.pos.mode = false

canal.instance.tsdb.spring.xml = classpath:spring/tsdb/h2-tsdb.xml
#canal.instance.tsdb.spring.xml = classpath:spring/tsdb/mysql-tsdb.xml

canal.instance.global.mode = spring
canal.instance.global.lazy = false
canal.instance.global.manager.address = \${canal.admin.manager}
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
# Set this value to &quot;cloud&quot;, if you want open message trace feature in aliyun.
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
kafka.kerberos.krb5.file = &quot;../conf/kerberos/krb5.conf&quot;
kafka.kerberos.jaas.file = &quot;../conf/kerberos/jaas.conf&quot;

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>package com.hmall.search;

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
    private Queue&lt;String&gt; SQL_QUEUE = new ConcurrentLinkedQueue&lt;&gt;();

    @Resource
    private DataSource dataSource;

    /**
     * canal入库方法
     */
    @Test
    public void run() throws InterruptedException, InvalidProtocolBufferException {

        CanalConnector connector = CanalConnectors.newSingleConnector(new InetSocketAddress(&quot;192.168.175.129&quot;,
                11111), &quot;example&quot;, &quot;&quot;, &quot;&quot;);
        int batchSize = 10;
        int emptyCount = 0;
        while(true){
            connector.connect();
            connector.subscribe(&quot;hm-item.*&quot;);
            Message message = connector.get(batchSize);
            List&lt;Entry&gt; entries = message.getEntries();

            if(entries.size() &lt;= 0){
//                System.out.println(&quot;当次抓取没有数据&quot;);
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
                        List&lt;RowData&gt; rowDatasList = rowChange.getRowDatasList();
                        for (RowData rowData : rowDatasList) {
                            JSONObject beforeData = new JSONObject();
                            List&lt;Column&gt; beforeColumnsList = rowData.getBeforeColumnsList();
                            for (Column column : beforeColumnsList) {
                                beforeData.put(column.getName(), column.getValue());
                            }
                            JSONObject afterData = new JSONObject();
                            List&lt;Column&gt; afterColumnsList = rowData.getAfterColumnsList();
                            for (Column column : afterColumnsList) {
                                afterData.put(column.getName(), column.getValue());
                            }

                            System.out.println(&quot;===============================&quot;);
                            System.out.println(&quot;table:&quot; + tableName+&quot;,eventType:&quot;+eventType);
                            System.out.println(&quot;beforeData:&quot;+beforeData);
                            System.out.println(&quot;afterData:&quot;+afterData);
                            System.out.println(&quot;================================&quot;);
                        }

                    }

                }
            }
        }



    }


}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>docker exec -it [c_id]/bin/bash
cd canal-server/bin/
./start.sh  // 启动服务
cd canal-server/logs/example/
tail -100f example.log  // 查看日志

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+d+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h1 id="参考" tabindex="-1"><a class="header-anchor" href="#参考"><span>参考：</span></a></h1><p>[1] <a href="https://github.com/alibaba/canal" target="_blank" rel="noopener noreferrer">https://github.com/alibaba/canal</a></p><p>[2] <a href="https://blog.csdn.net/weixin_42194695/article/details/125935200?utm_source=miniapp_weixin" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/weixin_42194695/article/details/125935200?utm_source=miniapp_weixin</a></p><p>[3] <a href="https://blog.csdn.net/weixin_42763696/article/details/132188296" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/weixin_42763696/article/details/132188296</a></p>',38);function v(m,o){return s(),a("div",null,[r,i(" more "),c])}const p=e(t,[["render",v],["__file","2_canal.html.vue"]]),g=JSON.parse('{"path":"/posts/%E6%95%B0%E6%8D%AE%E5%BA%93/MySQL/2_canal.html","title":"Canal数据同步","lang":"zh-CN","frontmatter":{"title":"Canal数据同步","date":"2024-07-07T16:24:22.000Z","tags":"数据库","category":"八股","icon":"/img/数据同步.svg","order":2,"description":"一、介绍 canal，译意为水道/管道/沟渠，主要用途是基于 MySQL 数据库增量日志解析，提供增量数据订阅和消费。","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/%E6%95%B0%E6%8D%AE%E5%BA%93/MySQL/2_canal.html"}],["meta",{"property":"og:site_name","content":"Lance"}],["meta",{"property":"og:title","content":"Canal数据同步"}],["meta",{"property":"og:description","content":"一、介绍 canal，译意为水道/管道/沟渠，主要用途是基于 MySQL 数据库增量日志解析，提供增量数据订阅和消费。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://mister-hope.github.io/image\\\\mysql\\\\mysql2.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-07-07T08:32:44.000Z"}],["meta",{"property":"article:author","content":"RuyiWei"}],["meta",{"property":"article:published_time","content":"2024-07-07T16:24:22.000Z"}],["meta",{"property":"article:modified_time","content":"2024-07-07T08:32:44.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Canal数据同步\\",\\"image\\":[\\"https://mister-hope.github.io/image\\\\\\\\mysql\\\\\\\\mysql2.png\\"],\\"datePublished\\":\\"2024-07-07T16:24:22.000Z\\",\\"dateModified\\":\\"2024-07-07T08:32:44.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"RuyiWei\\"}]}"]]},"headers":[{"level":2,"title":"一、介绍","slug":"一、介绍","link":"#一、介绍","children":[{"level":3,"title":"工作原理","slug":"工作原理","link":"#工作原理","children":[]}]},{"level":2,"title":"二、环境搭建","slug":"二、环境搭建","link":"#二、环境搭建","children":[{"level":3,"title":"1、MySQL","slug":"_1、mysql","link":"#_1、mysql","children":[]},{"level":3,"title":"2、Canal","slug":"_2、canal","link":"#_2、canal","children":[]}]}],"git":{"createdTime":1720341164000,"updatedTime":1720341164000,"contributors":[{"name":"weiruyi","email":"1581778251@qq.com","commits":1}]},"readingTime":{"minutes":5.43,"words":1629},"filePathRelative":"posts/数据库/MySQL/2_canal.md","localizedDate":"2024年7月7日","excerpt":"\\n<h2>一、介绍</h2>\\n<img src=\\"/image\\\\mysql\\\\mysql1.png\\" style=\\"zoom:50%;\\">\\n<p>canal，译意为水道/管道/沟渠，主要用途是基于 <strong>MySQL 数据库增量日志解析</strong>，提供<strong>增量数据订阅和消费</strong>。</p>\\n","autoDesc":true}');export{p as comp,g as data};
