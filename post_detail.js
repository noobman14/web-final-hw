document.addEventListener('DOMContentLoaded', () => {
    const postDetailContent = document.getElementById('postDetailContent');
    const commentsList = document.getElementById('commentsList');
    const commentInputDetail = document.getElementById('commentInputDetail');
    const submitCommentDetail = document.getElementById('submitCommentDetail');
    const editPostButton = document.getElementById('editPostButton');

    const checkLogin = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            postDetailContent.innerHTML = '<p>请先登录后再查看动态详情。</p>';
            commentsList.innerHTML = '';
            commentInputDetail.style.display = 'none';
            submitCommentDetail.style.display = 'none';
            return false;
        }
        return true;
    };


    function highlightHashtags(text) {
        return text.replace(/#([\u4e00-\u9fa5\w]+)/g, '<span class="hashtag">#$1</span>');
    }

    const getPostIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    };

    const renderPostDetail = (postId) => {
        if (!checkLogin()) return;

        const posts = getPosts();
        const post = posts.find(p => p.id === postId);

        if (!post) {
            postDetailContent.innerHTML = '<p>动态未找到。</p>';
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
                    <h3><a href="profile.html?id=${post.authorId}">${author ? author.nickname : '未知用户'}</a></h3>
                </div>
                <h2>${post.content.substring(0, 50)}...</h2>
                <p>${highlightedContent}</p>
                ${postImage}
                <div class="post-detail-meta">
                    <span>👍 ${post.likes}</span>
                    <span>💬 ${post.comments.length}</span>
                    <span>${post.timestamp}</span>
                </div>
            </div>
        `;

        renderComments(post.comments);

        const loggedInUser = localStorage.getItem('loggedInUser');
        if (post.authorId === loggedInUser) {
            editPostButton.style.display = 'block';
        } else {
            editPostButton.style.display = 'none';
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
            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong>: ${comment.content}</p>
                <span>${comment.timestamp}</span>
            `;
            commentsList.appendChild(commentElement);
        });
    };

    submitCommentDetail.addEventListener('click', () => {
        const commentText = commentInputDetail.value.trim();
        const postId = getPostIdFromUrl();
        if (commentText && postId) {
            let posts = getPosts();
            const post = posts.find(p => p.id === postId);

            if (post) {
                const currentUser = localStorage.getItem('loggedInUser');
                const author = getUserByStudentId(currentUser || 'Guest');
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
