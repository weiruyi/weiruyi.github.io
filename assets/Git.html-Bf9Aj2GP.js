import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,a as n,b as s,o as i}from"./app-CsHbmAuz.js";const t={},l=s(`<h1 id="git" tabindex="-1"><a class="header-anchor" href="#git"><span>Git</span></a></h1><h1 id="_1、全局配置" tabindex="-1"><a class="header-anchor" href="#_1、全局配置"><span>1、全局配置</span></a></h1><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&quot;******&quot;</span>  //用户名
	//git config <span class="token parameter variable">--global</span> user.name  查看用户名
<span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;1*******@qq.com&quot;</span>  // 邮箱
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_2、创建仓库" tabindex="-1"><a class="header-anchor" href="#_2、创建仓库"><span>2、创建仓库</span></a></h1><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>//1、Git仓库初始化（让Git知道，他需要来管理这个目录）
<span class="token function">git</span> init             // 创建 .git 隐藏目录


//2、Git常用指令操作
<span class="token function">git</span> status    //查看当前状态

<span class="token function">git</span> <span class="token function">add</span> 文件名  //添加到缓冲区，可以同时添加多个文件
	<span class="token function">git</span> <span class="token function">add</span> 文件名1 文件名2 文件名3 <span class="token punctuation">..</span>.
	<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span> //添加当前目录到缓存区
	
<span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;注释内容&quot;</span>   //提交至版本库

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_3、版本回退" tabindex="-1"><a class="header-anchor" href="#_3、版本回退"><span>3、版本回退</span></a></h1><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>//1、查看版本
<span class="token function">git</span> log
<span class="token function">git</span> log <span class="token parameter variable">--pretty</span><span class="token operator">=</span>oneline    //推荐

//2、回退操作
<span class="token function">git</span> reset <span class="token parameter variable">--hard</span> 提交编号
	<span class="token function">git</span> reset <span class="token parameter variable">--hard</span> dfec13ece6eb6ec47d422afac1d340df8dffba4b
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>注意</code>: 回到过去之后，要想再回到之前最新的版本的时候，则需要使用指令去查看历史操作,以得到最新的commit id。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> reflog
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>之后在使用<code>git reset --hard</code></p><blockquote><p>要想回到过去，必须先得到commit id，然后通过git reset --hard进行回退</p><p>要想回到未来，需要使用 git reflog进行历史操作查看，得到最新的commit id;</p><p>在写回退指令的时候commit id可以不用写全，git自动识别，但是也不能写太少，至少需要写前4位字符</p></blockquote><h1 id="_4、git远程仓库创建" tabindex="-1"><a class="header-anchor" href="#_4、git远程仓库创建"><span>4、Git远程仓库创建</span></a></h1><h2 id="_1-http" tabindex="-1"><a class="header-anchor" href="#_1-http"><span>1）HTTP</span></a></h2><p><code>a,</code>创建空目录，和github仓库名称一样</p><p><code>b,</code>使用clone指令克隆线上仓库到本地</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> clone 线上仓库地址
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>c,</code>在仓库上对应操作（提交暂存区、提交本地仓库、提交线上仓库、拉取线上仓库）</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>//1、提交暂存区、提交本地仓库

//2、提交线上仓库
<span class="token function">git</span> push

//首次提交
//修改 <span class="token string">&quot;.git/config&quot;</span> 文件
url <span class="token operator">=</span> https://用户名:密码@github.com/用户名/仓库名.git
账号密码特殊字符要进行编码:
<span class="token operator">!</span>    <span class="token comment">#    $     &amp;    &#39;    (    )    *    +    ,    /    :    ;    =    ?    @    [    ]</span>
%21  %23  %24   %26  %27  %28  %29  %2A  %2B  %2C  %2F  %3A  %3B  %3D  %3F  %40  %5B  %5D


//3、拉取线上仓库
<span class="token function">git</span> pull
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-ssh-推荐" tabindex="-1"><a class="header-anchor" href="#_2-ssh-推荐"><span>2)SSH（推荐）</span></a></h2><p>创建秘钥</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-C</span> <span class="token string">&quot;***@cherish.pw&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>复制<code>id_rsa.pub</code>内容，并在github添加SSH key</p><p>之后<code>git clone</code></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code> <span class="token function">git</span> clone git@github.com:weiruyi/shop.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>之后正常 提交暂存区、提交本地仓库、提交线上仓库、拉取线上仓库</p><h1 id="_5、分支管理" tabindex="-1"><a class="header-anchor" href="#_5、分支管理"><span>5、分支管理</span></a></h1><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>//分支相关指令:
<span class="token function">git</span> branch 		//查看分支
<span class="token function">git</span> branch 分支名  //创建分支
<span class="token function">git</span> checkout 分支名  //切换分支
<span class="token function">git</span> branch -d分支名  //删除分支   删除的时候一定要先退出当前分支
<span class="token function">git</span> merge 被合并的分支名  //合并分支
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于新分支,可以使用“<code>git checkout -b 分文名</code>”格令来切换分支，<code>-b</code>选项表示创建并切换,相当于是两个操作指令。</p><h1 id="_6、冲突的产生与解决" tabindex="-1"><a class="header-anchor" href="#_6、冲突的产生与解决"><span>6、冲突的产生与解决</span></a></h1><p>解决冲突：</p><p><strong>a</strong>,先<code>git pull</code></p><p>​ 将线上与本地仓库的冲突合并到对应文件中</p><p><strong>b</strong>,打开冲突文件，解决冲突</p><p>​ 和提交者商量，看代码如何保留，将改好的文件再次提交</p><p><strong>c</strong>,重新提交</p>`,35);function c(d,r){return i(),e("div",null,[n("more-"),l])}const u=a(t,[["render",c],["__file","Git.html.vue"]]),m=JSON.parse('{"path":"/posts/%E5%B7%A5%E5%85%B7/Git.html","title":"Git","lang":"zh-CN","frontmatter":{"title":"Git","date":"2024-05-22T16:32:00.000Z","tags":"code","category":"工具","description":"Git的使用指南","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/%E5%B7%A5%E5%85%B7/Git.html"}],["meta",{"property":"og:site_name","content":"Lance"}],["meta",{"property":"og:title","content":"Git"}],["meta",{"property":"og:description","content":"Git的使用指南"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-29T06:46:15.000Z"}],["meta",{"property":"article:author","content":"RuyiWei"}],["meta",{"property":"article:published_time","content":"2024-05-22T16:32:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-29T06:46:15.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Git\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-05-22T16:32:00.000Z\\",\\"dateModified\\":\\"2024-06-29T06:46:15.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"RuyiWei\\"}]}"]]},"headers":[{"level":2,"title":"1）HTTP","slug":"_1-http","link":"#_1-http","children":[]},{"level":2,"title":"2)SSH（推荐）","slug":"_2-ssh-推荐","link":"#_2-ssh-推荐","children":[]}],"git":{"createdTime":1719643575000,"updatedTime":1719643575000,"contributors":[{"name":"weiruyi","email":"1581778251@qq.com","commits":1}]},"readingTime":{"minutes":2.63,"words":789},"filePathRelative":"posts/工具/Git.md","localizedDate":"2024年5月22日","excerpt":"<!--more--->\\n<h1>Git</h1>\\n<h1>1、全局配置</h1>\\n<div class=\\"language-bash\\" data-ext=\\"sh\\" data-title=\\"sh\\"><pre class=\\"language-bash\\"><code><span class=\\"token function\\">git</span> config <span class=\\"token parameter variable\\">--global</span> user.name <span class=\\"token string\\">\\"******\\"</span>  //用户名\\n\\t//git config <span class=\\"token parameter variable\\">--global</span> user.name  查看用户名\\n<span class=\\"token function\\">git</span> config <span class=\\"token parameter variable\\">--global</span> user.email <span class=\\"token string\\">\\"1*******@qq.com\\"</span>  // 邮箱\\n</code></pre></div>"}');export{u as comp,m as data};
