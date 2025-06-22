/**
 * 公共JavaScript文件
 * 功能：处理导航栏、用户登录状态、动态操作等公共功能
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav ul'); // 获取导航菜单
    const loggedInUser = localStorage.getItem('loggedInUser'); // 获取登录用户ID
    const userNickname = localStorage.getItem('userNickname'); // 获取用户昵称

    // 如果用户已登录，显示登录后的导航菜单
    if (loggedInUser) {
        nav.innerHTML = `
            <li><a href="index.html">首页</a></li>
            <li><a href="publish.html">发布动态</a></li>
            <li><a href="profile.html">个人主页</a></li>
            <li><a href="#" id="logoutLink">退出登录 (${userNickname})</a></li>
        `;

        // 为退出登录链接添加事件监听器
        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认链接行为
            localStorage.removeItem('loggedInUser'); // 清除登录用户ID
            localStorage.removeItem('userNickname'); // 清除用户昵称
            // 直接跳转到首页，确保页面完全重新加载
            window.location.href = 'index.html';
        });
    } else {
        // 如果用户未登录，显示未登录的导航菜单
        nav.innerHTML = `
            <li><a href="index.html">首页</a></li>
            <li><a href="publish.html">发布动态</a></li>
            <li><a href="profile.html">个人主页</a></li>
            <li><a href="login.html">登录/注册</a></li>
        `;
    }
});

/**
 * 处理动态删除功能
 * @param {number} postId 要删除的动态ID
 * @param {Function} renderCallback 删除后需要调用的重新渲染函数
 */
function handleDeletePost(postId, renderCallback) {
    let posts = getPosts(); // 获取所有动态数据
    posts = posts.filter(post => post.id !== postId); // 过滤掉要删除的动态
    savePosts(posts); // 保存更新后的动态数据
    alert('动态已删除。');
    if (renderCallback) {
        renderCallback(); // 调用页面特定的重新渲染函数
    }
}

/**
 * 处理点赞功能
 * @param {number} postId 要点赞的动态ID
 * @param {Function} renderCallback 点赞后需要调用的重新渲染函数
 */
function handleLike(postId, renderCallback) {
    let posts = getPosts(); // 获取所有动态数据
    const post = posts.find(p => p.id === postId); // 查找指定动态
    if (post) {
        post.likes++; // 增加点赞数
        savePosts(posts); // 保存更新后的动态数据
        if (renderCallback) {
            renderCallback(); // 调用页面特定的重新渲染函数
        }
    }
}

/**
 * 处理添加评论功能
 * @param {number} postId 要评论的动态ID
 * @param {string} commentText 评论内容
 * @param {Function} renderCommentsCallback 添加评论后需要调用的重新渲染评论函数
 */
function handleAddComment(postId, commentText, renderCommentsCallback) {
    let posts = getPosts(); // 获取所有动态数据
    const post = posts.find(p => p.id === postId); // 查找指定动态
    if (post) {
        const currentUser = getLoggedInUser(); // 获取当前登录用户
        const author = getUserByStudentId(currentUser || 'Guest'); // 获取用户信息
        const newComment = {
            author: author ? author.nickname : '游客', // 评论作者
            content: commentText, // 评论内容
            timestamp: new Date().toLocaleString() // 评论时间
        };
        post.comments.push(newComment); // 添加新评论到动态
        savePosts(posts); // 保存更新后的动态数据
        if (renderCommentsCallback) {
            renderCommentsCallback(postId, post.comments); // 调用页面特定的重新渲染评论函数
        }
    }
}

/**
 * 渲染指定动态的评论列表（用于详情页面或动态流显示）
 * @param {string} commentsContainerId 评论容器的ID
 * @param {Array} comments 评论数组
 */
function renderComments(commentsContainerId, comments) {
    const commentsSection = document.getElementById(commentsContainerId); // 获取评论区域元素
    if (commentsSection) {
        commentsSection.innerHTML = ''; // 清除现有评论
        if (comments.length === 0) {
            commentsSection.innerHTML = '<p>暂无评论。</p>'; // 显示无评论提示
            return;
        }
        // 遍历渲染每条评论
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong>: ${comment.content}</p>
                <span>${comment.timestamp}</span>
            `;
            commentsSection.appendChild(commentElement);
        });
    }
}

/**
 * 切换评论区域的显示/隐藏状态
 * @param {string} commentsContainerId 评论容器的ID
 */
function toggleComments(commentsContainerId) {
    const commentsSection = document.getElementById(commentsContainerId); // 获取评论区域元素
    if (commentsSection) {
        // 切换显示状态：如果当前是显示则隐藏，如果当前是隐藏则显示
        commentsSection.style.display = commentsSection.style.display === 'block' ? 'none' : 'block';
    }
}