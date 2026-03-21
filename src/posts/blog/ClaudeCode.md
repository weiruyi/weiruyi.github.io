---
title: Claude Code 使用指南
date: 2026-03-20
tags: AI
category: 工具
description: Claude Code 的使用指南，一款强大的 AI 编程助手
---

# Claude Code 使用指南

<!-- more -->

## 一、Claude Code 介绍

::: tip 背景
Claude Code 是 Anthropic 官方推出的 CLI 编程助手，通过自然语言与代码库交互，支持读取编辑文件、执行命令、搜索代码库。
:::

::: info 主要用途
1. **代码编辑和重构** - 通过自然语言描述让 AI 帮你修改代码
2. **代码库探索** - 快速理解项目结构和代码逻辑
3. **调试和修复** - 分析错误信息并提供修复方案
4. **文档生成** - 自动生成代码注释和文档
5. **测试编写** - 为现有代码生成测试用例
:::

## 二、安装与配置

### 1、系统要求

| 系统 | 要求 |
|------|------|
| macOS | 10.15+ |
| Linux | Ubuntu 20.04+, Debian 11+ |
| Windows | 通过 WSL2 使用 |
| 必需 | Anthropic API Key |

### 2、安装方式

::: tabs

@tab npm 安装（推荐）

```shell
npm install -g @anthropic-ai/claude-code
claude --version
```

@tab Homebrew 安装（macOS）

```shell
brew tap anthropic-ai/tap
brew install claude-code
claude --version
```

:::

### 3、配置 API Key

::: code-group

```shell [命令配置]
claude config set api-key sk-ant-api03-xxxxxxxxx
```

```shell [环境变量]
export ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxx
```

:::

