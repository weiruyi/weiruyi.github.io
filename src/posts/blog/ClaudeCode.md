---
title: Claude Code 使用指南
date: 2026-03-20
tags: AI
category: 工具
star: true
sticky: true
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

### 1、! 指令 - 直接执行终端命令

```shell
!ls -la                    # 查看目录
!git status                # Git 状态
!npm install               # 安装依赖
!cat src/main.js           # 查看文件
!mkdir temp                # 创建目录
```

::: tip 为什么用 ! 指令？
- **更快** - 直接执行，不经过 AI 思考
- **更直接** - 就是普通的终端命令
- **可预期** - 你知道会发生什么
:::

### 2、@ 语法 - 指定文件操作

```shell
@src/main.js                    # 查看文件
@src/utils.js 删除 console.log  # 修改文件
@src/A.js @src/B.js 对比差异    # 多文件操作
```

::: tip @ 语法的优势
1. **明确上下文** - 告诉 Claude 你在说哪个文件
2. **减少误解** - 避免 Claude 找错文件
3. **提高效率** - 不需要每次都用文字描述文件路径
:::

### 3、Slash 命令

| 命令 | 说明 |
|------|------|
| `/help` | 查看帮助 |
| `/clear` | 清除上下文 |
| `/commit` | 提交代码 |
| `/test` | 运行测试 |
| `/build` | 构建项目 |
| `/model` | 切换模型 |
| `/config` | 查看配置 |
| `/exit` | 退出 |

::: details 常用命令详解

#### `/commit` - 提交代码
```shell
/commit                    # 自动生成提交信息
/commit "添加登录功能"     # 指定提交信息
```

#### `/model` - 切换模型
```shell
/model sonnet    # 日常使用（推荐）
/model opus      # 复杂任务
/model haiku     # 简单任务
```

:::

### 4、自然语言对话

#### 文件操作

```shell
"查看 src/main.js 的前 30 行"
"把 src/utils.js 中的 formatDate 改成异步的"
"找一下项目中所有包含 TODO 的文件"
```

#### 代码操作

```shell
"解释一下这个函数"
"给这个组件添加 hover 效果"
"修复这个 bug：TypeError: Cannot read 'map' of undefined"
```

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
