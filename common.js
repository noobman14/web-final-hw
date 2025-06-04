document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav ul');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userNickname = localStorage.getItem('userNickname');

    if (loggedInUser) {
        nav.innerHTML = `
            <li><a href="index.html">首页</a></li>
            <li><a href="publish.html">发布动态</a></li>
            <li><a href="profile.html">个人主页</a></li>
            <li><a href="#" id="logoutLink">退出登录 (${userNickname})</a></li>
        `;

        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('userNickname');
            // 直接跳转到首页，确保页面完全重新加载
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

// Handle post deletion
function handleDeletePost(postId, renderCallback) {
    let posts = getPosts();
    posts = posts.filter(post => post.id !== postId);
    savePosts(posts);
    alert('动态已删除。');
    if (renderCallback) {
        renderCallback(); // Call the page-specific re-render function
    }
}

// Handle like functionality
function handleLike(postId, renderCallback) {
    let posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        savePosts(posts);
        if (renderCallback) {
            renderCallback(); // Call the page-specific re-render function
        }
    }
}

// Handle adding a comment
function handleAddComment(postId, commentText, renderCommentsCallback) {
    let posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
        const currentUser = getLoggedInUser();
        const author = getUserByStudentId(currentUser || 'Guest');
        const newComment = {
            author: author ? author.nickname : '游客',
            content: commentText,
            timestamp: new Date().toLocaleString()
        };
        post.comments.push(newComment);
        savePosts(posts);
        if (renderCommentsCallback) {
            renderCommentsCallback(postId, post.comments); // Call the page-specific re-render comments function
        }
    }
}

// Render comments for a specific post (for display on detail page or post feed)
function renderComments(commentsContainerId, comments) {
    const commentsSection = document.getElementById(commentsContainerId);
    if (commentsSection) {
        commentsSection.innerHTML = ''; // Clear existing comments
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

// Toggle comments section visibility
function toggleComments(commentsContainerId) {
    const commentsSection = document.getElementById(commentsContainerId);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'block' ? 'none' : 'block';
    }
}