::: note 获取 API Key
访问 [https://console.anthropic.com/](https://console.anthropic.com/) 注册并创建 API Key。
:::

## 三、快速入门

### 1、启动 Claude Code

```shell
cd /path/to/your/project
claude
```

启动后界面：
```
Claude Code vx.x.x
Type /help for help, /exit to exit.

You are in /path/to/your/project

> █
```

### 2、核心语法速查

| 语法 | 说明 | 示例 |
|------|------|------|
| `!命令` | 直接执行终端命令 | `!ls -la`, `!git status` |
| `@文件` | 指定文件操作 | `@src/main.js 解释一下` |
| `/命令` | Slash 命令 | `/help`, `/commit` |

### 3、确认对话框快捷键

| 按键 | 说明 |
|------|------|
| `Y` / 回车 | 确认执行 |
| `N` | 取消操作 |
| `E` | 编辑命令 |
| `?` | 查看帮助 |
| **Shift + Tab** | 自动接受所有后续操作 ⭐ |
| **Esc** | 取消当前操作 |

### 4、10 分钟上手示例

```
> 先看看项目结构

好的，让我查看一下...

> @src/main.js 解释一下这个文件

好的，这个文件的作用是...

> @src/main.js 给这个函数添加注释

我需要修改 src/main.js，确认吗？[Y/N]

> Y

已完成！
```

## 四、核心功能详解

### 1、/btw — 不污染上下文的旁问

`/btw` 允许你在不影响当前对话上下文的情况下，快速问一个"顺带一提"的问题。回答是临时性的（不计入上下文），且复用 prompt 缓存，成本极低。

::: tip 适用场景
正在让 Claude 重构某个模块，突然想确认一个库的 API 用法，又不想打断当前任务 → 用 `/btw` 问，看完按 `Space` / `Enter` / `Esc` 关闭即可。
:::

```
/btw Python 的 walrus operator := 是什么意思？
```

### 2、/rewind — 撤销代码改动

`/rewind` 可以将对话回滚到之前的某个节点，支持**选择性回滚**：

| 选项 | 效果 |
|------|------|
| 仅回滚代码 | 撤销所有文件改动，保留对话历史 |
| 同时回滚对话 | 文件改动和对话历史都还原 |

::: warning 注意
只能撤销 Claude 的文件操作，手动编辑和外部网络请求（API 调用、数据库写入）无法回滚。
:::

快捷方式：按两次 `Esc` 打开回滚菜单，比输入 `/rewind` 更快。

### 3、/insights — 使用习惯分析报告

分析过去 30 天的本地会话记录，生成交互式 HTML 报告，保存到 `~/.claude/usage-data/report.html`。

报告内容包括：
- 工具使用统计图表
- 各项目的会话数据
- Prompt 模式和纠错频率分析
- 摩擦点分析（基于真实会话）
- 自动生成 CLAUDE.md 配置建议

::: note
所有数据均在本地处理，不会上传。建议每月运行一次。
:::

### 4、/model — 切换模型

在会话中途切换 AI 模型，无需重启：

```shell
/model sonnet    # 切换到 Sonnet（节省用量）
/model opus      # 切换到 Opus（最强能力）
/model haiku     # 切换到 Haiku（速度最快）
```

快捷键：`Option+P`（macOS）打开模型选择器，不会清除已输入内容。

### 5、/simplify — 代码质量优化

代码实现完成后，运行 `/simplify` 对改动过的文件进行自动审查和优化：

- 移除未使用的 import
- 消除冗余变量
- 提取可复用逻辑
- 简化过于复杂的条件判断

::: tip 推荐工作流
写完功能 → 跑一下测试 → 运行 `/simplify` 清理代码
:::

### 6、/fork — 对话分支

`/fork` 类似 git 分支，为当前对话创建一个分叉，方便在不破坏主线的情况下尝试不同方案：

```shell
/fork    # 从当前节点创建对话分支
/resume  # 返回到分支前的主对话
```

### 7、/loop — 周期性执行任务

以固定时间间隔循环运行某个 prompt 或命令：

```shell
/loop 5m /review        # 每 5 分钟执行一次代码审查
/loop 10m 检查测试状态   # 默认间隔 10 分钟
```

适合：持续监控构建状态、定期代码审查、轮询某个外部任务。

### 8、/remote-control — 远程控制

将本地 Claude Code 会话转为可从 Claude 移动端或 `claude.ai/code` 远程访问的会话。

::: tip 工作原理
本地 Claude Code 发起出站 HTTPS 请求，**不开放任何入站端口**。文件和 MCP 服务器始终留在本地，只有对话消息和工具结果通过加密通道传输。
:::

| 方式 | 说明 |
|------|------|
| `/rc` | 将**已有会话**转为远程（保留历史） |
| `claude rc` | 在终端启动**新**远程会话 |

::: warning 限制
- 每次只能有一个远程会话，终端窗口必须保持打开
- 网络超时 10 分钟
- 仅 Pro 和 Max 计划可用
:::

### 9、/export — 导出对话

将当前会话内容导出为纯文本文件，方便留档、复盘或分享：

```shell
/export                    # 导出到剪贴板
/export session-notes.txt  # 导出到指定文件
```

### 10、@ 引用指定文件

在 prompt 中用 `@` 前缀直接引用文件，Claude 会自动读取：

```shell
# 引用单个文件
@src/utils.ts 给这个文件加上错误处理

# 同时引用多个文件
@src/utils.ts 参考 @src/helpers.ts 的风格重构一下

# 引用截图（支持图片文件）
这个报错怎么解决？@screenshot.png
```

::: tip
输入 `@` 后支持 Tab 补全文件路径，比直接粘贴文件内容更高效。
:::

### 11、快捷键汇总

| 快捷键 | 说明 |
|--------|------|
| `Ctrl+V` | 粘贴截图（macOS 也是 Ctrl，不是 Command） |
| `Ctrl+J` / `Option+回车` | 换行（不提交） |
| `Ctrl+R` | 搜索历史 Prompt（类似 bash 的 Ctrl+R） |
| `Ctrl+U` | 删除整行输入 |
| `Ctrl+G` | 用外部编辑器（`$EDITOR`）编写多行 Prompt |
| `Ctrl+B` | 将当前 bash 命令移到后台 |
| `Esc Esc`（连按两次） | 打开 /rewind 回滚菜单 |
| `Option+P` | 打开模型选择器 |
| `Option+T` | 切换扩展思考模式 |
| `Tab` | 切换思考模式 |

## 五、高级功能 - MCP (Model Context Protocol)

### 1、什么是 MCP？

::: tip MCP 介绍
MCP (Model Context Protocol) 是一个开放协议，让 AI 助手能够安全地连接外部工具和数据源。通过 MCP，Claude Code 可以：

- 访问数据库
- 操作 GitHub
- 管理文件系统
- 连接云服务
- 等等...
:::

### 2、配置文件位置

MCP 配置文件位于：

| 系统 | 路径 |
|------|------|
| macOS / Linux | `~/.claude/settings.json` |
| Windows (WSL2) | `~/.claude/settings.json` |

::: note 小白提示
如果 `~/.claude` 目录不存在，启动一次 Claude Code 就会自动创建。
:::

### 3、本地 MCP 服务器配置

#### 示例 1：文件系统 MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"]
    }
  }
}
```

::: details 配置说明
- `command`: 执行命令，这里用 `npx` 来运行 npm 包
- `args`: 命令参数
  - `-y`: 自动确认安装
  - `@modelcontextprotocol/server-filesystem`: MCP 服务器包名
  - `/path/to/your/projects`: 允许访问的目录路径
:::

#### 示例 2：GitHub MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxx"
      }
    }
  }
}
```

::: details 获取 GitHub Token
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 选择需要的权限（repo, read:user 等）
4. 生成并复制 Token
:::

