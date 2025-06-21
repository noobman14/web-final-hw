/**
 * 首页逻辑模块 - script.js
 * 
 * 功能说明：
 * 1. 渲染热门推荐区域（显示点赞数最多的前3条动态）
 * 2. 渲染最新动态流（按时间顺序显示所有动态）
 * 3. 处理用户交互（点赞、评论、删除等操作）
 * 4. 实现动态更新机制（数据变化时自动刷新界面）
 * 
 * 核心特性：
 * - 热门推荐算法：按点赞数排序，实时更新
 * - 响应式设计：支持移动端和桌面端
 * - 权限控制：只有动态作者可以删除自己的动态
 * - 实时交互：点赞、评论操作立即反映在界面上
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
            // 获取页面中的主要容器元素
            const feedSection = document.querySelector('.feed'); // 最新动态区域
            const hotPostsSection = document.querySelector('.hot-posts'); // 热门推荐区域

            /**
             * 获取热门动态数据
             * 算法：按点赞数降序排序，取前3条，过滤掉点赞数为0的动态
             * @returns {Array} 热门动态数组
             */
            const getHotPosts = () => {
                const posts = getPosts(); // 从data.js获取所有动态数据
                // 按点赞数降序排序，取前3条，过滤掉点赞数为0的动态
                return posts
                    .sort((a, b) => b.likes - a.likes) // 降序排序（点赞数多的在前）
                    .slice(0, 3) // 取前3条
                    .filter(post => post.likes > 0); // 过滤掉无人点赞的动态
            };

            /**
             * 渲染热门推荐区域
             * 功能：显示点赞数最多的前3条动态，具有特殊样式和排名徽章
             */
            const renderHotPosts = () => {
                    const hotPosts = getHotPosts(); // 获取热门动态数据
                    const loggedInUser = getLoggedInUser(); // 获取当前登录用户

                    // 如果没有热门动态，隐藏整个区域
                    if (hotPosts.length === 0) {
                        hotPostsSection.style.display = 'none';
                        return;
                    }

                    // 显示热门推荐区域并设置标题
                    hotPostsSection.style.display = 'block';
                    hotPostsSection.innerHTML = '<h2>🔥 热门推荐</h2>';

                    // 遍历渲染每条热门动态
                    hotPosts.forEach((post, index) => {
                                // 获取动态作者信息
                                const author = getUserByStudentId(post.authorId);
                                // 判断当前用户是否为动态作者（用于显示删除按钮）
                                const isCurrentUserAuthor = loggedInUser && loggedInUser === post.authorId;

                                // 创建动态容器元素
                                const postElement = document.createElement('div');
                                postElement.classList.add('post', 'hot-post'); // 添加特殊样式类

                                // 生成排名徽章（只有前3名显示）
                                const rankingBadge = index < 3 ? `<span class="ranking-badge rank-${index + 1}">${index + 1}</span>` : '';

                                // 处理动态图片（如果有的话）
                                let postImage = post.image ? `<img src="${post.image}" alt="Post Image" onerror="this.onerror=null; this.src='pic/default.png';">` : '';

                                // 构建动态HTML结构
                                postElement.innerHTML = `
                ${rankingBadge}
                <div class="post-header">
                    <img src="${author ? author.avatar : 'https://via.placeholder.com/50'}" alt="Avatar" class="post-avatar" onerror="this.onerror=null; this.src='pic/default.png';">
                    <h3><a href="profile.html?id=${post.authorId}">${author ? author.nickname : '未知用户'}</a></h3>
                </div>
                <p><a href="post_detail.html?id=${post.id}">${highlightHashtags(post.content)}</a></p>
                ${postImage}
                <div class="post-actions">
                    <span class="like-button" data-post-id="${post.id}">👍 ${post.likes}</span>
                    <span class="comment-button" data-post-id="${post.id}">💬 ${post.comments.length}</span>
                    <span class="timestamp">${post.timestamp}</span>
                    ${isCurrentUserAuthor ? `<span class="delete-button" data-post-id="${post.id}">🗑️ 删除</span>` : ''}
                </div>
                <div class="comments-section" id="comments-${post.id}">
                    <!-- 评论内容将通过JavaScript动态加载 -->
                </div>
                <div class="add-comment">
                    <input type="text" class="comment-input" data-post-id="${post.id}" placeholder="添加评论...">
                    <button class="submit-comment" data-post-id="${post.id}">评论</button>
                </div>
            `;
            
            // 将动态元素添加到热门推荐区域
            hotPostsSection.appendChild(postElement);
        });

        // 为热门动态添加事件监听器
        addPostEventListeners(hotPostsSection);
    };

    function highlightHashtags(text) {
    return text.replace(/#([\u4e00-\u9fa5\w]+)/g, '<span class="hashtag">#$1</span>');
}
    /**
     * 渲染最新动态流
     * 功能：按时间顺序显示所有用户发布的动态
     */


    const renderPosts = () => {
        const posts = getPosts(); // 从data.js获取所有动态数据
        const loggedInUser = getLoggedInUser(); // 获取当前登录用户
        
        // 清空并重新设置最新动态区域标题
        feedSection.innerHTML = '<h2>最新动态</h2>';

        // 如果没有动态，显示提示信息
        if (posts.length === 0) {
            const noPostsMessage = document.createElement('p');
            noPostsMessage.textContent = '暂无动态，快去发布第一条动态吧！';
            noPostsMessage.style.textAlign = 'center';
            feedSection.appendChild(noPostsMessage);
            return;
        }

        // 遍历渲染每条动态
        posts.forEach(post => {
            // 获取动态作者信息
            const author = getUserByStudentId(post.authorId);
            // 判断当前用户是否为动态作者
            const isCurrentUserAuthor = loggedInUser && loggedInUser === post.authorId;
            
            // 创建动态容器元素
            const postElement = document.createElement('div');
            postElement.classList.add('post'); // 普通动态样式

            // 处理动态图片
            let postImage = post.image ? `<img src="${post.image}" alt="Post Image" onerror="this.onerror=null; this.src='pic/default.png';">` : '';

            // 构建动态HTML结构（与热门推荐基本相同，但没有排名徽章）
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${author ? author.avatar : 'https://via.placeholder.com/50'}" alt="Avatar" class="post-avatar" onerror="this.onerror=null; this.src='pic/default.png';">
                    <h3><a href="profile.html?id=${post.authorId}">${author ? author.nickname : '未知用户'}</a></h3>
                </div>
                <p><a href="post_detail.html?id=${post.id}">${highlightHashtags(post.content)}</a></p>
                ${postImage}
                <div class="post-actions">
                    <span class="like-button" data-post-id="${post.id}">👍 ${post.likes}</span>
                    <span class="comment-button" data-post-id="${post.id}">💬 ${post.comments.length}</span>
                    <span class="timestamp">${post.timestamp}</span>
                    ${isCurrentUserAuthor ? `<span class="delete-button" data-post-id="${post.id}">🗑️ 删除</span>` : ''}
                    ${isCurrentUserAuthor ? `<span class="edit-button" data-post-id="${post.id}">✏️ 编辑</span>` : ''}
                </div>
                <div class="comments-section" id="comments-${post.id}">
                    <!-- 评论内容将通过JavaScript动态加载 -->
                </div>
                <div class="add-comment">
                    <input type="text" class="comment-input" data-post-id="${post.id}" placeholder="添加评论...">
                    <button class="submit-comment" data-post-id="${post.id}">评论</button>
                </div>
            `;
            
            // 将动态元素添加到最新动态区域
            feedSection.appendChild(postElement);
        });

        // 为最新动态添加事件监听器
        addPostEventListeners(feedSection);
    };

    /**
     * 为动态添加事件监听器
     * 功能：处理点赞、评论、删除等用户交互操作
     * @param {HTMLElement} container - 包含动态的容器元素
     */
    const addPostEventListeners = (container) => {
        // 点赞按钮事件监听器
        container.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId); // 获取动态ID
                // 调用点赞处理函数，并在完成后重新渲染两个区域
                handleLike(postId, () => {
                    renderHotPosts(); // 重新渲染热门推荐（因为点赞数可能影响排名）
                    renderPosts();    // 重新渲染最新动态（更新点赞数显示）
                });
            });
        });

        // 评论提交按钮事件监听器
        container.querySelectorAll('.submit-comment').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId); // 获取动态ID
                // 获取对应的评论输入框
                const commentInput = container.querySelector(`.comment-input[data-post-id="${postId}"]`);
                const commentText = commentInput.value.trim(); // 获取评论内容
                
                // 如果评论内容不为空，则提交评论
                if (commentText) {
                    // 调用评论处理函数
                    handleAddComment(postId, commentText, (id, comments) => renderComments(`comments-${id}`, comments));
                    commentInput.value = ''; // 清空输入框
                }
            });
        });

        // 评论显示/隐藏按钮事件监听器
        container.querySelectorAll('.comment-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId); // 获取动态ID
                // 切换评论区域的显示状态
                toggleComments(`comments-${postId}`);
            });
        });

        // 删除按钮事件监听器
        container.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId); // 获取动态ID
                // 确认删除操作
                if (confirm('确定要删除这条动态吗？')) {
                    // 调用删除处理函数，并在完成后重新渲染两个区域
                    handleDeletePost(postId, () => {
                        renderHotPosts(); // 重新渲染热门推荐（删除可能影响排名）
                        renderPosts();    // 重新渲染最新动态（移除被删除的动态）
                    });
                }
            });
        });

        // 编辑按钮事件监听器
        container.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = parseInt(e.target.dataset.postId);
            window.location.href = `edit_post.html?id=${postId}`;
            });
        });

        // 初始化评论显示
        const posts = getPosts(); // 获取所有动态数据
        posts.forEach(post => renderComments(`comments-${post.id}`, post.comments)); // 渲染每条动态的评论
    };

    // 页面加载时初始化渲染
    renderHotPosts(); // 首先渲染热门推荐区域
    renderPosts();    // 然后渲染最新动态区域
});