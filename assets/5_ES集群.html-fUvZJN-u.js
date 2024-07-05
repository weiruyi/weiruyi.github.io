import{_ as r}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,c,e,d as s,w as n,f as t,a as d,b as i,o as p}from"./app-BZzuedh0.js";const u="/image/es/es20.png",m="/image/es/es21.png",h="/image/es/es22.png",v="/image/es/es23.png",g="/image/es/es24.png",b="/image/es/es25.png",_="/image/es/es26.png",k="/image/es/es27.png",f="/image/es/es28.png",y="/image/es/es29.png",x="/image/es/es30.png",E="/image/es/es31.png",S="/image/es/es32.png",q="/image/es/es33.png",z={},T=e("h1",{id:"es集群",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#es集群"},[e("span",null,"ES集群")])],-1),A=e("h2",{id:"一、介绍",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#一、介绍"},[e("span",null,"一、介绍")])],-1),N=e("p",null,"单机的elasticsearch做数据存储，必然面临两个问题：海量数据存储问题、单点故障问题。",-1),P=e("ul",null,[e("li",null,"海量数据存储问题：将索引库从逻辑上拆分为N个分片（shard），存储到多个节点"),e("li",null,"单点故障问题：将分片数据在不同节点备份（replica ）")],-1),w={class:"hint-container tip"},B=e("p",{class:"hint-container-title"},"ES集群相关概念:",-1),C=e("li",null,[e("p",null,"集群（cluster）：一组拥有共同的 cluster name 的 节点。")],-1),V=e("p",null,"解决问题：数据量太大，单点存储量有限的问题。",-1),X=e("img",{src:u,style:{zoom:"50%"}},null,-1),Z=i("<blockquote><p>此处，我们把数据分成3片：shard0、shard1、shard2</p></blockquote><ul><li><p>主分片（Primary shard）：相对于副本分片的定义。</p></li><li><p>副本分片（Replica shard）每个主分片可以有一个或者多个副本，数据和主分片一样。</p><p>​</p></li></ul><p>数据备份可以保证高可用，但是每个分片备份一份，所需要的节点数量就会翻一倍，成本实在是太高了！</p><p>为了在高可用和成本间寻求平衡，我们可以这样做：</p><ul><li>首先对数据分片，存储到不同节点</li><li>然后对每个分片进行备份，放到对方节点，完成互相备份</li></ul><p>这样可以大大减少所需要的服务节点数量，如图，我们以3分片，每个分片备份一份为例：</p>",6),j=e("img",{src:m,style:{zoom:"50%"}},null,-1),D=i(`<p>现在，每个分片都有1个备份，存储在3个节点：</p><ul><li>node0：保存了分片0和1</li><li>node1：保存了分片0和2</li><li>node2：保存了分片1和2</li></ul><h2 id="二、搭建es集群" tabindex="-1"><a class="header-anchor" href="#二、搭建es集群"><span>二、搭建ES集群</span></a></h2><p>我们会在单机上利用docker容器运行多个es实例来模拟es集群。不过生产环境推荐大家每一台服务节点仅部署一个es的实例。部署es集群可以直接使用docker-compose来完成，但这要求你的Linux虚拟机至少有<strong>4G</strong>的内存空间</p><h3 id="_1、创建es集群" tabindex="-1"><a class="header-anchor" href="#_1、创建es集群"><span>1、创建es集群</span></a></h3><p>首先编写一个docker-compose文件，内容如下：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>version: <span class="token string">&#39;2.2&#39;</span>
services:
  es01:
    image: elasticsearch:7.12.1
    container_name: es01
    environment:
      - <span class="token assign-left variable">node.name</span><span class="token operator">=</span>es01
      - <span class="token assign-left variable">cluster.name</span><span class="token operator">=</span>es-docker-cluster
      - <span class="token assign-left variable">discovery.seed_hosts</span><span class="token operator">=</span>es02,es03
      - <span class="token assign-left variable">cluster.initial_master_nodes</span><span class="token operator">=</span>es01,es02,es03
      - <span class="token string">&quot;ES_JAVA_OPTS=-Xms512m -Xmx512m&quot;</span>
    volumes:
      - data01:/usr/share/elasticsearch/data
    ports:
      - <span class="token number">9200</span>:9200
    networks:
      - elastic
  es02:
    image: elasticsearch:7.12.1
    container_name: es02
    environment:
      - <span class="token assign-left variable">node.name</span><span class="token operator">=</span>es02
      - <span class="token assign-left variable">cluster.name</span><span class="token operator">=</span>es-docker-cluster
      - <span class="token assign-left variable">discovery.seed_hosts</span><span class="token operator">=</span>es01,es03
      - <span class="token assign-left variable">cluster.initial_master_nodes</span><span class="token operator">=</span>es01,es02,es03
      - <span class="token string">&quot;ES_JAVA_OPTS=-Xms512m -Xmx512m&quot;</span>
    volumes:
      - data02:/usr/share/elasticsearch/data
    ports:
      - <span class="token number">9201</span>:9200
    networks:
      - elastic
  es03:
    image: elasticsearch:7.12.1
    container_name: es03
    environment:
      - <span class="token assign-left variable">node.name</span><span class="token operator">=</span>es03
      - <span class="token assign-left variable">cluster.name</span><span class="token operator">=</span>es-docker-cluster
      - <span class="token assign-left variable">discovery.seed_hosts</span><span class="token operator">=</span>es01,es02
      - <span class="token assign-left variable">cluster.initial_master_nodes</span><span class="token operator">=</span>es01,es02,es03
      - <span class="token string">&quot;ES_JAVA_OPTS=-Xms512m -Xmx512m&quot;</span>
    volumes:
      - data03:/usr/share/elasticsearch/data
    networks:
      - elastic
    ports:
      - <span class="token number">9202</span>:9200
volumes:
  data01:
    driver: <span class="token builtin class-name">local</span>
  data02:
    driver: <span class="token builtin class-name">local</span>
  data03:
    driver: <span class="token builtin class-name">local</span>

networks:
  elastic:
    driver: bridge
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>es运行需要修改一些linux系统权限，修改<code>/etc/sysctl.conf</code>文件</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">vi</span> /etc/sysctl.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>添加下面的内容：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token assign-left variable">vm.max_map_count</span><span class="token operator">=</span><span class="token number">262144</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后执行命令，让配置生效：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">sysctl</span> <span class="token parameter variable">-p</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>通过docker-compose启动集群：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2、集群状态监控" tabindex="-1"><a class="header-anchor" href="#_2、集群状态监控"><span>2、集群状态监控</span></a></h3><p>kibana可以监控es集群，不过新版本需要依赖es的x-pack 功能，配置比较复杂。</p><p>这里推荐使用cerebro来监控es集群状态，<a href="https://github.com/lmenezes/cerebro" target="_blank" rel="noopener noreferrer">官方网址</a></p><p>下载之后进入bin目录打开 <code>cerebro.bat</code>即可启动，之后通过访问<a href="http://localhost:9000" target="_blank" rel="noopener noreferrer">http://localhost:9000</a> 即可进入管理界面，输入你的elasticsearch的任意节点的地址和端口，点击connect即可</p><figure><img src="`+h+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>绿色的条，代表集群处于绿色（健康状态）。</p><h3 id="_3、创建索引库" tabindex="-1"><a class="header-anchor" href="#_3、创建索引库"><span>3、创建索引库</span></a></h3><h4 id="_1-利用kibana的devtools创建索引库" tabindex="-1"><a class="header-anchor" href="#_1-利用kibana的devtools创建索引库"><span>1）利用kibana的DevTools创建索引库</span></a></h4><p>在DevTools中输入指令：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code>PUT /itcast
<span class="token punctuation">{</span>
  <span class="token property">&quot;settings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;number_of_shards&quot;</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token comment">// 分片数量</span>
    <span class="token property">&quot;number_of_replicas&quot;</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token comment">// 副本数量</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;mappings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;properties&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// mapping映射定义 ...</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-利用cerebro创建索引库" tabindex="-1"><a class="header-anchor" href="#_2-利用cerebro创建索引库"><span>2）利用cerebro创建索引库</span></a></h4><p>利用cerebro还可以创建索引库：</p><figure><img src="`+v+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>填写索引库信息：</p><figure><img src="'+g+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>点击右下角的create按钮。</p><h2 id="三、集群脑裂问题" tabindex="-1"><a class="header-anchor" href="#三、集群脑裂问题"><span>三、集群脑裂问题</span></a></h2><h3 id="_1、集群职责划分" tabindex="-1"><a class="header-anchor" href="#_1、集群职责划分"><span>1、集群职责划分</span></a></h3><p>elasticsearch中集群节点有不同的职责划分：</p><figure><img src="'+b+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>默认情况下，集群中的任何一个节点都同时具备上述四种角色。</p><div class="hint-container warning"><p class="hint-container-title">但是真实的集群一定要将集群职责分离：</p><ul><li>master节点：对CPU要求高，但是内存要求第</li><li>data节点：对CPU和内存要求都高</li><li>coordinating节点：对网络带宽、CPU要求高</li></ul></div><p>职责分离可以让我们根据不同节点的需求分配不同的硬件去部署。而且避免业务之间的互相干扰。</p><p>一个典型的es集群职责划分如图：</p>',39),J=e("img",{src:_,style:{zoom:"50%"}},null,-1),O=e("h3",{id:"_4-2-2-脑裂问题",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_4-2-2-脑裂问题"},[e("span",null,"4.2.2.脑裂问题")])],-1),R=e("p",null,"脑裂是因为集群中的节点失联导致的。",-1),U=e("p",null,"例如一个集群中，主节点与其它节点失联：",-1),F=e("img",{src:k,style:{zoom:"50%"}},null,-1),L=i('<p>此时，node2和node3认为node1宕机，就会重新选主,当node3当选后，集群继续对外提供服务，node2和node3自成集群，node1自成集群，两个集群数据不同步，出现数据差异。当网络恢复后，因为集群中有两个master节点，集群状态的不一致，出现脑裂的情况：</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>解决脑裂的方案是，要求选票超过 ( eligible节点数量 + 1 ）/ 2 才能当选为主，因此eligible节点数量最好是奇数。对应配置项是<code>discovery.zen.minimum_master_nodes</code>，在es7.0以后，已经成为默认配置，因此一般不会发生脑裂问题</p></div><h2 id="四、集群分布式存储" tabindex="-1"><a class="header-anchor" href="#四、集群分布式存储"><span>四、集群分布式存储</span></a></h2><p>当新增文档时，应该保存到不同分片，保证数据均衡，那么coordinating node如何确定数据该存储到哪个分片呢？</p><h3 id="_1、分片存储原理" tabindex="-1"><a class="header-anchor" href="#_1、分片存储原理"><span>1、分片存储原理</span></a></h3><p>elasticsearch会通过hash算法来计算文档应该存储到哪个分片：</p><figure><img src="'+f+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="hint-container important"><p class="hint-container-title">说明：</p><ul><li>_routing默认是文档的id</li><li>算法与分片数量有关，因此索引库一旦创建，分片数量不能修改！</li></ul></div><p>新增文档的流程如下：</p>',9),W=e("img",{src:y,style:{zoom:"67%"}},null,-1),G=i('<div class="hint-container info"><p class="hint-container-title">解读：</p><ul><li>1）新增一个<code>id=1</code>的文档</li><li>2）对id做hash运算，假如得到的是2，则应该存储到shard-2</li><li>3）<code>shard-2</code>的主分片在node3节点，将数据路由到node3</li><li>4）保存文档</li><li>5）同步给<code>shard-2</code>的副本<code>replica-2</code>，在node2节点</li><li>6）返回结果给<code>coordinating-node</code>节点</li></ul></div><h3 id="_2、集群分布式查询" tabindex="-1"><a class="header-anchor" href="#_2、集群分布式查询"><span>2、集群分布式查询</span></a></h3><div class="hint-container important"><p class="hint-container-title">elasticsearch的查询分成两个阶段：</p><ul><li><p><code>scatter phase</code>：分散阶段，<code>coordinating node</code>会把请求分发到每一个分片</p></li><li><p><code>gather phase</code>：聚集阶段，<code>coordinating node</code>汇总<code>data node</code>的搜索结果，并处理为最终结果集返回给用户</p></li></ul></div>',3),M=e("img",{src:x,style:{zoom:"67%"}},null,-1),H=i('<h3 id="_3、集群故障转移" tabindex="-1"><a class="header-anchor" href="#_3、集群故障转移"><span>3、集群故障转移</span></a></h3><p>集群的master节点会监控集群中的节点状态，如果发现有节点宕机，会立即将宕机节点的分片数据迁移到其它节点，确保数据安全，这个叫做故障转移。</p><p>1）例如一个集群结构如图：</p><figure><img src="'+E+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>现在，node1是主节点，其它两个节点是从节点。</p><p>2）突然，node1发生了故障：宕机后的第一件事，需要重新选主，例如选中了node2：</p><figure><img src="'+S+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>node2成为主节点后，会检测集群监控状态，发现：shard-1、shard-0没有副本节点。因此需要将node1上的数据迁移到node2、node3：</p><figure><img src="'+q+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',9);function I(K,Q){const l=o("font"),a=o("center");return p(),c("div",null,[T,A,N,P,e("div",w,[B,e("ul",null,[C,e("li",null,[s(l,{color:"red"},{default:n(()=>[t("节点（node)")]),_:1}),t(" ：集群中的一个 Elasticearch 实例")]),e("li",null,[s(l,{color:"red"},{default:n(()=>[t("分片（shard）")]),_:1}),t("：索引可以被拆分为不同的部分进行存储，称为分片。在集群环境下，一个索引的不同分片可以拆分到不同的节点中"),V])])]),d(" more "),s(a,null,{default:n(()=>[X]),_:1}),Z,s(a,null,{default:n(()=>[j]),_:1}),D,s(a,null,{default:n(()=>[J]),_:1}),O,R,U,s(a,null,{default:n(()=>[F]),_:1}),L,s(a,null,{default:n(()=>[W]),_:1}),G,s(a,null,{default:n(()=>[M]),_:1}),H])}const ee=r(z,[["render",I],["__file","5_ES集群.html.vue"]]),se=JSON.parse('{"path":"/posts/%E5%90%8E%E7%AB%AF/elasticSearch/5_ES%E9%9B%86%E7%BE%A4.html","title":"ES集群","lang":"zh-CN","frontmatter":{"title":"ES集群","date":"2024-07-05T15:40:00.000Z","tags":"ElasticSearch","category":"ElasticSearch","order":5,"icon":"/img/es.svg","description":"一、介绍 单机的elasticsearch做数据存储，必然面临两个问题：海量数据存储问题、单点故障问题。 海量数据存储问题：将索引库从逻辑上拆分为N个分片（shard），存储到多个节点 单点故障问题：将分片数据在不同节点备份（replica ） ES集群相关概念: 集群（cluster）：一组拥有共同的 cluster name 的 节点。 ：集群中的...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/%E5%90%8E%E7%AB%AF/elasticSearch/5_ES%E9%9B%86%E7%BE%A4.html"}],["meta",{"property":"og:site_name","content":"Lance"}],["meta",{"property":"og:title","content":"ES集群"}],["meta",{"property":"og:description","content":"一、介绍 单机的elasticsearch做数据存储，必然面临两个问题：海量数据存储问题、单点故障问题。 海量数据存储问题：将索引库从逻辑上拆分为N个分片（shard），存储到多个节点 单点故障问题：将分片数据在不同节点备份（replica ） ES集群相关概念: 集群（cluster）：一组拥有共同的 cluster name 的 节点。 ：集群中的..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://mister-hope.github.io/image\\\\es\\\\es22.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-07-05T07:44:19.000Z"}],["meta",{"property":"article:author","content":"RuyiWei"}],["meta",{"property":"article:published_time","content":"2024-07-05T15:40:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-07-05T07:44:19.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ES集群\\",\\"image\\":[\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es22.png\\",\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es23.png\\",\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es24.png\\",\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es25.png\\",\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es28.png\\",\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es31.png\\",\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es32.png\\",\\"https://mister-hope.github.io/image\\\\\\\\es\\\\\\\\es33.png\\"],\\"datePublished\\":\\"2024-07-05T15:40:00.000Z\\",\\"dateModified\\":\\"2024-07-05T07:44:19.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"RuyiWei\\"}]}"]]},"headers":[{"level":2,"title":"一、介绍","slug":"一、介绍","link":"#一、介绍","children":[]},{"level":2,"title":"二、搭建ES集群","slug":"二、搭建es集群","link":"#二、搭建es集群","children":[{"level":3,"title":"1、创建es集群","slug":"_1、创建es集群","link":"#_1、创建es集群","children":[]},{"level":3,"title":"2、集群状态监控","slug":"_2、集群状态监控","link":"#_2、集群状态监控","children":[]},{"level":3,"title":"3、创建索引库","slug":"_3、创建索引库","link":"#_3、创建索引库","children":[]}]},{"level":2,"title":"三、集群脑裂问题","slug":"三、集群脑裂问题","link":"#三、集群脑裂问题","children":[{"level":3,"title":"1、集群职责划分","slug":"_1、集群职责划分","link":"#_1、集群职责划分","children":[]},{"level":3,"title":"4.2.2.脑裂问题","slug":"_4-2-2-脑裂问题","link":"#_4-2-2-脑裂问题","children":[]}]},{"level":2,"title":"四、集群分布式存储","slug":"四、集群分布式存储","link":"#四、集群分布式存储","children":[{"level":3,"title":"1、分片存储原理","slug":"_1、分片存储原理","link":"#_1、分片存储原理","children":[]},{"level":3,"title":"2、集群分布式查询","slug":"_2、集群分布式查询","link":"#_2、集群分布式查询","children":[]},{"level":3,"title":"3、集群故障转移","slug":"_3、集群故障转移","link":"#_3、集群故障转移","children":[]}]}],"git":{"createdTime":1720165459000,"updatedTime":1720165459000,"contributors":[{"name":"weiruyi","email":"1581778251@qq.com","commits":1}]},"readingTime":{"minutes":6.19,"words":1857},"filePathRelative":"posts/后端/elasticSearch/5_ES集群.md","localizedDate":"2024年7月5日","excerpt":"\\n<h2>一、介绍</h2>\\n<p>单机的elasticsearch做数据存储，必然面临两个问题：海量数据存储问题、单点故障问题。</p>\\n<ul>\\n<li>海量数据存储问题：将索引库从逻辑上拆分为N个分片（shard），存储到多个节点</li>\\n<li>单点故障问题：将分片数据在不同节点备份（replica ）</li>\\n</ul>\\n<div class=\\"hint-container tip\\">\\n<p class=\\"hint-container-title\\">ES集群相关概念:</p>\\n<ul>\\n<li>\\n<p>集群（cluster）：一组拥有共同的 cluster name 的 节点。</p>\\n</li>\\n<li>\\n   ：集群中的一个 Elasticearch 实例</li>\\n<li>\\n：索引可以被拆分为不同的部分进行存储，称为分片。在集群环境下，一个索引的不同分片可以拆分到不同的节点中<p>解决问题：数据量太大，单点存储量有限的问题。</p>\\n</li>\\n</ul>\\n</div>\\n","autoDesc":true}');export{ee as comp,se as data};
