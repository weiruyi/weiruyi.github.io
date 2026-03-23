---
title: Tmux 使用指南
date: 2026-03-23
tags: 工具
category: 工具
description: tmux 终端多路复用器的完整使用指南，涵盖核心概念、快捷键、配置与插件
---

tmux 是一款终端多路复用器，让你在一个终端窗口中同时运行多个虚拟终端，即使断开 SSH 连接，所有进程也会持续运行。

<!-- more -->

# Tmux 使用指南

## 一、什么是 tmux

tmux（Terminal Multiplexer）是一款开源终端多路复用工具。它的核心能力是**持久化**：关闭终端或 SSH 断连后，tmux 内所有进程仍在后台运行，随时可以重新接入继续工作。

**核心使用场景：**

- **远程开发**：SSH 连接不稳定时，tmux 保护长时间运行的任务
- **多任务并行**：编辑器、服务器、日志监控在同一终端窗口并排显示
- **工作区自动化**：一键脚本恢复完整的项目开发环境
- **远程协作**：两人 SSH 到同一台机器，共享同一个 tmux 会话结对编程

::: tip tmux vs screen
tmux 和 screen 都是终端多路复用器，但 tmux 支持水平和垂直分屏、更丰富的配置和活跃的插件生态，是目前的主流选择。
:::

---

## 二、核心概念

tmux 有严格的三层层级结构：

```
Session（会话）
 └── Window（窗口）
      └── Pane（面板）
```

**形象比喻：**

| 层级 | 类比 | 说明 |
|---|---|---|
| Session | 项目 / 工作区 | 最高层，可脱离后台运行，重新附加恢复 |
| Window | 浏览器 Tab | 一个会话内的多个独立终端页面 |
| Pane | 分屏区域 | 一个窗口内水平或垂直分割的子终端 |

**ASCII 示意图：**

```
┌─────────────────────────────────────┐
│ Session: myproject                  │
│ ┌──────────────┬────────────────┐   │
│ │  Window 1    │  Window 2      │   │
│ │  [editor]    │  [server]      │   │
│ │              ├────────────────┤   │
│ │  Pane 1      │  Pane 1        │   │
│ │  nvim .      │  npm run dev   │   │
│ │              ├────────────────┤   │
│ │              │  Pane 2        │   │
│ │              │  tail -f log   │   │
│ └──────────────┴────────────────┘   │
└─────────────────────────────────────┘
```

---

## 三、安装

::: tabs

@tab macOS

```bash
brew install tmux
```

@tab Ubuntu / Debian

```bash
sudo apt update && sudo apt install tmux
```

@tab CentOS / RHEL

```bash
sudo yum install tmux
# 或 RHEL 8+
sudo dnf install tmux
```

:::

安装完成后验证版本：

```bash
tmux -V
# 输出示例：tmux 3.4
```

---

## 四、基础操作

### 1、前缀键（Prefix Key）

tmux 的所有快捷键都需要先按**前缀键**，默认是 `Ctrl+b`。按下前缀键后，再按功能键触发对应操作。

::: info
后文中 `prefix` 均代表 `Ctrl+b`（或你自定义的前缀键）。
:::

### 2、会话（Session）操作

**命令行操作：**

```bash
tmux                        # 启动一个新会话
tmux new -s myproject       # 启动并命名会话
tmux ls                     # 列出所有会话
tmux a                      # 附加到最近一个会话
tmux a -t myproject         # 附加到指定会话
tmux kill-session -t myproject  # 删除指定会话
```

**会话内快捷键（需先按前缀键）：**

| 快捷键 | 说明 |
|---|---|
| `prefix + d` | 脱离（Detach）当前会话，会话继续后台运行 |
| `prefix + $` | 重命名当前会话 |
| `prefix + s` | 交互式列表切换会话 |
| `prefix + (` / `)` | 切换到上一个 / 下一个会话 |

### 3、窗口（Window）操作

