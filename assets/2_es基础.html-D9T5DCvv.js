import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as t,a as i,b as l,o as a}from"./app-BNd_UKdk.js";const s="/image/es/es2.png",n="/image/es/es3.jpeg",d="/image/es/es4.jpeg",r="/image/es/es5.png",c="/image/es/es6.png",o="/image/es/es7.png",p="/image/es/es8.png",g="/image/es/es9.png",h="/image/es/es10.png",u={},m=l(`<h1 id="elasticsearch基础" tabindex="-1"><a class="header-anchor" href="#elasticsearch基础"><span>ElasticSearch基础</span></a></h1><h2 id="一、安装" tabindex="-1"><a class="header-anchor" href="#一、安装"><span>一、安装</span></a></h2><h3 id="_1、安装elasticsearch" tabindex="-1"><a class="header-anchor" href="#_1、安装elasticsearch"><span>1、安装ElasticSearch</span></a></h3><p>通过下面的Docker命令即可安装单机版本的elasticsearch：</p><div class="language-Bash line-numbers-mode" data-ext="Bash" data-title="Bash"><pre class="language-Bash"><code>docker run -d \\
  --name es \\
  -e &quot;ES_JAVA_OPTS=-Xms512m -Xmx512m&quot; \\
  -e &quot;discovery.type=single-node&quot; \\
  -v es-data:/usr/share/elasticsearch/data \\
  -v es-plugins:/usr/share/elasticsearch/plugins \\
  --privileged \\
  --network hm-net \\
  -p 9200:9200 \\
  -p 9300:9300 \\
  elasticsearch:7.12.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，这里我们采用的是elasticsearch的7.12.1版本，8以上版本的JavaAPI变化很大，在企业中应用并不广泛。</p><p>安装完成后，访问9200端口，即可看到响应的Elasticsearch服务的基本信息。</p><h3 id="_2、安装kibana" tabindex="-1"><a class="header-anchor" href="#_2、安装kibana"><span>2、安装Kibana</span></a></h3><p>通过下面的Docker命令，即可部署Kibana：</p><div class="language-Bash line-numbers-mode" data-ext="Bash" data-title="Bash"><pre class="language-Bash"><code>docker run -d \\
--name kibana \\
-e ELASTICSEARCH_HOSTS=http://es:9200 \\
--network=hm-net \\
-p 5601:5601  \\
kibana:7.12.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装完成后，直接访问5601端口，即可看到控制台页面</p><figure><img src="`+s+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>选择<code>Explore on my own</code>之后，进入主页面,然后选中<code>Dev tools</code>，进入开发工具页面。</p><h2 id="二、倒排索引" tabindex="-1"><a class="header-anchor" href="#二、倒排索引"><span>二、倒排索引</span></a></h2><p>elasticsearch之所以有如此高性能的搜索表现，正是得益于底层的倒排索引技术。那么什么是倒排索引呢？</p><p><strong>倒排</strong>索引的概念是基于MySQL这样的<strong>正向</strong>索引而言的。</p><h3 id="_1、正向索引" tabindex="-1"><a class="header-anchor" href="#_1、正向索引"><span>1、正向索引</span></a></h3><p>我们先来回顾一下正向索引。</p><p>例如有一张名为<code>tb_goods</code>的表：</p><table><thead><tr><th style="text-align:left;"><strong>id</strong></th><th style="text-align:left;"><strong>title</strong></th><th style="text-align:left;"><strong>price</strong></th></tr></thead><tbody><tr><td style="text-align:left;">1</td><td style="text-align:left;">小米手机</td><td style="text-align:left;">3499</td></tr><tr><td style="text-align:left;">2</td><td style="text-align:left;">华为手机</td><td style="text-align:left;">4999</td></tr><tr><td style="text-align:left;">3</td><td style="text-align:left;">华为小米充电器</td><td style="text-align:left;">49</td></tr><tr><td style="text-align:left;">4</td><td style="text-align:left;">小米手环</td><td style="text-align:left;">49</td></tr><tr><td style="text-align:left;">...</td><td style="text-align:left;">...</td><td style="text-align:left;">...</td></tr></tbody></table><p>其中的<code>id</code>字段已经创建了索引，由于索引底层采用了B+树结构，因此我们根据id搜索的速度会非常快。但是其他字段例如<code>title</code>，只在叶子节点上存在。</p><p>因此要根据<code>title</code>搜索的时候只能遍历树中的每一个叶子节点，判断title数据是否符合要求。</p><p>比如用户的SQL语句为：</p><div class="language-SQL line-numbers-mode" data-ext="SQL" data-title="SQL"><pre class="language-SQL"><code>select * from tb_goods where title like &#39;%手机%&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>搜索的大概流程如图：</p><figure><img src="`+n+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="hint-container info"><p class="hint-container-title">说明</p><ul><li>1）检查到搜索条件为<code>like &#39;%手机%&#39;</code>，需要找到<code>title</code>中包含<code>手机</code>的数据</li><li>2）逐条遍历每行数据（每个叶子节点），比如第1次拿到<code>id</code>为1的数据</li><li>3）判断数据中的<code>title</code>字段值是否符合条件</li><li>4）如果符合则放入结果集，不符合则丢弃</li><li>5）回到步骤1</li></ul></div><p>综上，根据id精确匹配时，可以走索引，查询效率较高。而当搜索条件为模糊匹配时，由于索引无法生效，导致从索引查询退化为全表扫描，效率很差。</p><p>因此，正向索引适合于根据索引字段的精确搜索，不适合基于部分词条的模糊匹配。而倒排索引恰好解决的就是根据部分词条模糊匹配的问题。</p><h3 id="_2、倒排索引" tabindex="-1"><a class="header-anchor" href="#_2、倒排索引"><span>2、倒排索引</span></a></h3><p>倒排索引中有两个非常重要的概念：</p><ul><li>文档（<code>Document</code>）：用来搜索的数据，其中的每一条数据就是一个文档。例如一个网页、一个商品信息</li><li>词条（<code>Term</code>）：对文档数据或用户搜索数据，利用某种算法分词，得到的具备含义的词语就是词条。例如：我是中国人，就可以分为：我、是、中国人、中国、国人这样的几个词条</li></ul><div class="hint-container info"><p class="hint-container-title">创建倒排索引是对正向索引的一种特殊处理和应用，流程如下：</p><ul><li>将每一个文档的数据利用<strong>分词算法</strong>根据语义拆分，得到一个个词条</li><li>创建表，每行数据包括词条、词条所在文档id、位置等信息</li><li>因为词条唯一性，可以给词条创建<strong>正向</strong>索引</li></ul></div><p>此时形成的这张以词条为索引的表，就是倒排索引表，两者对比如下：</p><p><strong>正向索引</strong></p><table><thead><tr><th style="text-align:left;"><strong>id（索引）</strong></th><th style="text-align:left;"><strong>title</strong></th><th style="text-align:left;"><strong>price</strong></th></tr></thead><tbody><tr><td style="text-align:left;">1</td><td style="text-align:left;">小米手机</td><td style="text-align:left;">3499</td></tr><tr><td style="text-align:left;">2</td><td style="text-align:left;">华为手机</td><td style="text-align:left;">4999</td></tr><tr><td style="text-align:left;">3</td><td style="text-align:left;">华为小米充电器</td><td style="text-align:left;">49</td></tr><tr><td style="text-align:left;">4</td><td style="text-align:left;">小米手环</td><td style="text-align:left;">49</td></tr><tr><td style="text-align:left;">...</td><td style="text-align:left;">...</td><td style="text-align:left;">...</td></tr></tbody></table><p><strong>倒排索引</strong></p><table><thead><tr><th style="text-align:left;"><strong>词条（索引）</strong></th><th style="text-align:left;"><strong>文档id</strong></th></tr></thead><tbody><tr><td style="text-align:left;">小米</td><td style="text-align:left;">1，3，4</td></tr><tr><td style="text-align:left;">手机</td><td style="text-align:left;">1，2</td></tr><tr><td style="text-align:left;">华为</td><td style="text-align:left;">2，3</td></tr><tr><td style="text-align:left;">充电器</td><td style="text-align:left;">3</td></tr><tr><td style="text-align:left;">手环</td><td style="text-align:left;">4</td></tr></tbody></table><p>倒排索引的<strong>搜索流程</strong>如下（以搜索&quot;华为手机&quot;为例），如图：</p><figure><img src="'+d+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="hint-container info"><p class="hint-container-title">流程描述：</p><p>1）用户输入条件<code>&quot;华为手机&quot;</code>进行搜索。</p><p>2）对用户输入条件<strong>分词</strong>，得到词条：<code>华为</code>、<code>手机</code>。</p><p>3）拿着词条在倒排索引中查找（<strong>由于词条有索引，查询效率很高</strong>），即可得到包含词条的文档id：<code>1、2、3</code>。</p><p>4）拿着文档<code>id</code>到正向索引中查找具体文档即可（由于<code>id</code>也有索引，查询效率也很高）。</p></div><p>虽然要先查询倒排索引，再查询倒排索引，但是无论是词条、还是文档id都建立了索引，查询速度非常快！无需全表扫描。</p><h3 id="_3、正向和倒排" tabindex="-1"><a class="header-anchor" href="#_3、正向和倒排"><span>3、正向和倒排</span></a></h3><p>那么为什么一个叫做正向索引，一个叫做倒排索引呢？</p><ul><li><strong>正向索引</strong>是最传统的，根据id索引的方式。但根据词条查询时，必须先逐条获取每个文档，然后判断文档中是否包含所需要的词条，是<strong>根据文档找词条的过程</strong>。</li><li>而<strong>倒排索引</strong>则相反，是先找到用户要搜索的词条，根据词条得到保护词条的文档的id，然后根据id获取文档。是<strong>根据词条找文档的过程</strong>。</li></ul><p>那么两者方式的优缺点是什么呢？</p><div class="hint-container tip"><p class="hint-container-title">正向索引：</p><ul><li>优点： <ul><li>可以给多个字段创建索引</li><li>根据索引字段搜索、排序速度非常快</li></ul></li><li>缺点： <ul><li>根据非索引字段，或者索引字段中的部分词条查找时，只能全表扫描。</li></ul></li></ul></div><div class="hint-container tip"><p class="hint-container-title">倒排索引：</p><ul><li>优点： <ul><li>根据词条搜索、模糊搜索时，速度非常快</li></ul></li><li>缺点： <ul><li>只能给词条创建索引，而不是字段</li><li>无法根据字段做排序</li></ul></li></ul></div><h2 id="三、基础概念" tabindex="-1"><a class="header-anchor" href="#三、基础概念"><span>三、基础概念</span></a></h2><p>elasticsearch中有很多独有的概念，与mysql中略有差别，但也有相似之处。</p><h3 id="_1、文档和字段" tabindex="-1"><a class="header-anchor" href="#_1、文档和字段"><span>1、文档和字段</span></a></h3><p>elasticsearch是面向 <strong>文档（Document）</strong> 存储的，可以是数据库中的一条商品数据，一个订单信息。文档数据会被序列化为<code>json</code>格式后存储在<code>elasticsearch</code>中：</p><figure><img src="'+r+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>因此，原本数据库中的一行数据就是ES中的一个JSON文档；而数据库中每行数据都包含很多列，这些列就转换为JSON文档中的<strong>字段（Field）</strong>。</p><h3 id="_2、索引和映射" tabindex="-1"><a class="header-anchor" href="#_2、索引和映射"><span>2、索引和映射</span></a></h3><p>随着业务发展，需要在es中存储的文档也会越来越多，比如有商品的文档、用户的文档、订单文档等等</p><figure><img src="'+c+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>所有文档都散乱存放显然非常混乱，也不方便管理。</p><p>因此，我们要将类型相同的文档集中在一起管理，称为<strong>索引（Index）</strong>。例如：</p><figure><img src="'+o+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>所有用户文档，就可以组织在一起，称为用户的索引；</li><li>所有商品的文档，可以组织在一起，称为商品的索引；</li><li>所有订单的文档，可以组织在一起，称为订单的索引；</li></ul><p>因此，我们可以把索引当做是数据库中的表。</p><p>数据库的表会有约束信息，用来定义表的结构、字段的名称、类型等信息。因此，索引库中就有<strong>映射（mapping）</strong>，是索引中文档的字段约束信息，类似表的结构约束。</p><h3 id="_3、mysql与elasticsearch" tabindex="-1"><a class="header-anchor" href="#_3、mysql与elasticsearch"><span>3、mysql与elasticsearch</span></a></h3><p>我们统一的把mysql与elasticsearch的概念做一下对比：</p><table><thead><tr><th style="text-align:left;"><strong>MySQL</strong></th><th style="text-align:left;"><strong>Elasticsearch</strong></th><th style="text-align:left;"><strong>说明</strong></th></tr></thead><tbody><tr><td style="text-align:left;">Table</td><td style="text-align:left;">Index</td><td style="text-align:left;">索引(index)，就是文档的集合，类似数据库的表(table)</td></tr><tr><td style="text-align:left;">Row</td><td style="text-align:left;">Document</td><td style="text-align:left;">文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是JSON格式</td></tr><tr><td style="text-align:left;">Column</td><td style="text-align:left;">Field</td><td style="text-align:left;">字段（Field），就是JSON文档中的字段，类似数据库中的列（Column）</td></tr><tr><td style="text-align:left;">Schema</td><td style="text-align:left;">Mapping</td><td style="text-align:left;">Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema）</td></tr><tr><td style="text-align:left;">SQL</td><td style="text-align:left;">DSL</td><td style="text-align:left;">DSL是elasticsearch提供的JSON风格的请求语句，用来操作elasticsearch，实现CRUD</td></tr></tbody></table><p>如图：</p><figure><img src="'+p+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>两者各自有自己的擅长之处：</p><ul><li>Mysql：擅长事务类型操作，可以确保数据的安全和一致性</li><li>Elasticsearch：擅长海量数据的搜索、分析、计算</li></ul><div class="hint-container tip"><p class="hint-container-title">往往是两者结合使用：</p><ul><li>对安全性要求较高的写操作，使用mysql实现</li><li>对查询性能要求较高的搜索需求，使用elasticsearch实现</li><li>两者再基于某种方式，实现数据的同步，保证一致性</li></ul></div><figure><img src="'+g+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="四、ik分词器" tabindex="-1"><a class="header-anchor" href="#四、ik分词器"><span>四、IK分词器</span></a></h2><p>Elasticsearch的关键就是倒排索引，而倒排索引依赖于对文档内容的分词，而分词则需要高效、精准的分词算法，IK分词器就是这样一个中文分词算法。</p><h3 id="_1、安装ik分词器" tabindex="-1"><a class="header-anchor" href="#_1、安装ik分词器"><span>1、安装IK分词器</span></a></h3><p><strong>方案一</strong>：在线安装</p><p>运行一个命令即可：</p><div class="language-Shell line-numbers-mode" data-ext="Shell" data-title="Shell"><pre class="language-Shell"><code>docker exec -it es ./bin/elasticsearch-plugin  install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.12.1/elasticsearch-analysis-ik-7.12.1.zip
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后重启es容器：</p><div class="language-Shell line-numbers-mode" data-ext="Shell" data-title="Shell"><pre class="language-Shell"><code>docker restart es
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>方案二</strong>：离线安装</p><p>如果网速较差，也可以选择离线安装。</p><p>首先，查看之前安装的Elasticsearch容器的plugins数据卷目录：</p><div class="language-Shell line-numbers-mode" data-ext="Shell" data-title="Shell"><pre class="language-Shell"><code>docker volume inspect es-plugins
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>结果如下：</p><div class="language-JSON line-numbers-mode" data-ext="JSON" data-title="JSON"><pre class="language-JSON"><code>[
    {
        &quot;CreatedAt&quot;: &quot;2024-11-06T10:06:34+08:00&quot;,
        &quot;Driver&quot;: &quot;local&quot;,
        &quot;Labels&quot;: null,
        &quot;Mountpoint&quot;: &quot;/var/lib/docker/volumes/es-plugins/_data&quot;,
        &quot;Name&quot;: &quot;es-plugins&quot;,
        &quot;Options&quot;: null,
        &quot;Scope&quot;: &quot;local&quot;
    }
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到elasticsearch的插件挂载到了<code>/var/lib/docker/volumes/es-plugins/_data</code>这个目录。我们需要把IK分词器上传至这个目录。</p><h3 id="_2、使用ik分词器" tabindex="-1"><a class="header-anchor" href="#_2、使用ik分词器"><span>2、使用IK分词器</span></a></h3><p>IK分词器包含两种模式：</p><ul><li><code>ik_smart</code>：智能语义切分</li><li><code>ik_max_word</code>：最细粒度切分</li></ul><p>在Kibana的DevTools上来测试分词器，首先测试Elasticsearch官方提供的标准分词器：</p><div class="language-JSON line-numbers-mode" data-ext="JSON" data-title="JSON"><pre class="language-JSON"><code>POST /_analyze
{
  &quot;analyzer&quot;: &quot;standard&quot;,
  &quot;text&quot;: &quot;黑马程序员学习java太棒了&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再测试IK分词器：</p><div class="language-JSON line-numbers-mode" data-ext="JSON" data-title="JSON"><pre class="language-JSON"><code>POST /_analyze
{
  &quot;analyzer&quot;: &quot;ik_smart&quot;,
  &quot;text&quot;: &quot;黑马程序员学习java太棒了&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3、拓展词典" tabindex="-1"><a class="header-anchor" href="#_3、拓展词典"><span>3、拓展词典</span></a></h3><p>随着互联网的发展，“造词运动”也越发的频繁。出现了很多新的词语，在原有的词汇列表中并不存在。比如：“泰裤辣”，“传智播客” 等。</p><p>IK分词器无法对这些词汇分词，测试一下：</p><div class="language-JSON line-numbers-mode" data-ext="JSON" data-title="JSON"><pre class="language-JSON"><code>POST /_analyze
{
  &quot;analyzer&quot;: &quot;ik_max_word&quot;,
  &quot;text&quot;: &quot;传智播客开设大学,真的泰裤辣！&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以要想正确分词，IK分词器的词库也需要不断的更新，IK分词器提供了扩展词汇的功能。</p><p>1）打开IK分词器config目录</p><figure><img src="`+h+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>注意，如果采用在线安装的通过，默认是没有config目录的</li></ul><p>2）在IKAnalyzer.cfg.xml配置文件内容添加：</p><div class="language-XML line-numbers-mode" data-ext="XML" data-title="XML"><pre class="language-XML"><code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;!DOCTYPE properties SYSTEM &quot;http://java.sun.com/dtd/properties.dtd&quot;&gt;
&lt;properties&gt;
        &lt;comment&gt;IK Analyzer 扩展配置&lt;/comment&gt;
        &lt;!--用户可以在这里配置自己的扩展字典 *** 添加扩展词典--&gt;
        &lt;entry key=&quot;ext_dict&quot;&gt;ext.dic&lt;/entry&gt;
&lt;/properties&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3）在IK分词器的config目录新建一个 <code>ext.dic</code>，可以参考config目录下复制一个配置文件进行修改</p><div class="language-Plain line-numbers-mode" data-ext="Plain" data-title="Plain"><pre class="language-Plain"><code>传智播客
泰裤辣
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>4）重启elasticsearch</p><div class="language-Shell line-numbers-mode" data-ext="Shell" data-title="Shell"><pre class="language-Shell"><code>docker restart es

# 查看 日志
docker logs -f elasticsearch
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再次测试，可以发现<code>传智播客</code>和<code>泰裤辣</code>都正确分词了。</p><h3 id="_4、总结" tabindex="-1"><a class="header-anchor" href="#_4、总结"><span>4、总结</span></a></h3><p>分词器的作用是什么？</p><ul><li>创建倒排索引时，对文档分词</li><li>用户搜索时，对输入的内容分词</li></ul><p>IK分词器有几种模式？</p><ul><li><code>ik_smart</code>：智能切分，粗粒度</li><li><code>ik_max_word</code>：最细切分，细粒度</li></ul><p>IK分词器如何拓展词条？如何停用词条？</p><ul><li>利用config目录的<code>IkAnalyzer.cfg.xml</code>文件添加拓展词典和停用词典</li><li>在词典中添加拓展词条或者停用词条</li></ul>`,116);function v(b,f){return a(),t("div",null,[i("more-"),m])}const _=e(u,[["render",v],["__file","2_es基础.html.vue"]]),S=JSON.parse('{"path":"/posts/%E5%90%8E%E7%AB%AF/elasticSearch/2_es%E5%9F%BA%E7%A1%80.html","title":"ElasticSearch基础","lang":"zh-CN","frontmatter":{"title":"ElasticSearch基础","date":"2024-07-01T00:00:00.000Z","tags":"ElasticSearch","category":"ElasticSearch","order":2,"description":"ElasticSearch基础 一、安装 1、安装ElasticSearch 通过下面的Docker命令即可安装单机版本的elasticsearch： 注意，这里我们采用的是elasticsearch的7.12.1版本，8以上版本的JavaAPI变化很大，在企业中应用并不广泛。 安装完成后，访问9200端口，即可看到响应的Elasticsearch服务...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/%E5%90%8E%E7%AB%AF/elasticSearch/2_es%E5%9F%BA%E7%A1%80.html"}],["meta",{"property":"og:site_name","content":"Lance"}],["meta",{"property":"og:title","content":"ElasticSearch基础"}],["meta",{"property":"og:description","content":"ElasticSearch基础 一、安装 1、安装ElasticSearch 通过下面的Docker命令即可安装单机版本的elasticsearch： 注意，这里我们采用的是elasticsearch的7.12.1版本，8以上版本的JavaAPI变化很大，在企业中应用并不广泛。 安装完成后，访问9200端口，即可看到响应的Elasticsearch服务..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://mister-hope.github.io/image/es/es2.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-07-01T12:23:09.000Z"}],["meta",{"property":"article:author","content":"RuyiWei"}],["meta",{"property":"article:published_time","content":"2024-07-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-07-01T12:23:09.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ElasticSearch基础\\",\\"image\\":[\\"https://mister-hope.github.io/image/es/es2.png\\",\\"https://mister-hope.github.io/image/es/es3.jpeg\\",\\"https://mister-hope.github.io/image/es/es4.jpeg\\",\\"https://mister-hope.github.io/image/es/es5.png\\",\\"https://mister-hope.github.io/image/es/es6.png\\",\\"https://mister-hope.github.io/image/es/es7.png\\",\\"https://mister-hope.github.io/image/es/es8.png\\",\\"https://mister-hope.github.io/image/es/es9.png\\",\\"https://mister-hope.github.io/image/es/es10.png\\"],\\"datePublished\\":\\"2024-07-01T00:00:00.000Z\\",\\"dateModified\\":\\"2024-07-01T12:23:09.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"RuyiWei\\"}]}"]]},"headers":[{"level":2,"title":"一、安装","slug":"一、安装","link":"#一、安装","children":[{"level":3,"title":"1、安装ElasticSearch","slug":"_1、安装elasticsearch","link":"#_1、安装elasticsearch","children":[]},{"level":3,"title":"2、安装Kibana","slug":"_2、安装kibana","link":"#_2、安装kibana","children":[]}]},{"level":2,"title":"二、倒排索引","slug":"二、倒排索引","link":"#二、倒排索引","children":[{"level":3,"title":"1、正向索引","slug":"_1、正向索引","link":"#_1、正向索引","children":[]},{"level":3,"title":"2、倒排索引","slug":"_2、倒排索引","link":"#_2、倒排索引","children":[]},{"level":3,"title":"3、正向和倒排","slug":"_3、正向和倒排","link":"#_3、正向和倒排","children":[]}]},{"level":2,"title":"三、基础概念","slug":"三、基础概念","link":"#三、基础概念","children":[{"level":3,"title":"1、文档和字段","slug":"_1、文档和字段","link":"#_1、文档和字段","children":[]},{"level":3,"title":"2、索引和映射","slug":"_2、索引和映射","link":"#_2、索引和映射","children":[]},{"level":3,"title":"3、mysql与elasticsearch","slug":"_3、mysql与elasticsearch","link":"#_3、mysql与elasticsearch","children":[]}]},{"level":2,"title":"四、IK分词器","slug":"四、ik分词器","link":"#四、ik分词器","children":[{"level":3,"title":"1、安装IK分词器","slug":"_1、安装ik分词器","link":"#_1、安装ik分词器","children":[]},{"level":3,"title":"2、使用IK分词器","slug":"_2、使用ik分词器","link":"#_2、使用ik分词器","children":[]},{"level":3,"title":"3、拓展词典","slug":"_3、拓展词典","link":"#_3、拓展词典","children":[]},{"level":3,"title":"4、总结","slug":"_4、总结","link":"#_4、总结","children":[]}]}],"git":{"createdTime":1719836589000,"updatedTime":1719836589000,"contributors":[{"name":"weiruyi","email":"1581778251@qq.com","commits":1}]},"readingTime":{"minutes":9.46,"words":2838},"filePathRelative":"posts/后端/elasticSearch/2_es基础.md","localizedDate":"2024年7月1日","excerpt":"<!--more--->\\n<h1>ElasticSearch基础</h1>\\n<h2>一、安装</h2>\\n<h3>1、安装ElasticSearch</h3>\\n<p>通过下面的Docker命令即可安装单机版本的elasticsearch：</p>\\n<div class=\\"language-Bash\\" data-ext=\\"Bash\\" data-title=\\"Bash\\"><pre class=\\"language-Bash\\"><code>docker run -d \\\\\\n  --name es \\\\\\n  -e \\"ES_JAVA_OPTS=-Xms512m -Xmx512m\\" \\\\\\n  -e \\"discovery.type=single-node\\" \\\\\\n  -v es-data:/usr/share/elasticsearch/data \\\\\\n  -v es-plugins:/usr/share/elasticsearch/plugins \\\\\\n  --privileged \\\\\\n  --network hm-net \\\\\\n  -p 9200:9200 \\\\\\n  -p 9300:9300 \\\\\\n  elasticsearch:7.12.1\\n</code></pre></div>","autoDesc":true}');export{_ as comp,S as data};
