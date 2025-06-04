document.addEventListener('DOMContentLoaded', () => {
            // Removed updateNavigation as it's now in common.js
            const feedSection = document.querySelector('.feed');

            // Function to render posts
            const renderPosts = () => {
                    const posts = getPosts(); // Get posts from data.js
                    const loggedInUser = getLoggedInUser();
                    feedSection.innerHTML = '<h2>最新动态</h2>'; // Clear existing content

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

                                postElement.innerHTML = `
                <div class="post-header">
                    <img src="${author ? author.avatar : 'https://via.placeholder.com/50'}" alt="Avatar" class="post-avatar" onerror="this.onerror=null; this.src='pic/default.png';">
                    <h3><a href="profile.html?id=${post.authorId}">${author ? author.nickname : '未知用户'}</a></h3>
                </div>
                <p><a href="post_detail.html?id=${post.id}">${post.content}</a></p>
                ${postImage}
                <div class="post-actions">
                    <span class="like-button" data-post-id="${post.id}">👍 ${post.likes}</span>
                    <span class="comment-button" data-post-id="${post.id}">💬 ${post.comments.length}</span>
                    <span class="timestamp">${post.timestamp}</span>
                    ${isCurrentUserAuthor ? `<span class="delete-button" data-post-id="${post.id}">🗑️ 删除</span>` : ''}
                </div>
                <div class="comments-section" id="comments-${post.id}">
                    <!-- Comments will be loaded here -->
                </div>
                <div class="add-comment">
                    <input type="text" class="comment-input" data-post-id="${post.id}" placeholder="添加评论...">
                    <button class="submit-comment" data-post-id="${post.id}">评论</button>
                </div>
            `;
            feedSection.appendChild(postElement);
        });

        // Add event listeners for like and comment buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                handleLike(postId, renderPosts); // Pass renderPosts as callback
            });
        });

        document.querySelectorAll('.submit-comment').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
                const commentText = commentInput.value.trim();
                if (commentText) {
                    handleAddComment(postId, commentText, (id, comments) => renderComments(`comments-${id}`, comments)); // Pass renderComments as callback
                    commentInput.value = ''; // Clear input
                }
            });
        });

        document.querySelectorAll('.comment-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                toggleComments(`comments-${postId}`); // Pass commentsContainerId
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId);
                if (confirm('确定要删除这条动态吗？')) {
                    handleDeletePost(postId, renderPosts); // Pass renderPosts as callback
                }
            });
        });

        // Render all comments initially (or only when clicked)
        posts.forEach(post => renderComments(`comments-${post.id}`, post.comments));
    };

    // Initial render of posts when the page loads
    renderPosts();
});