| 快捷键 | 说明 |
|---|---|
| `prefix + c` | 创建新窗口 |
| `prefix + ,` | 重命名当前窗口 |
| `prefix + &` | 关闭当前窗口 |
| `prefix + n` / `p` | 切换到下一个 / 上一个窗口 |
| `prefix + 0~9` | 按编号切换窗口 |
| `prefix + w` | 交互式窗口列表 |

### 4、面板（Pane）操作

| 快捷键 | 说明 |
|---|---|
| `prefix + %` | 左右分屏（垂直分割线） |
| `prefix + "` | 上下分屏（水平分割线） |
| `prefix + 方向键` | 在面板间移动焦点 |
| `prefix + z` | 切换当前面板全屏/恢复 |
| `prefix + x` | 关闭当前面板 |
| `prefix + {` / `}` | 将面板向左 / 向右交换位置 |
| `prefix + q` | 显示面板编号 |
| `prefix + Space` | 在预设布局间循环切换 |
| `prefix + !` | 将当前面板独立为新窗口 |

::: tip 面板缩放
`prefix + z` 是高频操作——临时放大某个面板全屏阅读，再按一次恢复分屏布局，非常实用。
:::

### 5、复制模式（Copy Mode）

tmux 内置滚动和复制功能，通过复制模式操作历史输出。

| 操作 | 说明 |
|---|---|
| `prefix + [` | 进入复制模式 |
| `q` | 退出复制模式 |
| 方向键 / PgUp/PgDn | 滚动浏览历史 |
| `Space` | 开始选择（vi 模式） |
| `Enter` | 复制选中内容 |
| `prefix + ]` | 粘贴复制缓冲区内容 |

---

## 五、常用快捷键速查表

> 所有快捷键均需先按前缀键 `Ctrl+b`

| 分类 | 快捷键 | 功能 |
|---|---|---|
| **会话** | `d` | 脱离会话 |
| | `$` | 重命名会话 |
| | `s` | 会话列表切换 |
| | `(` / `)` | 上一个 / 下一个会话 |
| **窗口** | `c` | 新建窗口 |
| | `,` | 重命名窗口 |
| | `&` | 关闭窗口 |
| | `n` / `p` | 下一个 / 上一个窗口 |
| | `0~9` | 按编号跳转窗口 |
| | `w` | 窗口列表 |
| **面板** | `%` | 左右分屏 |
| | `"` | 上下分屏 |
| | 方向键 | 切换面板 |
| | `z` | 面板全屏切换 |
| | `x` | 关闭面板 |
| | `{` / `}` | 移动面板 |
| | `q` | 显示面板编号 |
| | `!` | 面板升为窗口 |
| | `Space` | 切换面板布局 |
| **复制** | `[` | 进入复制模式 |
| | `]` | 粘贴缓冲区 |
| **其他** | `?` | 查看所有快捷键 |
| | `t` | 显示时钟 |
| | `:` | 进入命令模式 |

---

## 六、配置文件（.tmux.conf）

tmux 的配置文件位于 `~/.tmux.conf`，修改后在 tmux 内执行 `source-file ~/.tmux.conf` 或按绑定的重载键生效。

### 1、完整推荐配置

```bash
# ── 前缀键 ─────────────────────────────────────────────
# 将前缀键改为更符合人体工程学的 Ctrl+a
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# ── 重载配置 ────────────────────────────────────────────
# prefix + r 重载配置文件
bind r source-file ~/.tmux.conf \; display "Config reloaded!"

# ── 基础设置 ────────────────────────────────────────────
set -sg escape-time 0            # 消除 Vim 的 ESC 延迟
set -g history-limit 50000       # 增大历史滚动缓冲区
set -g base-index 1              # 窗口从 1 开始编号
setw -g pane-base-index 1        # 面板从 1 开始编号
set -g mouse on                  # 启用鼠标支持
set -g focus-events on           # 支持 Vim autoread
set -g default-terminal "tmux-256color"
set -as terminal-features ",xterm-256color:RGB"
set-option -g allow-rename off   # 禁止自动重命名，保留自定义名称

# ── vi 模式复制 ──────────────────────────────────────────
setw -g mode-keys vi
bind -T copy-mode-vi v send-keys -X begin-selection
bind -T copy-mode-vi y send-keys -X copy-selection-and-cancel

# ── 面板分屏（保留当前路径）───────────────────────────────
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# ── Alt+方向键 无需前缀切换面板 ──────────────────────────
bind -n M-Left  select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up    select-pane -U
bind -n M-Down  select-pane -D

# ── TPM 插件管理器（保持在最后）──────────────────────────
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-yank'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'

run '~/.tmux/plugins/tpm/tpm'
```