#### 示例 3：PostgreSQL 数据库 MCP

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_DSN": "postgresql://user:password@localhost:5432/mydb"
      }
    }
  }
}
```

### 4、远程 MCP 服务器配置

除了本地 MCP 服务器，你还可以连接远程 MCP 服务器：

```json
{
  "mcpServers": {
    "remote-server": {
      "url": "https://your-mcp-server.example.com",
      "env": {
        "AUTH_TOKEN": "your-auth-token-here"
      }
    }
  }
}
```

### 5、常用 MCP 服务器推荐

| MCP 服务器 | 功能 | 包名 |
|-----------|------|------|
| 文件系统 | 访问本地文件 | `@modelcontextprotocol/server-filesystem` |
| GitHub | 操作 GitHub 仓库 | `@modelcontextprotocol/server-github` |
| PostgreSQL | PostgreSQL 数据库 | `@modelcontextprotocol/server-postgres` |
| MySQL | MySQL 数据库 | `@modelcontextprotocol/server-mysql` |
| SQLite | SQLite 数据库 | `@modelcontextprotocol/server-sqlite` |
| Slack | 发送 Slack 消息 | `@modelcontextprotocol/server-slack` |
| Gmail | 收发邮件 | `@modelcontextprotocol/server-gmail` |

### 6、MCP 配置完整示例

这是一个包含多个 MCP 服务器的完整配置：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_DSN": "postgresql://localhost:5432/mydb"
      }
    }
  },
  "permissions": {
    "read": "allow",
    "write": "ask",
    "execute": "ask"
  }
}
```

::: warning 配置后重启
修改配置文件后，需要重启 Claude Code 才能生效。输入 `/exit` 退出后重新启动 `claude`。
:::

## 六、高级功能 - Skills 使用

### 1、什么是 Skills？

::: tip Skills 介绍
Skills 是 Claude Code 的扩展功能，它们是预定义的工具集，可以帮助你快速完成特定任务。Skills 可以：

- 自动执行常见工作流
- 提供专业领域的辅助
- 简化复杂操作
- 增强 Claude Code 的能力
:::

### 2、如何使用 Skills

在 Claude Code 中，使用 `/` 加上 skill 名称来调用：

```shell
# 基本用法
/skill-name

# 带参数的用法
/skill-name 参数内容
```

### 3、内置 Skills 列表

| Skill 名称 | 说明 | 使用示例 |
|-----------|------|---------|
| `/help` | 查看所有可用 skills 和帮助 | `/help` |
| `/commit` | 自动提交代码更改 | `/commit` 或 `/commit "提交信息"` |
| `/test` | 运行项目测试 | `/test` |
| `/build` | 构建项目 | `/build` |
| `/clear` | 清除对话上下文 | `/clear` |

### 4、编程常用高质量 Skills 推荐

#### 代码审查 Skill

```shell
# 审查当前更改
/review

# 审查特定文件
/review src/main.js
```

**功能：**
- 检查代码质量
- 发现潜在 bug
- 提供改进建议
- 检查安全漏洞

#### 文档生成 Skill

```shell
# 为代码生成文档
/document

# 为特定函数生成文档
/document src/utils.js:myFunction
```

**功能：**
- 自动生成 JSDoc/TSDoc 注释
- 生成 README 文档
- 生成 API 文档

#### 测试生成 Skill

```shell
# 为当前代码生成测试
/generate-tests

# 为特定文件生成测试
/generate-tests src/utils.js
```

**功能：**
- 自动生成单元测试
- 生成测试用例
- 补充边界条件测试

#### 重构助手 Skill

```shell
# 分析代码并提供重构建议
/refactor

# 重构特定文件
/refactor src/components/MyComponent.jsx
```

**功能：**
- 识别代码坏味道
- 提供重构方案
- 自动执行重构

#### Git 工作流 Skill

```shell
# 创建特性分支
/feature-branch "add-login-page"

# 发起 PR
/create-pr "添加登录功能"

# 同步代码
/sync
```

**功能：**
- 简化 Git 操作
- 自动分支管理
- PR 模板生成

#### 项目初始化 Skill

```shell
# 初始化新项目
/init-project react

# 初始化 Node.js 项目
/init-project node
```

**功能：**
- 自动生成项目结构
- 配置基础文件
- 安装常用依赖

### 5、自定义 Skills

你也可以创建自己的 Skills！在项目根目录创建 `.claude/skills/` 文件夹：

```
your-project/
├── .claude/
│   └── skills/
│       ├── my-skill.md        # Skill 定义
│       └── another-skill.md
```

Skill 文件示例 (`my-skill.md`)：

