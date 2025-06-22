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
            const studentId = getStudentIdByNickname(comment.author);
            //這裏添加點擊評論名字能進入主頁的功能
            const authorHtml = studentId 
                ? `<a href="profile.html?user=${studentId}"><strong>${comment.author}</strong></a>`
                : `<strong>${comment.author}</strong>`;
            commentElement.innerHTML = `
                <p>${authorHtml}: ${comment.content}</p>
                <span>${comment.timestamp}</span>
            `;
            commentsList.appendChild(commentElement);
        });
    };

    // 处理添加评论功能

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