### 2、关键配置说明

| 配置项 | 作用 |
|---|---|
| `prefix C-a` | 前缀键改为 `Ctrl+a`，比默认的 `Ctrl+b` 更顺手 |
| `escape-time 0` | 修复 Vim/Neovim 中 ESC 键有延迟的问题 |
| `history-limit 50000` | 可以滚动查看更多历史输出 |
| `base-index 1` | 键盘上 1 比 0 近，从 1 开始更直觉 |
| `mouse on` | 鼠标点击切换面板、拖动调整大小、滚轮滚动 |
| `mode-keys vi` | 复制模式使用 vi 键位操作 |
| `pane_current_path` | 分屏时新面板继承当前目录，避免每次都要 `cd` |

---

## 七、插件管理（TPM）

TPM（Tmux Plugin Manager）是 tmux 的插件管理工具，类似 Vim 的 vim-plug。

### 1、安装 TPM

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

然后在 `.tmux.conf` 末尾添加上文配置中的 TPM 块，重启 tmux 后按 `prefix + I`（大写 I）安装插件。

**TPM 快捷键：**

| 快捷键 | 操作 |
|---|---|
| `prefix + I` | 安装新插件 |
| `prefix + U` | 更新所有插件 |
| `prefix + Alt+u` | 删除不再使用的插件 |

### 2、必备插件推荐

| 插件 | 功能 | 推荐度 |
|---|---|---|
| `tmux-plugins/tmux-sensible` | 一套公认合理的基础默认配置 | ⭐⭐⭐⭐⭐ |
| `tmux-plugins/tmux-resurrect` | 重启后恢复所有会话、窗口、面板布局 | ⭐⭐⭐⭐⭐ |
| `tmux-plugins/tmux-continuum` | 每隔 15 分钟自动保存，开机自动还原 | ⭐⭐⭐⭐⭐ |
| `tmux-plugins/tmux-yank` | 复制内容直接同步到系统剪贴板 | ⭐⭐⭐⭐⭐ |
| `christoomey/vim-tmux-navigator` | Vim 分屏与 tmux 面板统一用同一套导航键 | ⭐⭐⭐⭐ |
| `tmux-plugins/tmux-pain-control` | 更直觉的面板分割和大小调整键绑定 | ⭐⭐⭐⭐ |
| `tmux-plugins/tmux-prefix-highlight` | 激活前缀键时在状态栏高亮提示 | ⭐⭐⭐ |

::: tip 会话持久化神器
`tmux-resurrect` + `tmux-continuum` 的组合可以让你重启电脑后，用 `prefix + Ctrl+r` 一键恢复所有工作区，是生产力提升最大的插件组合。
:::

---

## 八、实用工作流

### 1、远程 SSH 开发

SSH 连接不稳定是常见痛点，tmux 完美解决这个问题：

```bash
# 1. SSH 登录到远程服务器后，启动命名会话
ssh user@server
tmux new -s work

# 2. 执行耗时任务（编译、训练模型、数据处理等）
# ... 开始任务 ...

# 3. 主动脱离会话（任务继续在后台运行）
# prefix + d

# 4. 下次登录后，重新附加会话
ssh user@server
tmux a -t work   # 回到之前的工作现场
```

### 2、项目工作区一键启动脚本

将下面的脚本保存为 `~/scripts/dev.sh`，一条命令启动完整工作区：

