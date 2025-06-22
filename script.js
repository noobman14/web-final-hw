/**
 * 首页逻辑模块 - script.js
 * 
 * 功能说明：
 * 1. 渲染热门推荐区域（显示点赞数最多的前3条动态）
 * 2. 渲染最新动态流（按时间顺序显示所有动态）
 * 3. 处理用户交互（点赞、评论、删除等操作）
 * 4. 实现动态更新机制（数据变化时自动刷新界面）
 */

let currentFeedType = "all"; // 新增：当前视图类型

document.addEventListener('DOMContentLoaded', () => {
            const feedSection = document.querySelector('.feed'); // 最新动态区域
            const hotPostsSection = document.querySelector('.hot-posts'); // 热门推荐区域

            // 热门推荐逻辑不变
            const getHotPosts = () => {
                const posts = getPosts();
                return posts
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 3)
                    .filter(post => post.likes > 0);
            };

            const renderHotPosts = () => {
                    const hotPosts = getHotPosts();
                    const loggedInUser = getLoggedInUser();

                    if (hotPosts.length === 0) {
                        hotPostsSection.style.display = 'none';
                        return;
                    }

                    hotPostsSection.style.display = 'block';
                    hotPostsSection.innerHTML = '<h2>🔥 热门推荐</h2>';

                    hotPosts.forEach((post, index) => {
                                const author = getUserByStudentId(post.authorId);
                                const isCurrentUserAuthor = loggedInUser && loggedInUser === post.authorId;
                                const postElement = document.createElement('div');
                                postElement.classList.add('post', 'hot-post');
                                const rankingBadge = index < 3 ? `<span class="ranking-badge rank-${index + 1}">${index + 1}</span>` : '';
                                let postImage = post.image ? `<img src="${post.image}" alt="Post Image" onerror="this.onerror=null; this.src='pic/default.png';">` : '';

                                postElement.innerHTML = `
                ${rankingBadge}
                <div class="post-header">
                    <a href="profile.html?id=${post.authorId}"><img src="${author ? author.avatar : 'https://via.placeholder.com/50'}" alt="Avatar" class="post-avatar" onerror="this.onerror=null; this.src='pic/default.png';"></a>
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
                <div class="comments-section" id="comments-${post.id}"></div>
                <div class="add-comment">
                    <input type="text" class="comment-input" data-post-id="${post.id}" placeholder="添加评论...">
                    <button class="submit-comment" data-post-id="${post.id}">评论</button>
                </div>
            `;
            hotPostsSection.appendChild(postElement);
        });

        addPostEventListeners(hotPostsSection);
    };

    function highlightHashtags(text) {

        return text.replace(/#([\u4e00-\u9fa5\w]+)/g, '<span class="hashtag">#$1</span>');
    }


    const renderPosts = () => {
        // 1. 渲染标题和切换按钮
        feedSection.innerHTML = `
            <h2>最新动态</h2>
            <div class="feed-switch" style="margin-bottom:16px;">
                <button id="allFeedBtn" ${currentFeedType === 'all' ? 'class="active"' : ''} style="border:none; background:${currentFeedType==='all' ? '#007bff' : '#eee'}; color:${currentFeedType==='all' ? '#fff' : '#333'}; padding:6px 20px; margin-right:10px; border-radius:4px; cursor:pointer;">全站动态</button>
                <button id="followingFeedBtn" ${currentFeedType === 'following' ? 'class="active"' : ''} style="border:none; background:${currentFeedType==='following' ? '#007bff' : '#eee'}; color:${currentFeedType==='following' ? '#fff' : '#333'}; padding:6px 20px; border-radius:4px; cursor:pointer;">关注动态</button>
            </div>
        `;

        // 2. 绑定切换事件
        document.getElementById('allFeedBtn').onclick = () => {
            currentFeedType = "all";
            renderPosts();
        };
        document.getElementById('followingFeedBtn').onclick = () => {
            currentFeedType = "following";
            renderPosts();
        };

        // 3. 数据源选择
        let postsAll = getPosts();
        let posts;
        if (currentFeedType === "all") {
            posts = postsAll;
        } else {
            const loggedInUser = getLoggedInUser();
            if (loggedInUser) {
                const me = getUserByStudentId(loggedInUser);
                const friends = me && me.friends ? me.friends : [];
                posts = postsAll.filter(post => friends.includes(post.authorId));
            } else {
                posts = [];
            }
        }

        // 4. 保持原有渲染内容
        const loggedInUser = getLoggedInUser();

        if (posts.length === 0) {
            const noPostsMessage = document.createElement('p');
            noPostsMessage.textContent = '暂无动态，快去发布第一条动态吧！';
            noPostsMessage.style.textAlign = 'center';
            feedSection.appendChild(noPostsMessage);
            return;
        }

        posts.forEach(post => {
            const author = getUserByStudentId(post.authorId);
            const isCurrentUserAuthor = loggedInUser && loggedInUser === post.authorId;
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            let postImage = post.image ? `<img src="${post.image}" alt="Post Image" onerror="this.onerror=null; this.src='pic/default.png';">` : '';

            // 评论输入和按钮，未登录用户隐藏
            let addCommentHtml = '';
            if (loggedInUser) {
                addCommentHtml = `<div class="add-comment">
                    <input type="text" class="comment-input" data-post-id="${post.id}" placeholder="添加评论...">
                    <button class="submit-comment" data-post-id="${post.id}">评论</button>
                </div>`;
            }

            postElement.innerHTML = `
                <div class="post-header">
                    <a href="profile.html?id=${post.authorId}"><img src="${author ? author.avatar : 'https://via.placeholder.com/50'}" alt="Avatar" class="post-avatar" onerror="this.onerror=null; this.src='pic/default.png';"></a>
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
                <div class="comments-section" id="comments-${post.id}"></div>
                ${addCommentHtml}
            `;
            feedSection.appendChild(postElement);
        });

        addPostEventListeners(feedSection);
    };

    // 其余事件监听等内容不变
    const addPostEventListeners = (container) => {
        // 点赞按钮
        container.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                handleLike(postId, () => {
                    renderHotPosts();
                    renderPosts();
                });
            });
        });

        // 评论提交
        container.querySelectorAll('.submit-comment').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                const commentInput = container.querySelector(`.comment-input[data-post-id="${postId}"]`);
                const commentText = commentInput.value.trim();
                if (commentText) {
                    handleAddComment(postId, commentText, (id, comments) => renderComments(`comments-${id}`, comments));
                    commentInput.value = '';
                }
            });
        });

        // 评论显示/隐藏
        container.querySelectorAll('.comment-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                toggleComments(`comments-${postId}`);
            });
        });

        // 删除
        container.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                if (confirm('确定要删除这条动态吗？')) {
                    handleDeletePost(postId, () => {
                        renderHotPosts();
                        renderPosts();
                    });
                }
            });
        });


        container.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                window.location.href = `edit_post.html?id=${postId}`;
            });
        });

        // 初始化评论
        const posts = getPosts();
        posts.forEach(post => renderComments(`comments-${post.id}`, post.comments));

    };

    // 页面加载时初始化渲染
    renderHotPosts();
    renderPosts();
});