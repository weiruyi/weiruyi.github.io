---
title: Claude Code 多智能体实战指南：从 Subagents 到 Agent Teams
date: 2026-03-23
tags: AI
category: AI
description: 深入讲解 Claude Code 的两种多智能体模式：Subagents 和 Agent Teams，包含实战场景和最佳实践
---

# Claude Code 多智能体实战指南：从 Subagents 到 Agent Teams

<!-- more -->

## 一、引言

::: tip 背景
2026 年初，Anthropic 正式推出了 Claude Code Agent Teams（Swarm Mode），与 Claude Opus 4.6 和 Sonnet 5 一同发布。这标志着 AI 辅助编程从"单一智能体"向"智能体团队"的范式转变。
:::

### 1.1 为什么需要多智能体？

单一 AI 虽然功能强大，但存在明显局限：

- **上下文窗口限制**：复杂项目往往超出单个上下文窗口的承载能力
- **无法并行处理**：传统模式下任务只能串行执行
- **单点瓶颈**：所有工作负载集中在单个实例上

根据 Gartner 的预测，到 2026 年底，40% 的企业应用将包含任务专用的 AI 智能体。多智能体协作正在成为 AI 辅助开发的新标准。

### 1.2 Claude Code 多智能体的核心价值

- **5-10 倍开发效率提升**：通过并行化任务执行
- **专业分工**：不同智能体专注于不同领域
- **独立上下文**：每个智能体拥有独立的上下文窗口
- **灵活协作**：支持简单委派和复杂团队协作两种模式

---

## 二、核心概念：Subagents vs Agent Teams

Claude Code 提供了两种多智能体模式，适用于不同的使用场景。

### 2.1 两种模式对比

| 特性 | Subagents（子智能体） | Agent Teams（智能体团队） |
|------|---------------------|------------------------|
| 运行方式 | 在主会话中创建，结果返回父级 | 完全独立的 Claude Code 实例 |
| 上下文 | 共享部分上下文 | 完全独立的上下文窗口 |
| 通信 | 仅向主智能体报告 | 团队成员可直接相互通信 |
| 协调 | 主智能体管理一切 | 共享任务列表，自主协调 |
| 适用场景 | 专注任务、简单并行 | 复杂协作、需要讨论的场景 |
| Token 成本 | 较低 | 较高（独立实例） |

### 2.2 如何选择？

::: info 使用 Subagents 的场景
- 任务相对简单，可以在父会话上下文中完成
- 需要并行处理但不需要团队间复杂协调
- 希望控制 Token 成本
:::

::: info 使用 Agent Teams 的场景
- 复杂项目需要多个专业角色
- 需要团队成员之间的直接沟通
- 工作可完全分解为独立子任务
:::

---

## 三、Subagents 详解

### 3.1 什么是 Subagent？

Subagent 是专门处理特定任务的 AI 助手，具有以下特征：

- **独立配置**：可以设置特定的系统提示词、工具权限和模型
- **自动委托**：Claude 根据 `description` 字段自动决定何时委派任务
- **结果回归**：任务完成后将结果返回给主会话

### 3.2 创建 Subagent

Subagent 通过 Markdown 文件定义，支持 YAML frontmatter 配置：

```yaml
---
name: code-reviewer
description: Use PROACTIVELY to review code changes
tools: Read, Grep, Bash
model: sonnet
---

You are a senior code reviewer. Focus on:
1. Code quality and best practices
2. Security vulnerabilities
3. Performance implications
4. Maintainability concerns

Provide actionable feedback with specific line references.
```

### 3.3 配置层级

Subagent 可以配置在多个层级（优先级从高到低）：

1. `--agents` CLI 参数（当前会话）
2. `.claude/agents/`（项目级）
3. `~/.claude/agents/`（用户级）
4. Plugin 的 `agents/`（插件级）

### 3.4 使用 `/agents` 命令管理

```bash
/agents              # 查看所有可用子智能体
/agents create       # 交互式创建新智能体
/agents edit         # 编辑现有智能体
/agents delete       # 删除自定义智能体
```

---

## 四、Agent Teams 详解

### 4.1 核心架构

**团队负责人（Leader）**：
- 计划任务、委派工作、综合结果
- 不直接写代码，专注于协调
- 拥有完整的任务列表视图

**队友（Teammates）**：
- 独立工作，拥有各自的上下文窗口
- 可以直接相互通信（@mentions）
- 通过共享任务列表协调工作

**技术实现**：
- Git Worktree 隔离：每个智能体在独立分支/工作区工作
- 状态持久化：`~/.claude/teams/` 和 `~/.claude/tasks/`
- TeammateTool：13 个核心操作

### 4.2 启用 Agent Teams

::: tabs