```bash
#!/bin/bash
SESSION="dev"

# 如果会话已存在则直接附加
tmux has-session -t $SESSION 2>/dev/null
if [ $? -eq 0 ]; then
    tmux attach -t $SESSION
    exit 0
fi

# 创建会话，第一个窗口：编辑器
tmux new-session -d -s $SESSION -n "editor"
tmux send-keys -t $SESSION "nvim ." C-m

# 第二个窗口：开发服务器 + 日志
tmux new-window -t $SESSION -n "server"
tmux send-keys -t $SESSION "npm run dev" C-m
tmux split-window -v -t $SESSION:server
tmux send-keys -t $SESSION "tail -f logs/app.log" C-m

# 第三个窗口：Git 操作
tmux new-window -t $SESSION -n "git"

# 回到编辑器窗口
tmux select-window -t $SESSION:editor

# 附加会话
tmux attach -t $SESSION
```

使用方式：

```bash
chmod +x ~/scripts/dev.sh
~/scripts/dev.sh
```

### 3、多服务器同步操作

需要在多台服务器上执行同一命令时，使用 `synchronize-panes`：

```bash
# 1. 在不同面板中分别 SSH 到各台服务器
# prefix + % 或 prefix + " 创建多个面板，每个面板 ssh 到一台服务器

# 2. 开启同步模式（输入的内容会同时发送到所有面板）
# prefix + : 进入命令模式，输入：
setw synchronize-panes on

# 3. 执行你的命令（会同时在所有服务器执行）
sudo apt update

# 4. 关闭同步模式
# prefix + :
setw synchronize-panes off
```

### 4、开机自动进入 tmux

在 `~/.zshrc` 或 `~/.bashrc` 中添加，打开终端时自动进入/创建 tmux 会话：

```bash
# 自动附加到已有的 base 会话，不存在则新建
if command -v tmux &>/dev/null && [ -z "$TMUX" ]; then
    tmux attach -t base || tmux new -s base
fi
```

---

## 九、常见问题与技巧

### 1、颜色显示异常

如果 tmux 内颜色显示不正确，在 `.tmux.conf` 中添加：

```bash
set -g default-terminal "tmux-256color"
set -as terminal-features ",xterm-256color:RGB"
```

同时确保在 shell 配置中设置：

```bash
export TERM=xterm-256color
```

### 2、处理嵌套 tmux 会话

本地运行 tmux，SSH 到远程后又有 tmux 时，需要区分发送前缀给哪一层：

```bash
# 本地 tmux 使用 Ctrl+a（通过 .tmux.conf 配置）
# 远程 tmux 保持默认 Ctrl+b

# 向内层（远程）tmux 发送前缀：
# 按两次 Ctrl+b 可将一个 Ctrl+b 穿透到内层 tmux
```

### 3、与 Neovim 配合

安装 `vim-tmux-navigator` 插件，可以用 `Ctrl+h/j/k/l` 在 Neovim 分屏和 tmux 面板之间无缝导航，无需区分当前焦点在哪个应用。

在 `~/.tmux.conf` 中添加：

```bash
set -g @plugin 'christoomey/vim-tmux-navigator'
```

在 Neovim 的插件配置中同样安装对应插件。

### 4、将面板输出保存到文件

```bash
# 将当前面板的输出实时追加到文件
prefix + : pipe-pane -o "cat >> ~/tmux-output.log"

# 停止记录
prefix + : pipe-pane
```

### 5、快速搜索命令历史

进入复制模式后，按 `Ctrl+s`（vi 模式）可向上搜索历史输出内容，类似 less 中的 `/` 搜索。

::: warning 注意事项
- 修改 `.tmux.conf` 后需要重新加载才能生效，建议绑定 `prefix + r` 为快速重载
- `tmux-resurrect` 只保存布局和命令，不保存未提交的 terminal 内容
- 在容器或 CI 环境中使用 tmux 时，注意部分功能（如剪贴板）需要额外配置
:::

---

> **参考资源**
> - [tmux 官方 Wiki](https://github.com/tmux/tmux/wiki/Getting-Started)
> - [tmux Plugin Manager (TPM)](https://github.com/tmux-plugins/tpm)
> - [Oh My Tmux - 开箱即用的配置](https://github.com/gpakosz/.tmux)
> - [tmux Cheat Sheet](https://tmuxcheatsheet.com/)
