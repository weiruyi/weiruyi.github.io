---
title: 持久运行Agent的高效管控方案
date: 2026-03-24
tags: [AI, Agent, Claude, 工程实践]
category: AI
description: 深入解析 Anthropic 2025 年 11 月发布的长运行 Agent 框架设计，从 claude.ai 克隆项目看如何构建可持续工作数天的智能体
---

# 长运行 Agent 工程实践：Anthropic 有效框架设计

<!-- more -->

## 一、引言

::: tip 背景
2025 年 11 月 26 日，Anthropic 工程师 Justin Young 发表了一篇题为 "Effective harnesses for long-running agents" 的重要文章。这篇文章探讨了如何构建能够在多个上下文窗口中持续工作数小时甚至数天的智能体框架，并通过构建 claude.ai 克隆项目的实际案例展示了完整的解决方案。
:::

在 AI 辅助编程日益普及的今天，我们经常会遇到这样的场景：一个复杂的项目需要 AI 持续工作数天，涉及多个功能模块的开发、测试和集成。然而，传统的单会话 AI 助手面临着根本性的限制——上下文窗口是有限的，每次新会话都要从零开始。

这篇文章正是针对这一核心问题，提出了一套完整的工程化解决方案。

---

## 二、长运行 Agent 的核心挑战

### 1、离散会话问题

长运行 Agent 面临的最根本挑战是**会话的离散性**：

- 每个会话都是独立的，没有之前工作的记忆
- 上下文窗口限制了单次能处理的信息量
- 复杂项目往往需要数小时甚至数天才能完成

::: warning 现实场景
想象一下让 AI 帮你构建一个完整的 Web 应用：
- 第一天：搭建项目结构和基础组件
- 第二天：实现用户认证和数据库
- 第三天：开发前端界面和 API 集成

传统方式下，第二天开始时 AI 已经忘记了第一天做了什么。
:::

### 2、记忆连续性缺失

没有有效的状态持久化机制，Agent 无法：
- 回顾之前的决策和实现
- 了解当前项目的进度
- 避免重复工作或冲突
- 保持一致的代码风格和架构

---

## 三、解决方案：双层 Agent 架构

Anthropic 的解决方案采用了**双层智能体架构**，每个智能体有不同的职责和提示词。

### 1、Initializer Agent：环境初始化

**Initializer Agent** 负责在首次运行时设置完整的开发环境：

| 产物 | 作用 |
|------|------|
| `init.sh` | 环境初始化脚本 |
| `claude-progress.txt` | 进度跟踪文件 |
| 初始 git commit | 版本控制起点 |
| `features.json` | 功能清单（>200 个功能） |

::: info 功能清单设计
所有功能初始状态都标记为 `"passes": false`，随着开发进展逐个更新为 `true`。
:::

### 2、Coding Agent：渐进式开发

**Coding Agent** 在每个会话中负责实际的开发工作，遵循以下原则：

- **一次只处理一个功能** - 避免贪多嚼不烂
- **留下干净的状态** - 每个会话结束时项目处于可运行状态
- **提交到 git** - 每次变更都有版本记录
- **更新进度文件** - 明确标记已完成的工作

::: tip 核心思想
就像人类工程师一样：每次开始工作时先查看 git 日志和进度，了解当前状态，然后专注于下一个任务，完成后提交并更新记录。
:::

---

## 四、三大关键设计要素

### 1、Feature List：功能清单管理

**功能清单**是整个系统的核心，采用 JSON 格式定义：

```json
{
  "features": [
    {
      "name": "New chat button creates a fresh conversation",
      "steps": [
        "Click 'New Chat' button",
        "Verify conversation area is cleared",
        "Confirm new messages go to fresh conversation"
      ],
      "passes": false
    }
  ]
}
```

::: details 为什么需要功能清单？
1. **明确范围** - 知道需要做什么，不需要做什么
2. **进度跟踪** - 一目了然地看到已完成和待完成的工作
3. **避免遗漏** - 确保所有功能都被实现和测试
4. **自动化验证** - 可以编写脚本自动验证功能是否正常
:::

### 2、Incremental Progress：状态持久化

状态持久化通过两种机制实现：

**Git 版本控制：**
- 每个功能完成后创建独立的 commit
- commit message 清晰描述完成的工作
- 可以随时回滚到之前的状态

**进度文件：**
```
# claude-progress.txt
Project: claude.ai Clone
Started: 2025-11-20
Last Updated: 2025-11-22

Completed Features:
- [x] Project setup and basic structure
- [x] Chat interface layout
- [x] Message sending functionality
- [x] ...

Next Up:
- [ ] User authentication
- [ ] Chat history persistence
```

::: tip 人类工程师的类比
这就像我们每天下班前会：
1. 提交当天的代码
2. 更新项目管理工具（Jira/Trello）
3. 写工作日志记录进度

