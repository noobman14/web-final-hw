document.addEventListener('DOMContentLoaded', () => {
            const profileAvatar = document.getElementById('profileAvatar');
            const profileNickname = document.getElementById('profileNickname');
            const profileBio = document.getElementById('profileBio');
            const followingCount = document.getElementById('followingCount');
            const followersCount = document.getElementById('followersCount');
            const followButton = document.getElementById('followButton');
            const interestsList = document.getElementById('interestsList');
            const userPostsFeed = document.getElementById('userPostsFeed');
            const editProfileButton = document.getElementById('editProfileButton');

            // Function to get user ID from URL or default to logged-in user
            const getUserIdFromUrl = () => {
                const params = new URLSearchParams(window.location.search);
                return params.get('id') || localStorage.getItem('loggedInUser'); // Removed default mock user
            };

            const currentUserId = getUserIdFromUrl();
            let currentUser = currentUserId ? getUserByStudentId(currentUserId) : null;
            let isFollowing = false; // Mock follow status

            // Check if the profile being viewed is the current logged-in user's profile
            const isOwnProfile = localStorage.getItem('loggedInUser') === currentUserId;

            // Function to render user data
            const renderProfile = () => {
                    if (!currentUser) {
                        profileNickname.textContent = '请登录查看个人主页';
                        profileBio.textContent = '或在URL中指定用户ID，例如: profile.html?id=20230001';
                        profileAvatar.src = 'https://via.placeholder.com/100';
                        followingCount.textContent = '0';
                        followersCount.textContent = '0';
                        followButton.style.display = 'none'; // Hide follow button
                        editProfileButton.style.display = 'none'; // Hide edit button
                        interestsList.innerHTML = '<p>无兴趣标签。</p>';
                        userPostsFeed.innerHTML = '<p style="text-align: center;">暂无动态或需要登录。</p>';
                        return;
                    }

                    profileAvatar.src = currentUser.avatar || 'https://via.placeholder.com/100';
                    profileNickname.textContent = currentUser.nickname;
                    profileBio.textContent = currentUser.bio;
                    followingCount.textContent = currentUser.following || 0;
                    followersCount.textContent = currentUser.followers || 0;

                    // Show/Hide Edit Profile button based on whether it's the current user's profile
                    if (isOwnProfile) {
                        editProfileButton.style.display = 'block';
                        followButton.style.display = 'none'; // Hide follow button on own profile
                    } else {
                        editProfileButton.style.display = 'none';
                        // Only show follow button if there's a logged in user to follow from
                        if (getLoggedInUser()) {
                            followButton.style.display = 'block';
                        } else {
                            followButton.style.display = 'none';
                        }
                    }

                    interestsList.innerHTML = '';
                    if (currentUser.interests && currentUser.interests.length > 0) {
                        currentUser.interests.forEach(interest => {
                            const span = document.createElement('span');
                            span.textContent = interest;
                            interestsList.appendChild(span);
                        });
                    } else {
                        interestsList.innerHTML = '<p>暂无兴趣标签。</p>';
                    }

                    // Render posts
                    const userPosts = getPostsByAuthorId(currentUserId);
                    userPostsFeed.innerHTML = '';
                    if (userPosts.length > 0) {
                        userPosts.forEach(post => {
                                    const postElement = document.createElement('div');
                                    postElement.classList.add('post');
                                    let postImage = post.image ? `<img src="${post.image}" alt="Post Image">` : '';
                                    postElement.innerHTML = `
                    <h3><a href="post_detail.html?id=${post.id}">${post.content.substring(0, 50)}...</a></h3>
                    <p>${post.content}</p>
                    ${postImage}
                    <div class="post-meta">
                        <span>${post.likes}赞</span>
                        <span>${post.comments.length}评论</span>
                        <span>${post.timestamp}</span>
                    </div>
                    ${isOwnProfile ? `<div class="post-actions"><span class="delete-button" data-post-id="${post.id}">🗑️ 删除</span></div>` : ''}
                `;
                userPostsFeed.appendChild(postElement);
            });

            // Add event listeners for delete buttons in user posts
            if (isOwnProfile) {
                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const postId = parseInt(e.target.dataset.postId);
                        if (confirm('确定要删除这条动态吗？')) {
                            handleDeletePost(postId, renderProfile); // Call global delete function with renderProfile callback
                        }
                    });
                });
            }

        } else {
            userPostsFeed.innerHTML = '<p style="text-align: center;">暂无动态。</p>';
        }

        // Update follow button state (only if not own profile)
        if (!isOwnProfile) {
            // Check if there is a logged-in user to determine if following is possible
            if (getLoggedInUser()) {
                if (isFollowing) {
                    followButton.textContent = '已关注';
                    followButton.classList.add('following');
                } else {
                    followButton.textContent = '关注';
                    followButton.classList.remove('following');
                }
            } else {
                followButton.style.display = 'none'; // Hide follow button if no one is logged in
            }
        }
    };

    // Follow/Unfollow functionality
    // Only add event listener if a current user exists and it's not their own profile
    if (currentUser && !isOwnProfile && getLoggedInUser()) {
        followButton.addEventListener('click', () => {
            if (isFollowing) {
                // Simulate unfollow
                if (currentUser.followers > 0) currentUser.followers--;
                alert('已取消关注');
            } else {
                // Simulate follow
                currentUser.followers++;
                alert('关注成功');
            }
            isFollowing = !isFollowing;
            updateUser(currentUser); // Save changes to mock user data
            renderProfile(); // Re-render to update counts and button text
        });
    }

    // Edit Profile functionality
    if (isOwnProfile) {
        editProfileButton.addEventListener('click', () => {
            window.location.href = `edit_profile.html?id=${currentUserId}`;
        });
    }

    // Initial render
    renderProfile();

    // Listen for storage events to handle login/logout across tabs/windows
    window.addEventListener('storage', (e) => {
        if (e.key === 'loggedInUser' || e.key === 'userNickname') {
            // Re-evaluate currentUser and re-render profile when login state changes
            const currentUserId = getUserIdFromUrl();
            currentUser = currentUserId ? getUserByStudentId(currentUserId) : null;
            renderProfile();
        }
    });
});