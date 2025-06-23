document.addEventListener('DOMContentLoaded', () => {
    const postDetailContent = document.getElementById('postDetailContent');
    const commentsList = document.getElementById('commentsList');
    const commentInputDetail = document.getElementById('commentInputDetail');
    const submitCommentDetail = document.getElementById('submitCommentDetail');
    const editPostButton = document.getElementById('editPostButton');

    const checkLogin = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            // 允许游客查看动态内容
            return true;
        }
        return true;
    };


    //這個函數用來後續處理點擊名字進入主頁
    function getStudentIdByNickname(nickname) {
        const users = getUsers();
        const user = users.find(user => user.nickname === nickname);
        return user ? user.studentId : null;
    }

    /**
     * 从URL参数中获取动态ID
     * @returns {number} 动态ID
     */

    /*已解決*/

    const getPostIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    };

    function highlightHashtags(text) {
        return text.replace(/#([\u4e00-\u9fa5\w]+)/g, '<span class="hashtag">#$1</span>');
    }

    let currentPostId = null;
    let currentPost = null;

    const renderPostDetail = (postId) => {
        if (!checkLogin()) return;

        const visiblePosts = getVisiblePostsForUser();
        const post = visiblePosts.find(p => p.id === postId);
        currentPostId = postId;
        currentPost = post;

        if (!post) {
            postDetailContent.innerHTML = '<p>动态未找到或您没有权限查看。</p>';
            commentsList.innerHTML = '';
            commentInputDetail.style.display = 'none';
            submitCommentDetail.style.display = 'none';
            return;
        }

        const author = getUserByStudentId(post.authorId);
        let postImage = post.image ? `<img src="${post.image}" alt="Post Image">` : '';
        const highlightedContent = highlightHashtags(post.content);

        postDetailContent.innerHTML = `
            <div class="post-detail-content">
                <div class="post-header">
                    <img src="${author ? author.avatar : 'https://via.placeholder.com/50'}" alt="Avatar" class="post-avatar">
                    <div class="post-header-info">
                        <h3><a href="profile.html?id=${post.authorId}">${author ? author.nickname : '未知用户'}</a></h3>
                        <span class="post-timestamp">${post.timestamp}</span>
                    </div>
                </div>
                <h2 class="post-title">${post.content.substring(0, 50)}...</h2>
                <p class="post-content">${highlightedContent}</p>
                ${postImage}
            </div>
        `;

        // 更新评论区标题和点赞数
        const commentsSectionTitle = document.querySelector('.comments-section-detail h3');
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (commentsSectionTitle) {
            let buttonsHtml = `<span class="post-likes" id="likeCount">👍 ${post.likes}</span>`;
            if (loggedInUser) {
                buttonsHtml += ` <button id="likeBtn" class="like-btn">点赞</button>`;
                buttonsHtml += ` <button id="shareBtn" class="like-btn">转发</button>`;
                buttonsHtml += ` <button id="favoriteBtn" class="like-btn">收藏</button>`;
            }
            commentsSectionTitle.innerHTML = `评论 ${buttonsHtml}`;
        }

        renderComments(post.comments);

        if (loggedInUser) {
            if (post.authorId === loggedInUser) {
                editPostButton.style.display = 'block';
            } else {
                editPostButton.style.display = 'none';
            }
            commentInputDetail.style.display = 'block';
            submitCommentDetail.style.display = 'block';

            // 绑定点赞按钮事件
            const likeBtn = document.getElementById('likeBtn');
            if (likeBtn) {
                likeBtn.onclick = () => {
                    handleLike(postId, () => {
                        // 重新渲染点赞数
                        const posts = getPosts();
                        const post = posts.find(p => p.id === postId);
                        const likeCount = document.getElementById('likeCount');
                        if (likeCount && post) {
                            likeCount.innerHTML = `👍 ${post.likes}`;
                        }
                    });
                };
            }

            // 绑定转发按钮事件
            const shareBtn = document.getElementById('shareBtn');
            if (shareBtn) {
                shareBtn.addEventListener('click', () => alert('链接已复制到剪贴板！'));
            }

            // 绑定收藏按钮事件
            const favoriteBtn = document.getElementById('favoriteBtn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', () => alert('收藏成功！'));
            }
        } else {
            editPostButton.style.display = 'none';
            commentInputDetail.style.display = 'none';
            submitCommentDetail.style.display = 'none';
        }
    };

    const renderComments = (comments) => {
        commentsList.innerHTML = '';
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>暂无评论。</p>';
            return;
        }

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment-detail');
            const studentId = getStudentIdByNickname(comment.author);
            //這裏添加點擊評論名字能進入主頁的功能
            const authorHtml = studentId ?
                `<a href="profile.html?user=${studentId}"><strong>${comment.author}</strong></a>` :
                `<strong>${comment.author}</strong>`;
            commentElement.innerHTML = `
                <p>${authorHtml}: ${comment.content}</p>
                <span>${comment.timestamp}</span>
            `;
            commentsList.appendChild(commentElement);
        });
    };

    // 处理添加评论功能

    submitCommentDetail.addEventListener('click', () => {
        const currentUser = localStorage.getItem('loggedInUser');
        if (!currentUser) {
            alert('请先登录后再发表评论。');
            return;
        }
        const commentText = commentInputDetail.value.trim();
        const postId = getPostIdFromUrl();
        if (commentText && postId) {
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
                renderComments(post.comments);
                commentInputDetail.value = '';
            }
        } else {
            alert('评论内容不能为空。');
        }
    });

    editPostButton.addEventListener('click', () => {
        const postId = getPostIdFromUrl();
        window.location.href = `edit_post.html?id=${postId}`;
    });

    const postId = getPostIdFromUrl();
    if (postId) {
        renderPostDetail(postId);
    } else {
        postDetailContent.innerHTML = '<p>未指定动态ID。</p>';
    }
});