第二天上班时：
1. 看 git log 了解最近的变更
2. 看项目管理工具了解当前状态
3. 继续下一个任务
:::

### 3、Automated Testing：自动化验证

文章中使用 **Puppeteer MCP** 进行端到端测试：

- 自动打开浏览器
- 模拟用户操作
- 截图验证界面
- 验证功能是否正常工作

::: info 测试的重要性
没有自动化测试，Agent 很容易：
- 过早宣告胜利（看起来工作了，其实有 bug）
- 破坏已有的功能（回归问题）
- 遗漏边界条件
:::

---

## 五、典型工作流解析

让我们看看一次完整的会话流程是什么样的：

### 会话开始时：

```
# 1. 检查当前目录
!pwd
!ls -la

# 2. 阅读进度文件
@claude-progress.txt

# 3. 查看 git 历史
!git log --oneline -10

# 4. 阅读功能清单
@features.json

# 5. 启动开发服务器
!npm run dev

# 6. 测试基础功能是否正常
(使用 Puppeteer MCP 打开页面并验证)
```

### 开发过程中：

```
# 7. 选择下一个未完成的功能
# 8. 实现功能
# 9. 运行测试验证
# 10. 提交代码
!git add .
!git commit -m "Implement: New chat button creates fresh conversation"

# 11. 更新功能清单（标记 passes: true）
# 12. 更新进度文件
```

### 会话结束时：

项目处于**干净、可运行**的状态，下一个会话可以从这里继续。

---

## 六、四种失败模式与避坑指南

文章总结了四种常见的失败模式及其解决方案：

| 失败模式 | 现象 | 解决方案 |
|---------|------|---------|
| **Premature Victory**<br>过早宣告胜利 | Agent 声称完成了，但实际功能有问题 | 自动化测试验证，不要只看表面 |
| **Leaving Bugs**<br>遗留 Bug | 新功能工作了，但破坏了旧功能 | 完整的测试套件，每次都回归测试 |
| **Premature Feature Completion**<br>功能过早完成 | 标记功能为完成，但只实现了部分 | 功能清单逐项验证，确保所有步骤都通过 |
| **Wasting Time on Setup**<br>浪费时间在配置 | 每次会话都花大量时间重新配置环境 | 初始化脚本 + 状态持久化，站在之前的肩膀上 |

::: warning 真实案例
在 claude.ai 克隆项目的早期尝试中：
- Agent 经常"完成"一个功能，但实际上只处理了 happy path
- 没有测试，导致后续变更经常破坏已有功能
- 没有状态持久化，每次都要重新理解项目
:::

---

## 七、未来展望

### 1、单智能体 vs 多智能体

文章提出了一个开放问题：**是使用单个智能体还是多个智能体更好？**

::: info 两种思路
**单智能体：**
- 优点：简单，协调成本低
- 缺点：单个上下文窗口限制，任务串行

**多智能体：**
- 优点：可以并行工作，专业分工
- 缺点：需要协调机制，通信成本高
:::

这个问题目前还没有明确答案，需要更多探索。

### 2、跨领域推广

目前的方案主要针对 **Web 应用开发**，未来可以推广到：

- **科学研究** - 设计实验、分析数据、撰写论文
- **金融建模** - 构建预测模型、回测策略
- **内容创作** - 写作长文、制作视频、设计图形
- **更多领域** - 任何需要长期持续工作的任务

---

## 八、总结

这篇文章为我们展示了一套完整的长运行 Agent 工程实践：

### 核心要点回顾：

1. **双层架构** - Initializer + Coding 各司其职
2. **功能清单** - 明确范围，跟踪进度
3. **状态持久化** - Git + 进度文件，记住之前的工作
4. **自动化测试** - 避免过早宣告胜利
5. **渐进式开发** - 一次一个功能，保持干净状态

### 对我们的启示：

::: tip 关键洞察
构建有效的长运行 Agent，本质上是在**模仿人类工程师的工作方式**：
- 我们用 git 管理代码版本
- 我们用项目管理工具跟踪进度
- 我们写测试确保质量
- 我们每天下班前整理好状态

让 Agent 也遵循这些工程实践，它们就能持续工作数天甚至数周。
:::

### 行动建议：

如果你正在构建自己的长运行 Agent，可以尝试：

1. 从功能清单开始，明确要做什么
2. 设计状态持久化机制，记住之前的工作
3. 添加自动化测试，验证每一步
4. 保持渐进式，不要试图一次做太多

---

## 参考链接

- [原文：Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) - Anthropic Engineering Blog, Nov 26, 2025

---

*本文基于 Anthropic 官方文章整理和解读，希望对构建长运行 Agent 的实践者有所启发。*
