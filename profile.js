/**
 * 个人资料页面JavaScript文件
 * 功能：显示用户个人资料、动态列表、关注功能和编辑资料
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

function highlightHashtags(text) {
    return text.replace(/#([\u4e00-\u9fa5\w]+)/g, '<span class="hashtag">#$1</span>');
}

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
            // 获取页面中的主要元素
            const profileAvatar = document.getElementById('profileAvatar'); // 用户头像
            const profileNickname = document.getElementById('profileNickname'); // 用户昵称
            const profileBio = document.getElementById('profileBio'); // 用户简介
            const followingCount = document.getElementById('followingCount'); // 关注数
            const followersCount = document.getElementById('followersCount'); // 粉丝数
            const followButton = document.getElementById('followButton'); // 关注按钮
            const interestsList = document.getElementById('interestsList'); // 兴趣标签列表
            const userPostsFeed = document.getElementById('userPostsFeed'); // 用户动态列表
            const editProfileButton = document.getElementById('editProfileButton'); // 编辑资料按钮
            const messageButton = document.getElementById('messageButton'); // 私信按钮

            /**
             * 从URL参数中获取用户ID，如果没有则默认为当前登录用户
             * @returns {string} 用户ID
             */
            const getUserIdFromUrl = () => {
                const params = new URLSearchParams(window.location.search); // 解析URL参数
                return params.get('user') || params.get('id') || localStorage.getItem('loggedInUser'); // 优先user参数
            };

            // 渲染用户资料信息，每次都获取最新数据
            const renderProfile = () => {
                    const currentUserId = getUserIdFromUrl();
                    const currentUser = currentUserId ? getUserByStudentId(currentUserId) : null;
                    const isOwnProfile = localStorage.getItem('loggedInUser') === currentUserId;
                    if (!currentUser) {
                        profileNickname.textContent = '请登录查看个人主页';
                        profileBio.textContent = '或在URL中指定用户ID，例如: profile.html?id=20230001';
                        profileAvatar.src = 'https://via.placeholder.com/100';
                        followingCount.textContent = '0';
                        followersCount.textContent = '0';
                        followButton.style.display = 'none';
                        editProfileButton.style.display = 'none';
                        messageButton.style.display = 'none';
                        interestsList.innerHTML = '<p>无兴趣标签。</p>';
                        userPostsFeed.innerHTML = '<p style="text-align: center;">暂无动态或需要登录。</p>';
                        return;
                    }
                    profileAvatar.src = currentUser.avatar || 'https://via.placeholder.com/100';
                    profileNickname.textContent = currentUser.nickname;
                    profileBio.textContent = currentUser.bio;
                    if (Array.isArray(currentUser.friends)) {
                        followingCount.textContent = currentUser.friends.length;
                    } else {
                        followingCount.textContent = '0';
                    }
                    if (Array.isArray(currentUser.followers)) {
                        followersCount.textContent = currentUser.followers.length;
                    } else {
                        followersCount.textContent = '0';
                    }
                    if (isOwnProfile) {
                        editProfileButton.style.display = 'block';
                        followButton.style.display = 'none';
                        messageButton.style.display = 'none';
                    } else {
                        editProfileButton.style.display = 'none';
                        if (getLoggedInUser()) {
                            followButton.style.display = 'block';
                            messageButton.style.display = 'block';
                        } else {
                            followButton.style.display = 'none';
                            messageButton.style.display = 'none';
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
                    // 渲染用户动态列表
                    const allVisiblePosts = getVisiblePostsForUser();
                    const userPosts = allVisiblePosts.filter(post => post.authorId === currentUserId);
                    userPostsFeed.innerHTML = '';
                    if (userPosts.length > 0) {
                        userPosts.forEach(post => {
                                    const postElement = document.createElement('div');
                                    postElement.classList.add('post');
                                    let postImage = post.image ? `<img src="${post.image}" alt="Post Image">` : '';
                                    const highlightedContent = highlightHashtags(post.content);
                                    postElement.innerHTML = `
                    <h3><a href="post_detail.html?id=${post.id}">${post.content.substring(0, 50)}...</a></h3>
                    <p>${highlightedContent}</p>
                    ${postImage}
                    <div class="post-meta">
                        <span>${post.likes}赞</span>
                        <span>${post.comments.length}评论</span>
                        <span>${post.timestamp}</span>
                    </div>
                    ${isOwnProfile ? `<div class="post-actions"><span class="delete-button" data-post-id="${post.id}">🗑️ 删除</span>
                    <span class="edit-button" data-post-id="${post.id}">✏️ 编辑</span>
                    </div>` : ''}
                `;
                userPostsFeed.appendChild(postElement);
            });
            if (isOwnProfile) {
                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const postId = parseInt(e.target.dataset.postId);
                        if (confirm('确定要删除这条动态吗？')) {
                            handleDeletePost(postId, renderProfile);
                        }
                    });
                });
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const postId = parseInt(e.target.dataset.postId);
                        window.location.href = `edit_post.html?id=${postId}`;
                    });
                });
            }
        } else {
            userPostsFeed.innerHTML = '<p style="text-align: center;">暂无动态。</p>';
        }
        // 更新关注按钮状态
        if (!isOwnProfile) {
            if (getLoggedInUser()) {
                if (checkIsFollowing(currentUserId, isOwnProfile)) {
                    followButton.textContent = '已关注';
                    followButton.classList.add('following');
                } else {
                    followButton.textContent = '关注';
                    followButton.classList.remove('following');
                }
            } else {
                followButton.style.display = 'none';
            }
        }
        // 关注/取消关注功能
        if (currentUser && !isOwnProfile && getLoggedInUser()) {
            followButton.onclick = () => handleFollowToggle(currentUserId, isOwnProfile, renderProfile);
            messageButton.onclick = () => {
                window.location.href = `chat.html?with=${currentUserId}`;
            };
        }
        // 编辑资料功能
        if (isOwnProfile) {
            editProfileButton.onclick = () => {
                window.location.href = `edit_profile.html?id=${currentUserId}`;
            };
        }
    };

    // 判断当前登录用户是否已关注该用户
    function checkIsFollowing(currentUserId, isOwnProfile) {
        const loggedInUserId = getLoggedInUser();
        if (!loggedInUserId || isOwnProfile) return false;
        const loggedInUser = getUserByStudentId(loggedInUserId);
        if (!loggedInUser) return false;
        if (!Array.isArray(loggedInUser.friends)) return false;
        return loggedInUser.friends.includes(currentUserId);
    }

    // 关注/取关功能
    function handleFollowToggle(currentUserId, isOwnProfile, renderProfile) {
        const loggedInUserId = getLoggedInUser();
        if (!loggedInUserId || isOwnProfile) return;
        const loggedInUser = getUserByStudentId(loggedInUserId);
        const targetUser = getUserByStudentId(currentUserId);
        if (!loggedInUser || !targetUser) return;
        if (!Array.isArray(loggedInUser.friends)) loggedInUser.friends = [];
        if (!Array.isArray(targetUser.followers)) targetUser.followers = [];
        let changed = false;
        if (checkIsFollowing(currentUserId, isOwnProfile)) {
            // 取关
            loggedInUser.friends = loggedInUser.friends.filter(id => id !== currentUserId);
            targetUser.followers = targetUser.followers.filter(id => id !== loggedInUserId);
            changed = true;
            alert('已取消关注');
        } else {
            // 关注
            loggedInUser.friends.push(currentUserId);
            targetUser.followers.push(loggedInUserId);
            changed = true;
            alert('关注成功');
        }
        if (changed) {
            updateUser(loggedInUser);
            updateUser(targetUser);
            renderProfile();
        }
    }

    // 初始渲染
    renderProfile();

    // 监听存储事件以处理跨标签页/窗口的登录/登出
    window.addEventListener('storage', (e) => {
        if (e.key === 'loggedInUser' || e.key === 'userNickname') {
            renderProfile();
        }
    });
});