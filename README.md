# 校园生活交友平台

## 项目主题与概述

本项目以"校园生活交友平台"为主题，参考微博、抖音、小红书等主流社交平台的设计理念，旨在设计并实现一个模拟的校内社交互动平台。该平台主要面向学生群体，提供动态发布、浏览、评论、点赞以及个人主页管理、关注等核心社交功能，致力于营造一个活跃、友好的校园线上社区。

## 技术栈

*   **前端技术：** HTML5 + CSS3 + JavaScript
*   **数据存储：** 浏览器 `localStorage` (模拟后端数据持久化)

本项目专注于浏览器端交互实现，无需后端服务器支持，所有数据操作均在客户端完成。

## 功能实现

### 1. 普通游客可访问的页面内容 (已实现)

*   **平台首页：** 包含网站名称/Logo、导航菜单、以及最新发布的动态流。
*   **热门推荐：** 首页新增热门推荐区域，根据点赞数自动排序显示最受欢迎的3条动态，具有排名徽章和特殊视觉效果。
*   **动态浏览：** 游客可浏览注册用户设置为公开的动态内容，但无法进行评论或互动（如点赞）。
*   **页面美感与体验：** 页面整体视觉风格统一、布局清晰，交互流畅，具有现代化设计风格。
*   **内容搜索：** 支持对平台内容进行关键词搜索，快速找到相关动态和用户。

### 2. 用户系统模块 (已实现)

*   **学生自主注册：** 学生可使用学号进行注册。注册流程包含基本的输入校验（学号格式、密码长度、两次密码一致性、昵称非空）和异常提示。
*   **注册信息设置：** 注册过程中可设置头像（URL）、昵称、个人简介、兴趣标签等。
*   **登录流程：** 提供完整的登录流程，支持"记住我"功能（通过 `localStorage` 记住学号），并可选择"密码可见"。登录后，用户可进入"个人主页"查看和编辑个人信息和历史动态。
*   **个人设置：** 用户可以自定义账户和隐私设置，提升个性化体验。

### 3. 动态发布与浏览模块 (已实现)

*   **动态发布：** 登录用户可在"发布页"编写并发布图文动态。图片支持通过文件上传或图片链接的方式添加。
*   **首页时间流：** 所有动态会展示在"首页"的时间流中，最新的动态显示在最上方。
*   **热门推荐算法：** 系统根据动态的点赞数自动计算热门程度，点赞数较高的动态会自动出现在热门推荐区域。
*   **基本操作：** 支持对动态进行点赞、评论和删除操作（删除仅限动态发布者本人）。
*   **动态详情页：** 点击动态内容可进入详情页，查看全文本内容、点赞数、评论列表和时间戳。在详情页也可进行评论。
*   **动态编辑：** 用户可以对自己发布的动态进行编辑和更新。

### 4. 互动与社交模块 (已实现)

*   **他人主页访问：** 注册用户可访问他人主页，浏览其公开动态。
*   **"关注/取关"功能：** 在用户主页支持"关注/取关"功能（模拟），主页展示粉丝/关注人数。
*   **"TA的动态"：** 用户主页展示该用户发布的所有动态。
*   **实时聊天：** 平台内置聊天系统，支持用户之间的即时通讯交流。

### 5. 管理员系统 (已实现)

*   **平台管理：** 管理员可以查看并管理全站内容和用户。
*   **内容审核：** 支持对不良内容进行审核和处理，维护平台健康氛围。
*   **数据统计：** 提供基础的平台数据统计和可视化功能。

## 项目结构与各部件作用

```
.
├── index.html          # 平台首页，展示动态时间流
├── style.css           # 全局样式文件
├── script.js           # 首页的JavaScript逻辑
├── common.js           # 公共JavaScript函数和工具
│
├── register.html       # 用户注册页面
├── register.css        # 注册页面的专属样式
├── register.js         # 注册页面的JavaScript逻辑
│
├── login.html          # 用户登录页面
├── login.css           # 登录页面的专属样式
├── login.js            # 登录页面的JavaScript逻辑
│
├── publish.html        # 用户发布动态的页面
├── publish.css         # 发布动态页面的专属样式
├── publish.js          # 发布动态页面的JavaScript逻辑
│
├── profile.html        # 用户个人主页
├── profile.css         # 个人主页的专属样式
├── profile.js          # 个人主页的JavaScript逻辑
│
├── edit_profile.html   # 用户编辑个人资料的页面
├── edit_profile.css    # 编辑个人资料页面的专属样式
├── edit_profile.js     # 编辑个人资料页面的JavaScript逻辑
│
├── post_detail.html    # 动态详情页面
├── post_detail.css     # 动态详情页面的专属样式
├── post_detail.js      # 动态详情页面的JavaScript逻辑
│
├── edit_post.html      # 编辑动态页面
├── edit_post.css       # 编辑动态的专属样式
├── edit_post.js        # 编辑动态的JavaScript逻辑
│
├── search.html         # 内容搜索页面
├── search.css          # 搜索页面的专属样式
├── search.js           # 搜索功能的JavaScript逻辑
│
├── admin.html          # 管理员后台页面
├── admin.css           # 管理员后台的专属样式
├── admin.js            # 管理员功能的JavaScript逻辑
│
├── chat.html           # 即时聊天页面
├── chat.js             # 聊天功能的JavaScript逻辑
│
├── setting.html        # 用户设置页面
├── setting.css         # 设置页面的专属样式
│
├── data.js             # 核心数据管理文件，使用 localStorage 存储数据
│
└── pic/                # 图片资源目录
```

## 数据存储

本项目通过浏览器内置的 `localStorage` 来模拟后端数据存储。`data.js` 文件封装了对 `localStorage` 的读写操作，用于存储：

*   **`users`：** 存储用户注册信息（学号、密码、昵称、个人简介、兴趣标签、头像URL）
*   **`posts`：** 存储所有用户发布的动态信息（ID、作者ID、内容、图片URL、点赞数、评论列表、时间戳）
*   **`follows`：** 存储用户之间的关注关系
*   **`chats`：** 存储用户之间的聊天记录

## 热门推荐功能说明

### 功能特点
- **智能排序：** 根据动态的点赞数自动排序，点赞数越高的动态排名越靠前
- **动态更新：** 当用户点赞或取消点赞时，热门推荐列表会自动重新计算和更新
- **视觉突出：** 热门推荐区域采用渐变背景和特殊样式，排名前三的动态显示金银铜徽章
- **响应式设计：** 在移动设备上也能正常显示，适配不同屏幕尺寸
- **内容筛选：** 热门内容不会在普通时间流中重复显示，确保内容展示的多样性

### 算法逻辑
1. 获取所有动态数据
2. 按点赞数降序排序
3. 取前3条动态
4. 过滤掉点赞数为0的动态
5. 如果没有符合条件的动态，则隐藏热门推荐区域

## 如何运行项目

1.  **克隆或下载项目：** 将本项目代码克隆或下载到您的本地计算机
2.  **打开浏览器：** 使用任何现代浏览器（如Chrome, Firefox, Edge等）
3.  **直接打开 HTML 文件：** 找到 `index.html` 文件，双击即可在浏览器中打开

**注意：** 由于本项目没有后端服务器，所有数据操作都在本地浏览器中进行。这意味着如果您清除浏览器缓存或使用不同的浏览器，数据将会丢失或不一致。