@tab 环境变量（推荐）

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude
```

@tab settings.json 配置

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

@tab 自然语言触发

```
"Create a team with 4 teammates to refactor these modules in parallel."
```

:::

### 4.3 TeammateTool 核心操作

| 操作 | 说明 |
|------|------|
| `spawnTeam` | 创建新团队 |
| `assignTask` | 分配任务给指定队友 |
| `claimTask` | 队友自主认领任务 |
| `broadcastMessage` | 广播消息给全队 |
| `sendDirectMessage` | 私信指定队友 |
| `voteOnDecision` | 团队投票决策 |
| `getTeamStatus` | 获取团队状态 |
| `updateTaskStatus` | 更新任务状态 |
| `addTaskDependency` | 添加任务依赖 |
| `mergeWorktree` | 合并工作树 |
| `shutdownTeammate` | 优雅关闭队友 |

### 4.4 典型团队角色

| 角色 | 职责 | 常用工具 |
|------|------|----------|
| **Coordinator** | 任务分解、进度跟踪 | TaskCreate, TaskList |
| **Frontend** | UI/UX 实现 | Read, Edit, Glob |
| **Backend** | API 设计、数据库 | Read, Edit, Grep |
| **DevOps** | CI/CD、部署 | Bash, Read, Write |
| **QA** | 测试用例、自动化 | Bash, Read, Glob |
| **Reviewer** | 代码审查 | Read, Grep, Glob |
| **Docs** | 文档编写 | Read, Write, Edit |

---

## 五、实战应用场景

### 5.1 场景一：并行代码审查（Subagent）

**场景**：PR 审查需要同时关注代码质量、安全性、性能、文档

**实现**：
```
创建 4 个并行子智能体：
- 代码审查员：代码质量和最佳实践
- 安全审计员：安全漏洞检测
- 性能分析师：性能瓶颈识别
- 文档检查员：文档完整性验证
```

**效果**：审查时间缩短至原来的 1/4

### 5.2 场景二：全栈功能开发（Agent Teams）

**团队配置**：
- 协调员：整体规划和集成验证
- 前端专家：React/TypeScript 组件
- 后端专家：API 和数据库
- 测试专家：单元测试和集成测试

**工作流程**：
1. 协调员分析需求并分解任务
2. 并行分配给各专业智能体
3. 使用 Git Worktree 避免冲突
4. 测试通过后自动合并

### 5.3 场景三：竞争假设调试

遇到难以定位的 Bug 时：
- 同时创建多个调查智能体
- 每个智能体假设不同的根本原因
- 并行排查并相互验证/反驳
- 最终汇总结论

### 5.4 场景四：大规模重构

- 按文件边界分配任务
- 利用多个上下文窗口处理大项目
- 接口优先：先定义契约，再并行实现

---

## 六、最佳实践

### 6.1 任务分解策略

**良好的分解**：
- 后端 API、前端组件、数据库迁移（关注点分离）
- 非重叠文件集（避免合并冲突）
- 接口优先：定义契约、类型存根、API Schema 后再并行工作

**不良的分解**：
- 认证、授权、会话管理（过度重叠）
- 紧密耦合的功能拆分到不同智能体

### 6.2 Writer/Reviewer 模式

利用并行会话保证质量：
- **会话 A（Writer）**：实现功能
- **会话 B（Reviewer）**：用全新上下文审查（无偏向性）
- **测试驱动**：一个智能体写测试，另一个实现代码

### 6.3 6 智能体标准工作流

```
1. 协调员（Coordinator）
2. 研究员（Research）
3. 测试员（Test）
4. 实现员（Implementation）
5. 审查员（Review）
6. 文档员（Documentation）
```

### 6.4 成本优化建议

- 简单任务使用 Subagents 更经济
- Agent Teams 适合复杂、可分解的任务
- 最佳并发数：通常 3-6 个队友效果最佳
- 考虑启动开销（约 10-30 秒）

---

## 七、常见问题

### Q1: Agent Teams 是否稳定？

Agent Teams 仍是实验性功能，需要 Claude Code v2.1.32+。建议在生产环境使用前先在测试项目验证。

### Q2: 如何避免文件冲突？

- 良好的前期任务分解
- 使用 Git Worktree 隔离
- 接口优先策略
- 非重叠文件集分配

### Q3: Token 成本如何控制？

| 模式 | Token 成本 | 适用场景 |
|------|-----------|----------|
| Subagents | 较低 | 简单-中等任务 |
| Agent Teams | 较高 | 复杂、可分解任务 |

### Q4: 团队通信方式有哪些？

- **广播**：`@all 前端登录页面已完成`
- **定向**：`@backend-expert 请确认接口格式`
- **任务评论**：`[Task #123] 发现依赖需要升级`

---

## 八、总结与展望

Claude Code 的多智能体功能代表了 AI 辅助编程的下一个发展阶段：

**核心价值**：
- 从"单一助手"到"智能体团队"的范式转变
- 通过并行化实现数量级的效率提升
- 专业分工让复杂项目变得可管理

**成功关键**：
- 合理的任务分解是成败关键
- 选择合适的多智能体模式
- 良好的团队协调和沟通

**未来趋势**：
- 更多专业领域的预训练智能体
- 与 CI/CD 流程的深度集成
- 智能体市场的兴起

::: tip 参考资源
- [Claude Code 官方文档 - Agent Teams](https://code.claude.com/docs/zh-CN/agent-teams)
- [Claude Code 官方文档 - Subagents](https://code.claude.com/docs/zh-CN/sub-agents)
- [Addy Osmani: Claude Code Swarms](https://addyosmani.com/blog/claude-code-agent-teams/)
:::

---

*本文基于 Claude Code 最新版本撰写，部分内容可能随版本更新而变化。*
