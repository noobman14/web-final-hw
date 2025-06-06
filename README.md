<<<<<<< HEAD
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
*   **动态浏览：** 游客可浏览注册用户设置为公开的动态内容（目前所有动态均为公开），但无法进行评论或互动（如点赞）。
*   **页面美感与体验：** 页面整体视觉风格统一、布局清晰，交互流畅。

### 2. 用户系统模块 (已实现)

*   **学生自主注册：** 学生可使用学号进行注册。注册流程包含基本的输入校验（学号格式、密码长度、两次密码一致性、昵称非空）和异常提示。
*   **注册信息设置：** 注册过程中可设置头像（URL）、昵称、个人简介、兴趣标签等。
*   **登录流程：** 提供完整的登录流程，支持"记住我"功能（通过 `localStorage` 记住学号），并可选择"密码可见"。登录后，用户可进入"个人主页"查看和编辑个人信息和历史动态。
*   **管理员系统 (未实现 - 可选部分)：** 系统管理员账号支持管理用户账号（如"封禁用户"、"重置资料"）暂未实现。

### 3. 动态发布与浏览模块 (已实现)

*   **动态发布：** 登录用户可在"发布页"编写并发布图文动态。图片支持通过文件上传或图片链接的方式添加。
*   **首页时间流：** 所有动态会展示在"首页"的时间流中，最新的动态显示在最上方。
*   **基本操作：** 支持对动态进行点赞、评论和删除操作（删除仅限动态发布者本人）。
*   **动态详情页：** 点击动态内容可进入详情页，查看全文本内容、点赞数、评论列表和时间戳。在详情页也可进行评论。

### 4. 互动与社交模块 (已实现)

*   **他⼈主⻚访问：** 注册用户可访问他⼈主页，浏览其公开动态。
*   **"关注/取关"功能：** 在用户主页支持"关注/取关"功能（模拟），主页展示粉丝/关注人数。
*   **"TA的动态"：** 用户主页展示该用户发布的所有动态。

### 5. 其他个性化模块 (可选部分 - 未实现)

*   **推荐内容：** 首页根据系统内数据变化动态更新推荐内容，如点赞较多的动态自动更新为"热门推荐"等。
*   **动效提示：** 首页支持简洁动效提示新内容（如动态标记、跑马灯等）。
*   **用户资料页个性化：** 用户资料页可展示最近活跃时间、访问量、相册墙等个性化内容。
*   **话题标签与可见范围：** 支持为动态添加话题标签、设置可见范围（公开/仅好友）等。
*   **动态编辑/撤回与评论区表情/图片回复：** 暂未实现。
*   **"私信"、"转发"、"收藏"功能：** 仅界面展示，未实现具体逻辑。
*   **主题切换与隐私权限：** 如夜间模式、动态仅自己可见等，暂未实现。
*   **高级社交功能：** 如"用户群组"、"打卡签到"、"年度回顾"、"搜索功能"等，暂未实现。

## 项目结构与各部件作用

```
web/
└── bighw/
    ├── index.html          # 平台首页，展示动态时间流。
    ├── style.css           # 全局样式文件，定义了网站的通用视觉风格。
    ├── script.js           # 首页的JavaScript逻辑，负责动态渲染、点赞、评论、删除等交互。
    │
    ├── register.html       # 用户注册页面。
    ├── register.css        # 注册页面的专属样式。
    ├── register.js         # 注册页面的JavaScript逻辑，处理表单校验和注册提交。
    │
    ├── login.html          # 用户登录页面。
    ├── login.css           # 登录页面的专属样式。
    ├── login.js            # 登录页面的JavaScript逻辑，处理登录验证、记住我、密码可见等功能。
    │
    ├── publish.html        # 用户发布动态的页面。
    ├── publish.css         # 发布动态页面的专属样式。
    ├── publish.js          # 发布动态页面的JavaScript逻辑，处理图片上传预览和动态发布。
    │
    ├── profile.html        # 用户个人主页，展示用户资料、关注/粉丝数和个人动态。
    ├── profile.css         # 个人主页的专属样式。
    ├── profile.js          # 个人主页的JavaScript逻辑，负责加载和展示用户数据、关注/取关功能和跳转编辑资料页。
    │
    ├── edit_profile.html   # 用户编辑个人资料的页面。
    ├── edit_profile.css    # 编辑个人资料页面的专属样式。
    ├── edit_profile.js     # 编辑个人资料页面的JavaScript逻辑，处理资料的加载与保存。
    │
    ├── post_detail.html    # 动态详情页面，展示单条动态的完整内容及评论。
    ├── post_detail.css     # 动态详情页面的专属样式。
    ├── post_detail.js      # 动态详情页面的JavaScript逻辑，负责加载动态详情和评论功能。
    │
    └── data.js             # 核心数据管理文件，模拟后端数据存储，使用 `localStorage` 维护用户和动态数据。
```

## 数据存储

本项目通过浏览器内置的 `localStorage` 来模拟后端数据存储。`data.js` 文件封装了对 `localStorage` 的读写操作，用于存储：

*   **`users`：** 存储用户注册信息（学号、密码、昵称、个人简介、兴趣标签、头像URL）。
*   **`posts`：** 存储所有用户发布的动态信息（ID、作者ID、内容、图片URL、点赞数、评论列表、时间戳）。

当应用程序启动时，`data.js` 会检查 `localStorage` 中是否存在 `users` 和 `posts` 数据。如果不存在，则会初始化一些默认的用户和动态数据，以便演示。

## 如何运行项目

1.  **克隆或下载项目：** 将本项目代码克隆或下载到您的本地计算机。
2.  **打开浏览器：** 使用任何现代浏览器（如Chrome, Firefox, Edge等）。
3.  **直接打开 HTML 文件：** 找到 `web/bighw/index.html` 文件，双击即可在浏览器中打开。

*   **注意：** 由于本项目没有后端服务器，所有数据操作都在本地浏览器中进行。这意味着如果您清除浏览器缓存或使用不同的浏览器，数据将会丢失或不一致。在实际部署中，通常会使用后端数据库进行数据持久化。 
=======
# web-final-hw
>>>>>>> eefead8b5d3fd5f11eb129a9e40560c8cea55e9e
