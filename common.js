/**
 * 公共JavaScript文件
 * 功能：处理导航栏、用户登录状态、动态操作等公共功能
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav ul'); // 获取导航菜单
    const loggedInUser = localStorage.getItem('loggedInUser'); // 获取登录用户ID
    const userNickname = localStorage.getItem('userNickname'); // 获取用户昵称

    // 如果用户已登录，显示登录后的导航菜单
    if (loggedInUser) {
        const currentUser = getUserByStudentId(loggedInUser); // 获取用户信息
        const userRole = currentUser?.role || 'user'; // 获取角色，默认为普通用户

        nav.innerHTML = `
            <li><a href="index.html">首页</a></li>
            <li><a href="publish.html">发布动态</a></li>
            <li><a href="profile.html">个人主页</a></li>
            ${userRole === 'admin' ? '<li><a href="admin.html">管理面板</a></li>' : ''}
            <li><a href="#" id="logoutLink">退出登录 (${userNickname})</a></li>
        `;

        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('userNickname');
            window.location.href = 'index.html';
        });
    } else {
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
    let posts = getPosts();
    posts = posts.filter(post => post.id !== postId);
    savePosts(posts);
    alert('动态已删除。');
    if (renderCallback) {
        renderCallback();
    }
}

/**
 * 处理点赞功能
 * @param {number} postId 要点赞的动态ID
 * @param {Function} renderCallback 点赞后需要调用的重新渲染函数
 */
function handleLike(postId, renderCallback) {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        alert('请先登录后再点赞。');
        return;
    }
    let posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        savePosts(posts);
        if (renderCallback) {
            renderCallback();
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
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        alert('请先登录后再发表评论。');
        return;
    }
    let posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
        const author = getUserByStudentId(currentUser);
        const newComment = {
            author: author ? author.nickname : '游客',
            content: commentText,
            timestamp: new Date().toLocaleString()
        };
        post.comments.push(newComment);
        savePosts(posts);
        if (renderCommentsCallback) {
            renderCommentsCallback(postId, post.comments);
        }
    }
}

/**
 * 渲染指定动态的评论列表
 * @param {string} commentsContainerId 评论容器的ID
 * @param {Array} comments 评论数组
 */
function renderComments(commentsContainerId, comments) {
    const commentsSection = document.getElementById(commentsContainerId);
    if (commentsSection) {
        commentsSection.innerHTML = '';
        if (comments.length === 0) {
            commentsSection.innerHTML = '<p>暂无评论。</p>';
            return;
        }
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
 * 切换评论区域显示状态
 * @param {string} commentsContainerId 评论容器的ID
 */
function toggleComments(commentsContainerId) {
    const commentsSection = document.getElementById(commentsContainerId);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'block' ? 'none' : 'block';
    }
}
