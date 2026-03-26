import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as e,c as o,a as p,b as l,f as n,e as i,d as s,o as u}from"./app-DMnBbvpS.js";const c="/images/openclaw/logo.png",r={},d=n("h1",{id:"openclaw-完整配置指南-架构设计、多-agent-管理与安全防护",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#openclaw-完整配置指南-架构设计、多-agent-管理与安全防护"},[n("span",null,"OpenClaw 完整配置指南：架构设计、多 Agent 管理与安全防护")])],-1),v=n("div",{style:{display:"flex","align-items":"center","margin-bottom":"20px"}},[n("img",{src:c,alt:"OpenClaw Logo",style:{width:"50px",height:"50px","margin-right":"15px","border-radius":"50%"}}),n("strong",null,"OpenClaw"),i(" 作为一个新兴的多智能体 (Multi-Agent) 框架和平台，正在重新定义 AI Agent 的本地化部署与分布式协同体验。 ")],-1),k=s('<blockquote><p>这是一篇偏「架构与工程实践」的 OpenClaw 配置指南：从整体架构到多 Agent 管理，再到安全与审计配置，帮助你搭出一套既好用又安全的个人/团队 AI 助手系统。</p></blockquote><hr><h2 id="一、openclaw-概述与设计哲学" tabindex="-1"><a class="header-anchor" href="#一、openclaw-概述与设计哲学"><span>一、OpenClaw 概述与设计哲学</span></a></h2><h3 id="_1-1-项目背景" tabindex="-1"><a class="header-anchor" href="#_1-1-项目背景"><span>1.1 项目背景</span></a></h3><p>2026 年，各类 AI Agent 项目爆发，<strong>OpenClaw</strong>（前身 ClawdBot / Moltbot）很快成长为开源个人 AI 助手领域的代表项目之一（GitHub Star 已突破 17 万）。</p><p>它由 PSPDFKit 创始人 Peter Steinberger 发起，核心特点是：完全开源、高度可定制、专注本地与私有化使用场景。</p><p>OpenClaw 的设计坚持几条原则：</p><ol><li><strong>声明式优于命令式</strong>：尽量用配置文件描述系统行为，而不是到处写脚本。</li><li><strong>分层与模块化</strong>：Gateway / Agent / Channel / Skill / Memory 分层清晰，方便替换和扩展。</li><li><strong>用户可控</strong>：关键行为都有配置入口；默认安全，但不强行锁死。</li><li><strong>安全优先</strong>：从网络到执行环境都有防线，而不是上线前再补安全补丁。</li><li><strong>开放扩展</strong>：通过 Skills、工具和 Provider 机制扩展能力。</li></ol><h3 id="_1-2-核心架构组件" tabindex="-1"><a class="header-anchor" href="#_1-2-核心架构组件"><span>1.2 核心架构组件</span></a></h3><p>从架构视角看，OpenClaw 可以拆成几块核心组件：</p><ul><li><strong>Gateway（网关）</strong>：控制平面，统一管理连接和消息路由，对外提供 WebSocket / HTTP API。</li><li><strong>Agent（代理）</strong>：一个独立的 AI 实例，拥有自己的 System Prompt、工具集和记忆空间。</li><li><strong>Channel（通道）</strong>：与外部世界交互的入口，比如 WhatsApp、Telegram、Slack、Discord 等。</li><li><strong>Skill（技能）</strong>：可扩展功能模块，通过 <code>SKILL.md</code> 定义能力边界，可挂载到不同 Agent。</li><li><strong>Memory（记忆）</strong>：用来做持久化和检索，包括日志、精选记忆、向量检索等。</li></ul><h4 id="架构总览图-mermaid" tabindex="-1"><a class="header-anchor" href="#架构总览图-mermaid"><span>架构总览图（Mermaid）</span></a></h4>',12),q=s(`<h3 id="_1-3-配置文件体系总览" tabindex="-1"><a class="header-anchor" href="#_1-3-配置文件体系总览"><span>1.3 配置文件体系总览</span></a></h3><p>OpenClaw 把「行为」拆散到多个配置层次中，大致如下：</p><table><thead><tr><th>层级</th><th>位置</th><th>说明</th></tr></thead><tbody><tr><td>项目级配置</td><td>仓库根目录</td><td><code>.eslintrc</code>、<code>.prettierrc</code>、<code>tsconfig.json</code> 等</td></tr><tr><td>Gateway 核心</td><td><code>~/.openclaw/openclaw.json</code></td><td>运行时核心配置：模型、工具、Agent、安全策略</td></tr><tr><td>工作空间配置</td><td><code>~/.openclaw/workspace/</code></td><td>Agent 的本地文件系统与注入式配置文件</td></tr><tr><td>环境配置</td><td><code>~/.openclaw/.env</code></td><td>存放 API Key/Token 等敏感信息，不进仓库</td></tr><tr><td>注入式配置</td><td><code>AGENTS.md</code>、<code>SOUL.md</code> 等</td><td>会被直接注入 System Prompt，控制 Agent 行为</td></tr></tbody></table><hr><h2 id="二、核心配置模块详解" tabindex="-1"><a class="header-anchor" href="#二、核心配置模块详解"><span>二、核心配置模块详解</span></a></h2><h3 id="_2-1-身份配置文件" tabindex="-1"><a class="header-anchor" href="#_2-1-身份配置文件"><span>2.1 身份配置文件</span></a></h3><p>这些 Markdown 文件共同定义了「谁在说话、为谁服务、该怎么说」。</p><h4 id="agents-md-—-代理行为规范" tabindex="-1"><a class="header-anchor" href="#agents-md-—-代理行为规范"><span>AGENTS.md — 代理行为规范</span></a></h4><p>为 Agent 定义：</p><ul><li><strong>身份与角色</strong>：例如「资深全栈工程师」「数据分析助手」。</li><li><strong>行为准则</strong>：如何提问追问、如何分步执行、什么时候要确认。</li><li><strong>编码规范</strong>：语言、风格、测试要求、日志习惯等。</li><li><strong>安全边界</strong>：哪些操作永远不能做（删除文件、推代码到远端等）。</li></ul><h4 id="soul-md-—-价值观与个性" tabindex="-1"><a class="header-anchor" href="#soul-md-—-价值观与个性"><span>SOUL.md — 价值观与个性</span></a></h4><p>更偏人格化的一层：</p><ul><li><strong>核心价值观</strong>：如诚实、透明、谨慎、不编造数据。</li><li><strong>沟通风格</strong>：正式/口语、简洁/详细、是否主动给建议。</li><li><strong>决策原则</strong>：遇到模糊需求如何处理，是偏保守还是偏探索。</li><li><strong>边界意识</strong>：避免过度拟人、避免情绪化表达等。</li></ul><h4 id="identity-md-—-身份档案" tabindex="-1"><a class="header-anchor" href="#identity-md-—-身份档案"><span>IDENTITY.md — 身份档案</span></a></h4><p>用于描述 Agent 的「人设档案」：</p><ul><li>基本信息：名称、版本、创建时间。</li><li>形象描述：头像、外观、多模态描述。</li><li>声音特征：如接入 TTS 时的声线偏好。</li><li>签名语与问候语：统一开场与收尾语气。</li></ul><h4 id="user-md-—-用户画像" tabindex="-1"><a class="header-anchor" href="#user-md-—-用户画像"><span>USER.md — 用户画像</span></a></h4><p>告诉 Agent「你是谁、你的偏好是什么」：</p><ul><li>基本信息：名称、联系方式、时区。</li><li>技术背景：主要语言、使用框架、熟悉程度。</li><li>交互偏好：更爱要代码还是解释，更偏向中文还是英文。</li><li>隐私设置：哪些内容可以长久记录，哪些需要即时忘记。</li></ul><hr><h3 id="_2-2-system-prompt-构建机制" tabindex="-1"><a class="header-anchor" href="#_2-2-system-prompt-构建机制"><span>2.2 System Prompt 构建机制</span></a></h3><p>OpenClaw 的 System Prompt 不是一坨长文，而是由多个模块拼起来的：</p><ul><li><strong>Tooling</strong>：可用工具列表与使用规范。</li><li><strong>Safety</strong>：安全相关条款，包含禁止行为和敏感操作策略。</li><li><strong>Skills</strong>：挂载的 Skills 列表和调用方式说明。</li><li><strong>Self-Update / Workspace / Documentation</strong>：如何利用项目文档、自我改进等。</li><li><strong>Sandbox / Runtime / Date &amp; Time / Reasoning</strong>：当前时间、运行环境、推理风格等信息。</li></ul><p>根据不同场景，还可以选择不同 Prompt 模式：</p><ul><li><strong>full</strong>：主 Agent 使用，信息最全，适合长对话和复杂任务。</li><li><strong>minimal</strong>：子 Agent 或工具型 Agent 使用，只保留必要指令，节省 token。</li><li><strong>none</strong>：只保留基础身份，用于测试或极简场景。</li></ul><hr><h3 id="_2-3-工具系统配置" tabindex="-1"><a class="header-anchor" href="#_2-3-工具系统配置"><span>2.3 工具系统配置</span></a></h3><p>在 <code>openclaw.json</code> 中的 <code>tools</code> 字段集中管理工具权限，例如：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;tools&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;allow&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;deny&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;browser&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;profile&quot;</span><span class="token operator">:</span> <span class="token string">&quot;coding&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;byProvider&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;google-antigravity&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;profile&quot;</span><span class="token operator">:</span> <span class="token string">&quot;minimal&quot;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>几个关键点：</p><ul><li><strong>Profile 预设</strong>： <ul><li><code>minimal</code>：最小权限。</li><li><code>coding</code>：包含文件系统、运行时、会话、记忆、图像等常用开发工具。</li><li><code>messaging</code>：面向聊天与通知。</li><li><code>full</code>：基本不做限制，仅适合严格受控环境。</li></ul></li><li><strong>按组配置</strong>：支持 <code>group:fs</code>、<code>group:runtime</code>、<code>group:sessions</code>、<code>group:memory</code>、<code>group:messaging</code> 等逻辑分组，简化管理。</li><li><strong>按 Provider 覆盖</strong>：可以为不同模型提供方指定不同 Profile，例如云模型收紧权限、本地模型放宽权限。</li></ul><hr><h3 id="_2-4-技能-skills-系统配置" tabindex="-1"><a class="header-anchor" href="#_2-4-技能-skills-系统配置"><span>2.4 技能（Skills）系统配置</span></a></h3><p>技能是一种「带说明书的能力包」，以目录形式存在：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>skills/my-skill/
├── SKILL.md      # 必需：技能说明与边界
├── index.js      # 可选：技能入口代码
└── utils/        # 可选：辅助文件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>SKILL.md</code> 通常包含：</p><ul><li>技能名称与功能概述。</li><li>适用场景与限制条件。</li><li>调用方式、参数说明与返回格式。</li><li>一两个典型使用示例。</li></ul><p>OpenClaw 还提供了 <strong>ClawHub 注册中心</strong>，用于分发与管理技能：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;clawhub&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;registry&quot;</span><span class="token operator">:</span> <span class="token string">&quot;https://clawhub.openclaw.ai&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="_2-5-记忆系统配置" tabindex="-1"><a class="header-anchor" href="#_2-5-记忆系统配置"><span>2.5 记忆系统配置</span></a></h3><p>记忆系统大致分三层：</p><ul><li><strong>短期记忆</strong>：对话上下文，由 LLM 上下文窗口承担。</li><li><strong>长期记忆</strong>： <ul><li>按天日志文件：<code>memory/YYYY-MM-DD.md</code>。</li><li>精选记忆文件：<code>MEMORY.md</code>。</li></ul></li><li><strong>向量记忆</strong>：通过向量模型做语义检索。</li></ul><p>配置示例：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;memory&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;backend&quot;</span><span class="token operator">:</span> <span class="token string">&quot;memory-core&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;embedding&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;provider&quot;</span><span class="token operator">:</span> <span class="token string">&quot;local&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;model&quot;</span><span class="token operator">:</span> <span class="token string">&quot;all-MiniLM-L6-v2&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样既可以用本地嵌入模型，避免敏感数据离开本机，又保留了替换后端的空间。</p><hr><h3 id="_2-6-gateway-配置" tabindex="-1"><a class="header-anchor" href="#_2-6-gateway-配置"><span>2.6 Gateway 配置</span></a></h3><p>Gateway 是系统的中心节点，典型配置如下：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;gateway&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;host&quot;</span><span class="token operator">:</span> <span class="token string">&quot;127.0.0.1&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;port&quot;</span><span class="token operator">:</span> <span class="token number">18789</span><span class="token punctuation">,</span>
    <span class="token property">&quot;canvasHost&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token property">&quot;port&quot;</span><span class="token operator">:</span> <span class="token number">18793</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;reload&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">&quot;mode&quot;</span><span class="token operator">:</span> <span class="token string">&quot;hybrid&quot;</span> <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中：</p><ul><li><code>host</code> 建议默认绑定本地回环地址，避免直接暴露到公网。</li><li><code>reload.mode</code> 支持： <ul><li><code>hybrid</code>：尽量热应用配置变更，必要时重启。</li><li><code>off</code>：禁用热重载。</li><li><code>restart</code>：有变更就重启，行为更简单但打断更频繁。</li></ul></li></ul><hr><h2 id="三、多-agent-架构与管理" tabindex="-1"><a class="header-anchor" href="#三、多-agent-架构与管理"><span>三、多 Agent 架构与管理</span></a></h2><h3 id="_3-1-多-agent-设计思想" tabindex="-1"><a class="header-anchor" href="#_3-1-多-agent-设计思想"><span>3.1 多 Agent 设计思想</span></a></h3><p>OpenClaw 使用扁平路由模型，由 Gateway 统一处理消息，然后根据配置把消息路由到不同 Agent：</p><ul><li>避免 agent 嵌套调用导致的上下文污染和角色混乱。</li><li>通过配置实现「不同平台 / 不同用途 / 不同安全级别」的 Agent 分工。</li></ul><p>在资源层面，多 Agent 之间尽量做隔离：</p><table><thead><tr><th>资源</th><th>是否共享</th><th>说明</th></tr></thead><tbody><tr><td>工作空间</td><td>否</td><td>各有独立目录</td></tr><tr><td>记忆文件</td><td>否</td><td>独立的 <code>MEMORY.md</code> 和日志</td></tr><tr><td>会话历史</td><td>否</td><td>对话完全隔离</td></tr><tr><td>认证凭证</td><td>否</td><td>独立 <code>auth-profiles.json</code></td></tr><tr><td>技能配置</td><td>可选</td><td>可通过白名单共享</td></tr><tr><td>AI 模型</td><td>可选</td><td>可按 Agent 指定不同 Provider/模型</td></tr></tbody></table><h3 id="_3-2-agent-配置与角色定义" tabindex="-1"><a class="header-anchor" href="#_3-2-agent-配置与角色定义"><span>3.2 Agent 配置与角色定义</span></a></h3><p>创建 Agent 通常通过命令行完成，例如：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>openclaw agents <span class="token function">add</span> coding
openclaw agents <span class="token function">add</span> social
openclaw agents <span class="token function">add</span> work
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在 <code>openclaw.json</code> 中进行细化配置：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;agents&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;defaults&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;model&quot;</span><span class="token operator">:</span> <span class="token string">&quot;anthropic:claude-opus-4-6&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;maxTokens&quot;</span><span class="token operator">:</span> <span class="token number">8192</span><span class="token punctuation">,</span>
      <span class="token property">&quot;temperature&quot;</span><span class="token operator">:</span> <span class="token number">0.7</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;list&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;agentId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;main&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;workspace&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/.openclaw/workspace&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;model&quot;</span><span class="token operator">:</span> <span class="token string">&quot;anthropic:claude-opus-4-6&quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;agentId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;coding&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;workspace&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/.openclaw/workspace-coding&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;temperature&quot;</span><span class="token operator">:</span> <span class="token number">0.3</span><span class="token punctuation">,</span>
        <span class="token property">&quot;skills&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;coding-agent&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;github&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;gh-issues&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;tmux&quot;</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token property">&quot;bindings&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token property">&quot;channel&quot;</span><span class="token operator">:</span> <span class="token string">&quot;discord&quot;</span><span class="token punctuation">,</span>
            <span class="token property">&quot;guildId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;123456789&quot;</span><span class="token punctuation">,</span>
            <span class="token property">&quot;channelId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;987654321&quot;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;agentId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;social&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;workspace&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/.openclaw/workspace-social&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;model&quot;</span><span class="token operator">:</span> <span class="token string">&quot;openai:gpt-5.2-mini&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;temperature&quot;</span><span class="token operator">:</span> <span class="token number">0.9</span><span class="token punctuation">,</span>
        <span class="token property">&quot;skills&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;summarize&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;weather&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;goplaces&quot;</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token property">&quot;bindings&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token property">&quot;channel&quot;</span><span class="token operator">:</span> <span class="token string">&quot;telegram&quot;</span><span class="token punctuation">,</span>
            <span class="token property">&quot;chatId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;-100123456789&quot;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个 Agent 的工作空间里通常都会有独立的 <code>SOUL.md</code> 等文件，确保人格和记忆互不干扰。</p><h3 id="_3-3-消息路由与绑定" tabindex="-1"><a class="header-anchor" href="#_3-3-消息路由与绑定"><span>3.3 消息路由与绑定</span></a></h3><p>路由规则通常是：</p><ol><li>优先匹配 <code>bindings</code> 中明确指定的 Channel / 群组 / 频道。</li><li>没有匹配时，私聊默认交给 <code>main</code> Agent。</li><li>其他情况回退到 <code>main</code> 或你设定的默认 Agent。</li></ol><p>支持绑定的渠道包括 Discord、Telegram、Slack、WhatsApp 等，具体参数因平台而异，但模式类似。</p><p>查看当前 Agent 状态：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>openclaw agents list
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_3-4-agent-间通信机制" tabindex="-1"><a class="header-anchor" href="#_3-4-agent-间通信机制"><span>3.4 Agent 间通信机制</span></a></h3><p>OpenClaw 提供了基于 Sessions 的直接通信工具：</p><ul><li><code>sessions_list</code>：列出活跃会话。</li><li><code>sessions_history</code>：查看会话历史。</li><li><code>sessions_send</code>：向其他会话发送消息。</li><li><code>sessions_spawn</code>：创建新会话。</li></ul><p>也可以通过更松散的方式协作：</p><ul><li>共享文件：一个 Agent 写入文件，另一个定期读取处理。</li><li>用户中转：由人类选择何时把某个对话/结果转交给另一个 Agent。</li><li>定时任务：通过 Cron 或调度系统把多个 Agent 串成流水线。</li><li>Webhook：由外部系统触发指定 Agent 任务。</li></ul><h3 id="_3-5-任务协作策略" tabindex="-1"><a class="header-anchor" href="#_3-5-任务协作策略"><span>3.5 任务协作策略</span></a></h3><p>常见的多 Agent 协作方式包括：</p><ol><li><strong>按职能分工</strong>：如「写代码」「审查代码」「部署运维」三个 Agent。</li><li><strong>按平台分工</strong>：不同 Agent 负责 Telegram、Slack、邮箱等不同入口。</li><li><strong>按安全等级分工</strong>：有的 Agent 只能读文件，有的可以改配置。</li><li><strong>流水线式协作</strong>：一个 Agent 生成草稿，另一个 Agent 审阅和优化。</li></ol><h3 id="_3-6-实战案例" tabindex="-1"><a class="header-anchor" href="#_3-6-实战案例"><span>3.6 实战案例</span></a></h3><ul><li><p><strong>客服 + 技术支持双 Agent</strong>：</p><ul><li>Community Agent：负责社区闲聊、一般问题，使用轻量模型。</li><li>Tech Support Agent：处理技术问题，使用更强模型和更多工具。</li><li>私聊默认由 main Agent 兜底。</li></ul></li><li><p><strong>内容创作流水线</strong>：</p><ul><li>Translator Agent：负责翻译与多语言转换。</li><li>Writer Agent：负责改写与润色。</li><li>Reviewer Agent：负责事实核查和风格统一。</li><li>通过定时任务或共享文件进行串联。</li></ul></li></ul><hr><h2 id="四、安全配置与防护" tabindex="-1"><a class="header-anchor" href="#四、安全配置与防护"><span>四、安全配置与防护</span></a></h2><h3 id="_4-1-安全架构概述" tabindex="-1"><a class="header-anchor" href="#_4-1-安全架构概述"><span>4.1 安全架构概述</span></a></h3><p>OpenClaw 的安全设计是典型的<strong>纵深防御 + 零信任</strong>，可以概括为五层：</p><ol><li><strong>网络边界</strong>：TLS、防火墙、IP 白名单、限流。</li><li><strong>认证与授权</strong>：Gateway Token、配对系统、角色权限。</li><li><strong>输入验证</strong>：Prompt 护栏、长度限制、非法指令过滤。</li><li><strong>执行隔离</strong>：Docker 沙箱、最小权限运行。</li><li><strong>审计与监控</strong>：日志与告警。</li></ol><h3 id="_4-2-api-key-安全管理" tabindex="-1"><a class="header-anchor" href="#_4-2-api-key-安全管理"><span>4.2 API Key 安全管理</span></a></h3><p>API Key 绝不要硬编码在代码或仓库里，推荐用系统环境变量或 <code>.env</code> 文件：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 系统环境变量</span>
<span class="token builtin class-name">echo</span> <span class="token string">&#39;export OPENAI_API_KEY=&quot;sk-xxxx&quot;&#39;</span> <span class="token operator">&gt;&gt;</span> ~/.bashrc
<span class="token builtin class-name">source</span> ~/.bashrc

<span class="token comment"># 独立 .env 文件</span>
<span class="token function">cat</span> <span class="token operator">&gt;</span> ~/.openclaw/.env <span class="token operator">&lt;&lt;</span> <span class="token string">&#39;EOF&#39;
OPENAI_API_KEY=sk-xxxx
ANTHROPIC_API_KEY=ant-xxxx
EOF</span>

<span class="token function">chmod</span> <span class="token number">600</span> ~/.openclaw/.env
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>建议定期轮换密钥（例如每 90 天一次），一旦怀疑泄露立即更换。</p><h3 id="_4-3-沙箱系统配置" tabindex="-1"><a class="header-anchor" href="#_4-3-沙箱系统配置"><span>4.3 沙箱系统配置</span></a></h3><p>沙箱用于约束高风险操作（命令执行、文件系统访问等），典型配置如下：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;agents&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;defaults&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;sandbox&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;mode&quot;</span><span class="token operator">:</span> <span class="token string">&quot;non-main&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;toolAllowlist&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;bash&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;process&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;read&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;write&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;edit&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;sessions_*&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;toolDenylist&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;browser&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;canvas&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;nodes&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;cron&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;discord&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;gateway&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;securityOpt&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;no-new-privileges:true&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;capDrop&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;ALL&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;readOnlyRootfs&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token property">&quot;tmpfsSize&quot;</span><span class="token operator">:</span> <span class="token string">&quot;64m&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;noSetuid&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>沙箱模式：</p><ul><li><code>non-main</code>：非主会话一律进沙箱（推荐默认）。</li><li><code>always</code>：所有任务都在沙箱里跑。</li><li><code>never</code>：完全关闭沙箱，仅适合调试。</li></ul><h3 id="_4-4-权限控制" tabindex="-1"><a class="header-anchor" href="#_4-4-权限控制"><span>4.4 权限控制</span></a></h3><h4 id="gateway-认证" tabindex="-1"><a class="header-anchor" href="#gateway-认证"><span>Gateway 认证</span></a></h4><p>Gateway 应启用 Token 认证，生成方式示例：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>openssl rand <span class="token parameter variable">-hex</span> <span class="token number">32</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">OPENCLAW_GATEWAY_TOKEN</span><span class="token operator">=</span><span class="token string">&quot;随机Token&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="dm-pairing-配对系统" tabindex="-1"><a class="header-anchor" href="#dm-pairing-配对系统"><span>DM Pairing 配对系统</span></a></h4><p>为了阻止陌生账户直接与 Agent 通信，可以启用配对模式：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;channels&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;dmPolicy&quot;</span><span class="token operator">:</span> <span class="token string">&quot;pairing&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>常用命令：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>openclaw pairing approve <span class="token operator">&lt;</span>channel<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>code<span class="token operator">&gt;</span>
openclaw pairing list
openclaw pairing revoke <span class="token operator">&lt;</span>contact<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="用户权限分级" tabindex="-1"><a class="header-anchor" href="#用户权限分级"><span>用户权限分级</span></a></h4><p>可以为不同用户分配不同角色，限制可用工具与 Agent：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;roles&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;admin&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;tools&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;agents&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;maxTokensPerDay&quot;</span><span class="token operator">:</span> <span class="token number">-1</span><span class="token punctuation">,</span>
        <span class="token property">&quot;canModifyConfig&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;user&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;tools&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;search&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;calendar&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;agents&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;assistant&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;researcher&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;maxTokensPerDay&quot;</span><span class="token operator">:</span> <span class="token number">100000</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;guest&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;tools&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;search&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;weather&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;agents&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;assistant&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;maxTokensPerDay&quot;</span><span class="token operator">:</span> <span class="token number">10000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;userRoles&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;my-telegram-id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;admin&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;default&quot;</span><span class="token operator">:</span> <span class="token string">&quot;guest&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="文件访问权限" tabindex="-1"><a class="header-anchor" href="#文件访问权限"><span>文件访问权限</span></a></h4><p>文件系统访问同样建议默认拒绝，再逐条放开：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;filesystem&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;defaultPolicy&quot;</span><span class="token operator">:</span> <span class="token string">&quot;deny&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;rules&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/.openclaw/workspace&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;read&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;write&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;create&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;delete&quot;</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/Documents&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;read&quot;</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/.openclaw/openclaw.json&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/.ssh&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;permissions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-网络安全" tabindex="-1"><a class="header-anchor" href="#_4-5-网络安全"><span>4.5 网络安全</span></a></h3><h4 id="tls-1-3-强制启用" tabindex="-1"><a class="header-anchor" href="#tls-1-3-强制启用"><span>TLS 1.3 强制启用</span></a></h4><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;gateway&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;tls&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">&quot;minVersion&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1.3&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;certFile&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/path/to/cert.pem&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;keyFile&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/path/to/key.pem&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="远程访问建议" tabindex="-1"><a class="header-anchor" href="#远程访问建议"><span>远程访问建议</span></a></h4><ul><li>使用 SSH 隧道暴露本地端口。</li><li>使用 Tailscale / WireGuard 搭建内网访问。</li><li>避免直接把 Gateway 端口暴露到公网。</li></ul><h4 id="ip-白名单与限流" tabindex="-1"><a class="header-anchor" href="#ip-白名单与限流"><span>IP 白名单与限流</span></a></h4><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;gateway&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;security&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;ipWhitelist&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token property">&quot;allowedIPs&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;127.0.0.1&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;192.168.1.0/24&quot;</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;rateLimiting&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token property">&quot;maxRequestsPerMinute&quot;</span><span class="token operator">:</span> <span class="token number">60</span><span class="token punctuation">,</span>
        <span class="token property">&quot;maxRequestsPerHour&quot;</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
        <span class="token property">&quot;burstSize&quot;</span><span class="token operator">:</span> <span class="token number">10</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-6-数据隐私保护" tabindex="-1"><a class="header-anchor" href="#_4-6-数据隐私保护"><span>4.6 数据隐私保护</span></a></h3><h4 id="静态数据加密" tabindex="-1"><a class="header-anchor" href="#静态数据加密"><span>静态数据加密</span></a></h4><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;storage&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;encryption&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">&quot;algorithm&quot;</span><span class="token operator">:</span> <span class="token string">&quot;aes-256-gcm&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;keyDerivation&quot;</span><span class="token operator">:</span> <span class="token string">&quot;argon2id&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="本地模型方案" tabindex="-1"><a class="header-anchor" href="#本地模型方案"><span>本地模型方案</span></a></h4><p>通过本地模型 Provider 可以在完全离线的环境下使用 OpenClaw：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;providers&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;ollama&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;ollama&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;baseUrl&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://127.0.0.1:11434&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;models&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;llama3.1&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;qwen2.5&quot;</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;agents&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;defaults&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;provider&quot;</span><span class="token operator">:</span> <span class="token string">&quot;ollama&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;model&quot;</span><span class="token operator">:</span> <span class="token string">&quot;llama3.1&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-7-日志审计" tabindex="-1"><a class="header-anchor" href="#_4-7-日志审计"><span>4.7 日志审计</span></a></h3><p>审计日志用于追踪敏感行为与异常事件，配置示例如下：</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;logging&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;audit&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">&quot;level&quot;</span><span class="token operator">:</span> <span class="token string">&quot;info&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;file&quot;</span><span class="token operator">:</span> <span class="token string">&quot;~/.openclaw/logs/audit.log&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;maxSize&quot;</span><span class="token operator">:</span> <span class="token string">&quot;100m&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;maxFiles&quot;</span><span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
      <span class="token property">&quot;compress&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">&quot;events&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">&quot;auth.success&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;tool.execute&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;config.change&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;injection.detected&quot;</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-8-安全最佳实践清单" tabindex="-1"><a class="header-anchor" href="#_4-8-安全最佳实践清单"><span>4.8 安全最佳实践清单</span></a></h3><p><strong>必须做（CRITICAL）</strong>：</p><ul><li>配置 Gateway 认证（Token）。</li><li>所有 API Key 使用环境变量或 <code>.env</code> 管理。</li><li>启用 DM 配对机制。</li><li>Gateway 只绑定本地或内网地址。</li><li>关键配置文件权限设为 600。</li><li>开启 TLS 1.3。</li><li>启用沙箱并配置工具白名单。</li><li>打开 Prompt 护栏相关配置。</li><li>定期运行 <code>openclaw doctor</code> 检查配置。</li></ul><p><strong>强烈建议（HIGH）</strong>：</p><ul><li>配合防火墙，避免端口直接外暴。</li><li>通过 SSH 隧道或 VPN 暴露服务。</li><li>启用审计日志与限流策略。</li><li>文件访问策略默认 deny，仅对必要路径放行。</li><li>禁用不用的高风险工具。</li><li>为 Webhook 配置签名验证。</li></ul><hr><h2 id="五、最终完整配置模板" tabindex="-1"><a class="header-anchor" href="#五、最终完整配置模板"><span>五、最终完整配置模板</span></a></h2><p>下面是一个覆盖常见场景的完整 <code>~/.openclaw/openclaw.json</code> 模板（部分字段以注释形式省略细节）：</p><div class="language-jsonc line-numbers-mode" data-ext="jsonc" data-title="jsonc"><pre class="language-jsonc"><code>// ~/.openclaw/openclaw.json
{
  &quot;gateway&quot;: {
    &quot;host&quot;: &quot;127.0.0.1&quot;,
    &quot;port&quot;: 18789,
    &quot;canvasHost&quot;: { &quot;enabled&quot;: true, &quot;port&quot;: 18793 },
    &quot;reload&quot;: { &quot;mode&quot;: &quot;hybrid&quot; },
    &quot;auth&quot;: { &quot;mode&quot;: &quot;token&quot; },
    &quot;tls&quot;: {
      &quot;enabled&quot;: true,
      &quot;minVersion&quot;: &quot;1.3&quot;,
      &quot;certFile&quot;: &quot;/etc/letsencrypt/live/your-domain.com/fullchain.pem&quot;,
      &quot;keyFile&quot;: &quot;/etc/letsencrypt/live/your-domain.com/privkey.pem&quot;
    },
    &quot;security&quot;: {
      &quot;ipWhitelist&quot;: {
        &quot;enabled&quot;: true,
        &quot;allowedIPs&quot;: [&quot;127.0.0.1&quot;, &quot;::1&quot;, &quot;192.168.1.0/24&quot;]
      },
      &quot;rateLimiting&quot;: {
        &quot;enabled&quot;: true,
        &quot;maxRequestsPerMinute&quot;: 60,
        &quot;maxRequestsPerHour&quot;: 1000,
        &quot;burstSize&quot;: 10
      }
    }
  },
  &quot;agents&quot;: {
    &quot;defaults&quot;: {
      &quot;model&quot;: &quot;anthropic:claude-opus-4-6&quot;,
      &quot;fallbackModels&quot;: [&quot;openai/gpt-4.5&quot;, &quot;google/gemini-pro&quot;],
      &quot;maxTokens&quot;: 8192,
      &quot;temperature&quot;: 0.7,
      &quot;sandbox&quot;: {
        /* 同前文沙箱配置 */
      },
      &quot;systemPrompt&quot;: {
        &quot;guardrails&quot;: true,
        &quot;maxLength&quot;: 10000,
        &quot;injection&quot;: {
          &quot;detection&quot;: true,
          &quot;action&quot;: &quot;block&quot;,
          &quot;logAttempts&quot;: true
        }
      }
    },
    &quot;list&quot;: [
      {
        &quot;agentId&quot;: &quot;main&quot;,
        &quot;workspace&quot;: &quot;~/.openclaw/workspace&quot;,
        &quot;model&quot;: &quot;anthropic:claude-opus-4-6&quot;
      },
      {
        &quot;agentId&quot;: &quot;coding&quot;,
        &quot;workspace&quot;: &quot;~/.openclaw/workspace-coding&quot;,
        &quot;temperature&quot;: 0.3,
        &quot;skills&quot;: {
          &quot;enabled&quot;: [&quot;coding-agent&quot;, &quot;github&quot;, &quot;gh-issues&quot;, &quot;tmux&quot;]
        },
        &quot;bindings&quot;: [
          {
            &quot;channel&quot;: &quot;discord&quot;,
            &quot;guildId&quot;: &quot;123456789&quot;,
            &quot;channelId&quot;: &quot;987654321&quot;
          }
        ]
      },
      {
        &quot;agentId&quot;: &quot;social&quot;,
        &quot;workspace&quot;: &quot;~/.openclaw/workspace-social&quot;,
        &quot;model&quot;: &quot;openai:gpt-5.2-mini&quot;,
        &quot;temperature&quot;: 0.9,
        &quot;skills&quot;: {
          &quot;enabled&quot;: [&quot;summarize&quot;, &quot;weather&quot;, &quot;goplaces&quot;]
        },
        &quot;bindings&quot;: [
          {
            &quot;channel&quot;: &quot;telegram&quot;,
            &quot;chatId&quot;: &quot;-100123456789&quot;
          }
        ]
      },
      {
        &quot;agentId&quot;: &quot;work&quot;,
        &quot;workspace&quot;: &quot;~/.openclaw/workspace-work&quot;,
        &quot;model&quot;: &quot;anthropic:claude-sonnet-4-6&quot;,
        &quot;skills&quot;: {
          &quot;enabled&quot;: [&quot;gog&quot;, &quot;slack&quot;, &quot;notion&quot;, &quot;trello&quot;, &quot;summarize&quot;]
        },
        &quot;bindings&quot;: [
          {
            &quot;channel&quot;: &quot;slack&quot;,
            &quot;teamId&quot;: &quot;T01234567&quot;,
            &quot;channelId&quot;: &quot;C01234567&quot;
          }
        ]
      }
    ]
  },
  &quot;tools&quot;: {
    /* 同前文工具配置 */
  },
  &quot;clawhub&quot;: {
    &quot;enabled&quot;: true,
    &quot;registry&quot;: &quot;https://clawhub.openclaw.ai&quot;
  },
  &quot;memory&quot;: {
    &quot;backend&quot;: &quot;memory-core&quot;,
    &quot;embedding&quot;: {
      &quot;provider&quot;: &quot;local&quot;,
      &quot;model&quot;: &quot;all-MiniLM-L6-v2&quot;
    }
  },
  &quot;channels&quot;: {
    /* 各 IM 渠道与配对策略 */
  },
  &quot;filesystem&quot;: {
    /* 文件访问控制策略 */
  },
  &quot;permissions&quot;: {
    /* 角色与用户映射配置 */
  },
  &quot;storage&quot;: {
    /* 数据加密与存储策略 */
  },
  &quot;logging&quot;: {
    /* 日志与审计配置 */
  },
  &quot;schedules&quot;: [
    /* 定时任务与流水线调度 */
  ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、总结" tabindex="-1"><a class="header-anchor" href="#六、总结"><span>六、总结</span></a></h2><p>如果你已经在用 OpenClaw 做个人助理或团队助手，这篇指南可以作为一套「从 0 到可上线」的配置参考：从架构拆分、配置文件组织、多 Agent 管理，到安全和审计的关键开关都涵盖其中。实际落地时，你可以先启用最小必要配置，再根据自己的场景逐步打开更多功能与权限，并定期用 <code>openclaw doctor</code> 检查整体配置健康度。</p><hr><h2 id="参考链接" tabindex="-1"><a class="header-anchor" href="#参考链接"><span>参考链接</span></a></h2><ul><li><strong>OpenClaw GitHub 仓库</strong>：<a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer"><code>https://github.com/openclaw/openclaw</code></a></li><li><strong>OpenClaw 官方文档 / 官网</strong>：<a href="https://docs.openclaw.ai" target="_blank" rel="noopener noreferrer"><code>https://docs.openclaw.ai</code></a></li><li><strong>ClawHub 技能注册中心</strong>：<a href="https://clawhub.ai/" target="_blank" rel="noopener noreferrer"><code>https://clawhub.ai/</code></a></li></ul>`,141);function m(b,g){const a=e("Mermaid");return u(),o("div",null,[d,v,p(" more "),k,l(a,{id:"mermaid-88",code:"eJxtkstKw0AUhvd9ioMLUaRI260IIZEoUpROIIvBRdoOtjQmJZMiLlW8Il7whoggotiNlyJoLZS+TKeXt3CSSUyo7r7/3P6TM1l1jGoJNCUBQGt5odjj1XC73m1e9S+PeBxAwxoxCU+urfgaYWQahYoQClbKtGA7RSF1rJcMl0rVqqeJVUzER/ea98PNc9bYArlkWBYxqd8kRw5hQkyTA6uR6K/nSDwyjyf+LHH8zPY/2ffH8O4BVMMl68aG369OTARyJu9Mz+okj+xChbgwBfOatgzS8sLkpKjM4cHXW/+iwW7qkLNrLnHECiqakzF7PWA79f4LP+ATIFKoOWV3499NblqD7Xa37V9EWiWWK+4hpbCvYEy2i8QZE7OldBhdqtIwlgljEqVl6hqW62dGnbgNO7ztNo8Hr++ss8v9xEsuYlQpmyaFcdBs26RiahZnyZrtiDP0rp9Y55rfgJ2eDfdOWOs8ZqDBTDI5yx+QMwoYcVYC9n4sPWDda5A18ITqIYpQiVAPkLMqMOdhzmcpFeN0jDNevZTiIsm/yuN0jDMhR0XZqMZHUZJN/AASpPd4"}),q])}const w=t(r,[["render",m],["__file","openclaw-architecture.html.vue"]]),_=JSON.parse('{"path":"/posts/blog/openclaw-architecture.html","title":"OpenClaw 入门介绍","lang":"zh-CN","frontmatter":{"title":"OpenClaw 入门介绍","date":"2026-03-26T00:00:00.000Z","tags":["AI","OpenClaw","架构设计","配置"],"category":"架构","description":"结合官方与社区实践，系统梳理 OpenClaw 的架构设计、多 Agent 管理和安全配置，提供从个人到生产环境的完整配置思路与示例。","order":7,"head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/blog/openclaw-architecture.html"}],["meta",{"property":"og:site_name","content":"Lance"}],["meta",{"property":"og:title","content":"OpenClaw 入门介绍"}],["meta",{"property":"og:description","content":"结合官方与社区实践，系统梳理 OpenClaw 的架构设计、多 Agent 管理和安全配置，提供从个人到生产环境的完整配置思路与示例。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-03-26T09:22:17.000Z"}],["meta",{"property":"article:author","content":"RuyiWei"}],["meta",{"property":"article:tag","content":"AI"}],["meta",{"property":"article:tag","content":"OpenClaw"}],["meta",{"property":"article:tag","content":"架构设计"}],["meta",{"property":"article:tag","content":"配置"}],["meta",{"property":"article:published_time","content":"2026-03-26T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-03-26T09:22:17.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"OpenClaw 入门介绍\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2026-03-26T00:00:00.000Z\\",\\"dateModified\\":\\"2026-03-26T09:22:17.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"RuyiWei\\"}]}"]]},"headers":[{"level":2,"title":"一、OpenClaw 概述与设计哲学","slug":"一、openclaw-概述与设计哲学","link":"#一、openclaw-概述与设计哲学","children":[{"level":3,"title":"1.1 项目背景","slug":"_1-1-项目背景","link":"#_1-1-项目背景","children":[]},{"level":3,"title":"1.2 核心架构组件","slug":"_1-2-核心架构组件","link":"#_1-2-核心架构组件","children":[]},{"level":3,"title":"1.3 配置文件体系总览","slug":"_1-3-配置文件体系总览","link":"#_1-3-配置文件体系总览","children":[]}]},{"level":2,"title":"二、核心配置模块详解","slug":"二、核心配置模块详解","link":"#二、核心配置模块详解","children":[{"level":3,"title":"2.1 身份配置文件","slug":"_2-1-身份配置文件","link":"#_2-1-身份配置文件","children":[]},{"level":3,"title":"2.2 System Prompt 构建机制","slug":"_2-2-system-prompt-构建机制","link":"#_2-2-system-prompt-构建机制","children":[]},{"level":3,"title":"2.3 工具系统配置","slug":"_2-3-工具系统配置","link":"#_2-3-工具系统配置","children":[]},{"level":3,"title":"2.4 技能（Skills）系统配置","slug":"_2-4-技能-skills-系统配置","link":"#_2-4-技能-skills-系统配置","children":[]},{"level":3,"title":"2.5 记忆系统配置","slug":"_2-5-记忆系统配置","link":"#_2-5-记忆系统配置","children":[]},{"level":3,"title":"2.6 Gateway 配置","slug":"_2-6-gateway-配置","link":"#_2-6-gateway-配置","children":[]}]},{"level":2,"title":"三、多 Agent 架构与管理","slug":"三、多-agent-架构与管理","link":"#三、多-agent-架构与管理","children":[{"level":3,"title":"3.1 多 Agent 设计思想","slug":"_3-1-多-agent-设计思想","link":"#_3-1-多-agent-设计思想","children":[]},{"level":3,"title":"3.2 Agent 配置与角色定义","slug":"_3-2-agent-配置与角色定义","link":"#_3-2-agent-配置与角色定义","children":[]},{"level":3,"title":"3.3 消息路由与绑定","slug":"_3-3-消息路由与绑定","link":"#_3-3-消息路由与绑定","children":[]},{"level":3,"title":"3.4 Agent 间通信机制","slug":"_3-4-agent-间通信机制","link":"#_3-4-agent-间通信机制","children":[]},{"level":3,"title":"3.5 任务协作策略","slug":"_3-5-任务协作策略","link":"#_3-5-任务协作策略","children":[]},{"level":3,"title":"3.6 实战案例","slug":"_3-6-实战案例","link":"#_3-6-实战案例","children":[]}]},{"level":2,"title":"四、安全配置与防护","slug":"四、安全配置与防护","link":"#四、安全配置与防护","children":[{"level":3,"title":"4.1 安全架构概述","slug":"_4-1-安全架构概述","link":"#_4-1-安全架构概述","children":[]},{"level":3,"title":"4.2 API Key 安全管理","slug":"_4-2-api-key-安全管理","link":"#_4-2-api-key-安全管理","children":[]},{"level":3,"title":"4.3 沙箱系统配置","slug":"_4-3-沙箱系统配置","link":"#_4-3-沙箱系统配置","children":[]},{"level":3,"title":"4.4 权限控制","slug":"_4-4-权限控制","link":"#_4-4-权限控制","children":[]},{"level":3,"title":"4.5 网络安全","slug":"_4-5-网络安全","link":"#_4-5-网络安全","children":[]},{"level":3,"title":"4.6 数据隐私保护","slug":"_4-6-数据隐私保护","link":"#_4-6-数据隐私保护","children":[]},{"level":3,"title":"4.7 日志审计","slug":"_4-7-日志审计","link":"#_4-7-日志审计","children":[]},{"level":3,"title":"4.8 安全最佳实践清单","slug":"_4-8-安全最佳实践清单","link":"#_4-8-安全最佳实践清单","children":[]}]},{"level":2,"title":"五、最终完整配置模板","slug":"五、最终完整配置模板","link":"#五、最终完整配置模板","children":[]},{"level":2,"title":"六、总结","slug":"六、总结","link":"#六、总结","children":[]},{"level":2,"title":"参考链接","slug":"参考链接","link":"#参考链接","children":[]}],"git":{"createdTime":1774516937000,"updatedTime":1774516937000,"contributors":[{"name":"weiruyi","email":"1581778251@qq.com","commits":1}]},"readingTime":{"minutes":13.66,"words":4097},"filePathRelative":"posts/blog/openclaw-architecture.md","localizedDate":"2026年3月26日","excerpt":"\\n<div style=\\"display: flex; align-items: center; margin-bottom: 20px;\\">\\n  <img src=\\"/images/openclaw/logo.png\\" alt=\\"OpenClaw Logo\\" style=\\"width: 50px; height: 50px; margin-right: 15px; border-radius: 50%;\\">\\n  <strong>OpenClaw</strong> 作为一个新兴的多智能体 (Multi-Agent) 框架和平台，正在重新定义 AI Agent 的本地化部署与分布式协同体验。\\n</div>\\n"}');export{w as comp,_ as data};
