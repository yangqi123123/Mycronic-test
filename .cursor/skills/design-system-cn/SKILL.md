---
name: design-system-cn
description: Applies the project design system for an admin dashboard UI (colors, typography, layout, topbar, sidebar, buttons, tags). Use when designing or implementing pages/components/styles, building admin layouts, or when the user mentions design system, 设计系统, 后台, 侧边栏, 顶部导航, 按钮, 标签, 主题色.
---

# 设计系统核心规范（Design System）

## 适用范围

当用户要求你做以下任何事情时，必须应用本文规范并在输出中显式落地到颜色/字号/布局/组件交互：
- 新增或修改后台页面、布局、导航结构（topbar / sidebar / breadcrumb / content）
- 设计/实现按钮、标签（chip/tag）、链接文字、卡片标题、页面标题等 UI
- 统一视觉风格、设计 token、主题色、状态色

## 设计 Token（默认值）

### 颜色（Color）
- **主色（Primary / 活力橙）**：`#FF8A00`
  - 用于：主按钮、导航选中态、强调标签/高亮
- **辅色（Secondary）**：
  - 纯白：`#FFFFFF`（容器/侧边栏/卡片底色）
  - 浅灰背景：`#F5F7FA`（页面背景/内容区底色）
  - 深灰标题/正文：`#1D2129`（标题与正文主文字）
- **功能色（Semantic）**：
  - 成功：`#00B42A`
  - 警告：`#FF7D00`
  - 危险：`#F53F3F`
- **中性色（Neutral）**：
  - 边框线：`#C9CDD4`
  - 辅助文字：`#86909C`

### 排版（Typography）
- **Page Header（大标题）**：18–20px，W500，`#1D2129`
- **Card Title（中标题）**：14–16px，W500，`#1D2129`
- **正文/数据**：14px，W400，`#1D2129`
- **辅助文字/标签**：12px，W400，`#86909C`
- **数字强调**：在“正文/数据”基础上加粗（W500+），颜色优先 `#1D2129`

### 圆角与基础样式（Shape）
- **主按钮圆角**：4px
- **标签/Chip**：小圆角（默认 4px）
- **分割/边框**：优先使用 `#C9CDD4` 的细线/浅描边

## 布局规范（Layout）

### 总体布局
使用「左侧固定导航 + 顶部面包屑/操作栏 + 主内容区」结构：
- **Sidebar**：固定宽 200px，背景 `#FFFFFF`
- **Topbar**：位于内容区上方，用于 Logo/平台名与用户区（头像/消息）
- **Main Content**：背景 `#F5F7FA`，内部卡片/模块用白底承载

### 侧边栏（Sidebar）
- **信息结构**：图标 + 文字导航
- **菜单层级**：最多 3 级；多级以折叠/展开展示
- **默认展示**：默认只展开/展示一级菜单；二/三级在交互后展开
- **选中态**：
  - 必须出现“橙色高亮”视觉（例如：选中项背景高亮 + 左侧橙色条）
  - 主色统一使用 `#FF8A00`

## 组件规范（Component Library）

### 顶部导航栏（Topbar）
- **左侧**：Logo + 平台名称
  - Logo 可使用自动生成的简洁图标（占位即可），风格需与后台一致（扁平/简洁）
- **右侧**：用户头像、消息铃铛

### 左侧侧边栏（Sidebar Component）
- **结构**：一级 + 二级 + 三级菜单
- **交互**：折叠/展开；选中状态使用主色高亮（`#FF8A00`）

### 标签与按钮（Tags & Buttons）
- **主按钮（Primary Button）**：
  - 背景：`#FF8A00`
  - 文字：`#FFFFFF`
  - 圆角：4px
- **标签/Chip**：
  - 灰色背景（优先从 `#F5F7FA` 或更浅灰派生；如需边框用 `#C9CDD4`）
  - 小圆角（4px）
  - 用途：筛选、状态标记、轻量信息
- **链接文字（Link Text）**：
  - 允许使用蓝色或橙色；当用于“强调/主路径”时优先橙色（`#FF8A00`）
  - 用途：跳转详情、查看、更多

## 执行规则（必须遵守）

### 1) 优先使用 Token，而不是临时拍颜色/字号
只要涉及颜色/字号/权重/背景/边框，必须从“设计 Token”中选取或派生（中性色范围内微调可以，但要说明理由）。

### 2) 后台一致性优先于“花哨”
输出与实现应更偏向清晰信息层级、强可读性、低装饰。

### 3) 侧边栏层级不超过 3 级
如果用户给的 IA 超过 3 级，必须在输出中提出扁平化建议（合并/重命名/调整信息架构）。

## 输出模板（当用户让你“设计/实现页面或组件”时）

按下列结构输出，确保落到具体 token：

```markdown
## 页面/组件概览
- **目标**：
- **使用场景**：

## 信息架构（IA）
- **Topbar**：
- **Sidebar（最多 3 级）**：
- **Content 区块**：

## 视觉与交互规范（引用 Token）
- **颜色**：
  - Primary：#FF8A00
  - Background：#F5F7FA
  - Surface：#FFFFFF
  - Text：#1D2129 / #86909C
  - Border：#C9CDD4
  - Semantic：#00B42A / #FF7D00 / #F53F3F
- **字体**：
  - Page Header：18–20 / W500 / #1D2129
  - Card Title：14–16 / W500 / #1D2129
  - Body：14 / W400 / #1D2129
  - Caption：12 / W400 / #86909C
- **关键交互**：
  - Sidebar：折叠/展开；选中态橙色高亮（#FF8A00）
  - Buttons：主按钮橙底白字，圆角 4px

## 组件清单
- **Topbar**：Logo（占位图标）/ 平台名 / 头像 / 消息铃铛
- **Sidebar**：图标+文字 / 折叠展开 / 选中态
- **Buttons**：Primary
- **Tags/Chips**：灰底小圆角
- **Links**：蓝或橙（强调优先橙）
```

