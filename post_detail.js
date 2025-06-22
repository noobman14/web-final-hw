p/**
 * 动态详情页面JavaScript文件
 * 功能：显示动态详细内容、评论列表和添加评论功能
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的主要元素
    const postDetailContent = document.getElementById('postDetailContent'); // 动态详情内容区域
    const commentsList = document.getElementById('commentsList'); // 评论列表区域
    const commentInputDetail = document.getElementById('commentInputDetail'); // 评论输入框
    const submitCommentDetail = document.getElementById('submitCommentDetail'); // 提交评论按钮

    /**
     * 检查用户是否已登录
     * @returns {boolean} 登录状态
     */
    const checkLogin = () => {
        const loggedInUser = localStorage.getItem('loggedInUser'); // 从本地存储获取登录用户
        if (!loggedInUser) {
            // 如果未登录，显示提示信息并隐藏评论功能
            postDetailContent.innerHTML = '<p>请先登录后再查看动态详情。</p>';
            commentsList.innerHTML = '';
            commentInputDetail.style.display = 'none';
            submitCommentDetail.style.display = 'none';
            return false;
        }
        return true;
    };

    /**
     * 从URL参数中获取动态ID
     * @returns {number} 动态ID
     */
    const getPostIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search); // 解析URL参数
        return parseInt(params.get('id')); // 获取并转换为数字
    };

    /**
     * 渲染单个动态详情
     * @param {number} postId 动态ID
     */
    const renderPostDetail = (postId) => {
        if (!checkLogin()) return; // 检查登录状态

        const posts = getPosts(); // 获取所有动态数据
        const post = posts.find(p => p.id === postId); // 查找指定ID的动态

        if (!post) {
            // 如果动态不存在，显示错误信息
            postDetailContent.innerHTML = '<p>动态未找到。</p>';
            commentsList.innerHTML = '';
            commentInputDetail.style.display = 'none';
            submitCommentDetail.style.display = 'none';
            return;
        }

        const author = getUserByStudentId(post.authorId); // 获取动态作者信息
        let postImage = post.image ? `<img src="${post.image}" alt="Post Image">` : ''; // 处理动态图片

        // 构建动态详情HTML结构
        postDetailContent.innerHTML = `
            <div class="post-detail-content">
                <div class="post-header">
                    <img src="${author ? author.avatar : 'https://via.placeholder.com/50'}" alt="Avatar" class="post-avatar">
                    <h3><a href="profile.html?id=${post.authorId}">${author ? author.nickname : '未知用户'}</a></h3>
                </div>
                <h2>${post.content.substring(0, 50)}...</h2> <!-- 显示前50个字符作为标题 -->
                <p>${post.content}</p>
                ${postImage}
                <div class="post-detail-meta">
                    <span>👍 ${post.likes}</span>
                    <span>💬 ${post.comments.length}</span>
                    <span>${post.timestamp}</span>
                </div>
            </div>
        `;

        renderComments(post.comments); // 渲染评论列表
    };

    /**
     * 渲染评论列表
     * @param {Array} comments 评论数组
     */
    const renderComments = (comments) => {
        commentsList.innerHTML = ''; // 清除现有评论
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>暂无评论。</p>';
            return;
        }

        // 遍历渲染每条评论
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment-detail');
            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong>: ${comment.content}</p>
                <span>${comment.timestamp}</span>
            `;
            commentsList.appendChild(commentElement);
        });
    };

    // 处理添加评论功能
    submitCommentDetail.addEventListener('click', () => {
        const commentText = commentInputDetail.value.trim(); // 获取评论内容
        const postId = getPostIdFromUrl(); // 获取动态ID
        if (commentText && postId) {
            let posts = getPosts(); // 获取所有动态数据
            const post = posts.find(p => p.id === postId); // 查找指定动态

            if (post) {
                const currentUser = localStorage.getItem('loggedInUser'); // 获取当前登录用户
                const author = getUserByStudentId(currentUser || 'Guest'); // 获取用户信息
                const newComment = {
                    author: author ? author.nickname : '游客', // 评论作者
                    content: commentText, // 评论内容
                    timestamp: new Date().toLocaleString() // 评论时间
                };
                post.comments.push(newComment); // 添加新评论
                savePosts(posts); // 保存更新后的动态数据
                renderComments(post.comments); // 重新渲染评论列表
                commentInputDetail.value = ''; // 清空输入框
            }
        } else {
            alert('评论内容不能为空。');
        }
    });

    // 页面加载时的初始渲染
    const postId = getPostIdFromUrl(); // 获取动态ID
    if (postId) {
        renderPostDetail(postId); // 渲染动态详情
    } else {
        postDetailContent.innerHTML = '<p>未指定动态ID。</p>'; // 显示错误信息
    }
});