```markdown
---
name: my-skill
description: 我的自定义 Skill
---

# 我的 Skill

这个 Skill 会帮助你完成特定任务。

使用方式：
/my-skill 参数
```

### 6、使用 npx 安装 Skills

通过 `npx skills` CLI 可以从任意 GitHub 仓库安装 Skills：

```shell
# 安装指定 skill
npx skills add vercel-labs/agent-skills --skill frontend-design -a claude-code

# 查看仓库中所有可用 skills
npx skills add vercel-labs/agent-skills --list

# 一次安装多个 skills
npx skills add vercel-labs/agent-skills --skill review --skill simplify -a claude-code

# 非交互式安装（CI 环境）
npx skills add vercel-labs/agent-skills --skill frontend-design -g -a claude-code -y
```

| 命令 | 说明 |
|------|------|
| `npx skills list` | 查看已安装的 skills |
| `npx skills find <关键词>` | 按关键词搜索 skill |
| `npx skills check` | 检查是否有更新 |
| `npx skills update` | 更新所有已安装的 skills |

::: tip 参数说明
- `-a claude-code`：指定安装到 Claude Code（也支持 Cursor、Copilot 等）
- `-g`：全局安装（不加则安装到当前项目 `.claude/skills/`）
- `-y`：跳过确认提示
:::

::: note 寻找 Skills
可以在 [https://skills.sh/](https://skills.sh/) 网站浏览社区分享的 Skills，也可以直接从 GitHub 仓库安装。
:::

## 七、权限配置

在 `~/.claude/settings.json` 中配置：

```json
{
  "permissions": {
    "read": "allow",
    "write": "ask",
    "execute": "ask"
  }
}
```

| 权限值 | 说明 |
|--------|------|
| `allow` | 自动允许 |
| `ask` | 每次询问（默认） |
| `deny` | 禁止 |

## 八、实用技巧

### 1、如何让 Claude 更懂你？

| 技巧 | 示例 |
|------|------|
| **指定文件** | "查看 src/utils.js 中的 formatDate 函数" |
| **描述上下文** | "这是一个 React 项目，使用 TypeScript" |
| **分步执行** | "1. 先看项目结构 2. 然后分析 main.js" |
| **给出示例** | "参考 existingComponent.js 的风格" |
| **明确要求** | "使用 async/await，不要用 .then()" |

### 2、提示词对比

::: warning 好坏对比
| 不太好 ❌ | 更好 ✅ |
|-----------|---------|
| "优化代码" | "优化 src/utils/data.js 中的 processData 函数，处理 10000 条数据时很慢" |
| "写个组件" | "创建 React 评论列表组件，支持分页、点赞、删除，参考 CommentCard 风格" |
:::

### 3、工作流建议

1. **先探索，后操作**
   ```
   "先帮我看看这个项目的结构"
   ```

2. **小步迭代**
   - 不要一次性让 AI 做太大的改动
   - 每完成一个小功能就测试验证

3. **代码审查**
   - AI 生成的代码一定要审查
   - 特别注意安全漏洞和边缘情况

### 4、快捷键汇总

| 操作 | 说明 |
|------|------|
| `↑` / `↓` | 浏览历史命令 |
| `Ctrl + C` | 中断当前操作 |
| `Esc` | 取消确认对话框 |
| `Shift + Tab` | 自动接受所有后续操作 |
| `/clear` | 清除上下文 |
| `/exit` 或 `Ctrl + C` 两次 | 退出 |

## 九、常见问题

::: tabs

@tab 如何退出？

```shell
/exit
```

@tab 如何清除上下文？

```shell
/clear
```

@tab API 额度用完了怎么办？

```shell
claude config set model sonnet
```

@tab 代码安全问题？

::: important
Claude Code 只在本地运行，不会上传你的代码，只有提示词和 AI 响应通过 API 传输。
:::

@tab MCP 不生效？

1. 检查 JSON 格式
2. 确认包名正确
3. 重启 Claude Code

@tab 如何更新？

```shell
# npm
npm update -g @anthropic-ai/claude-code

# Homebrew
brew upgrade claude-code
```

@tab Shift + Tab 有什么用？

::: tip Shift + Tab
在确认对话框中按 `Shift + Tab` 会自动接受当前操作以及后续所有操作，直到对话结束。这在你信任 Claude 要执行一系列操作时非常有用！
:::

@tab ! 指令有什么用？

::: tip ! 指令
使用 `!` 前缀可以直接执行终端命令，无需经过 AI 处理，更快更直接。例如：`!ls -la`、`!git status` 等。
:::

:::

---

## 参考链接

- [Claude Code 官方文档](https://claudecode.com/)
- [Anthropic 控制台](https://console.anthropic.com/)
- [GitHub 仓库](https://github.com/anthropics/claude-code)
- [MCP 官方文档](https://modelcontextprotocol.io/)
