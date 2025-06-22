/**
 * 个人资料页面JavaScript文件
 * 功能：显示用户个人资料、动态列表、关注功能和编辑资料
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

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

            /**
             * 从URL参数中获取用户ID，如果没有则默认为当前登录用户
             * @returns {string} 用户ID
             */
            const getUserIdFromUrl = () => {
                const params = new URLSearchParams(window.location.search); // 解析URL参数
                return params.get('id') || localStorage.getItem('loggedInUser'); // 获取用户ID或当前登录用户
            };

            const currentUserId = getUserIdFromUrl(); // 获取当前查看的用户ID
            let currentUser = currentUserId ? getUserByStudentId(currentUserId) : null; // 获取用户信息
            let isFollowing = false; // 关注状态（模拟数据）

            // 检查当前查看的是否是登录用户自己的资料页面
            const isOwnProfile = localStorage.getItem('loggedInUser') === currentUserId;

            /**
             * 渲染用户资料信息
             */
            const renderProfile = () => {
                    if (!currentUser) {
                        // 如果用户不存在，显示提示信息
                        profileNickname.textContent = '请登录查看个人主页';
                        profileBio.textContent = '或在URL中指定用户ID，例如: profile.html?id=20230001';
                        profileAvatar.src = 'https://via.placeholder.com/100';
                        followingCount.textContent = '0';
                        followersCount.textContent = '0';
                        followButton.style.display = 'none'; // 隐藏关注按钮
                        editProfileButton.style.display = 'none'; // 隐藏编辑按钮
                        interestsList.innerHTML = '<p>无兴趣标签。</p>';
                        userPostsFeed.innerHTML = '<p style="text-align: center;">暂无动态或需要登录。</p>';
                        return;
                    }

                    // 设置用户基本信息
                    profileAvatar.src = currentUser.avatar || 'https://via.placeholder.com/100';
                    profileNickname.textContent = currentUser.nickname;
                    profileBio.textContent = currentUser.bio;
                    followingCount.textContent = currentUser.following || 0;
                    followersCount.textContent = currentUser.followers || 0;

                    // 根据是否为用户自己的资料页面显示/隐藏编辑按钮
                    if (isOwnProfile) {
                        editProfileButton.style.display = 'block';
                        followButton.style.display = 'none'; // 在自己的资料页面隐藏关注按钮
                    } else {
                        editProfileButton.style.display = 'none';
                        // 只有在有登录用户的情况下才显示关注按钮
                        if (getLoggedInUser()) {
                            followButton.style.display = 'block';
                        } else {
                            followButton.style.display = 'none';
                        }
                    }

                    // 渲染兴趣标签
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
                    const userPosts = getPostsByAuthorId(currentUserId); // 获取用户的动态
                    userPostsFeed.innerHTML = '';
                    if (userPosts.length > 0) {
                        userPosts.forEach(post => {
                                    const postElement = document.createElement('div');
                                    postElement.classList.add('post');
                                    let postImage = post.image ? `<img src="${post.image}" alt="Post Image">` : ''; // 处理动态图片
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

            // 为用户动态的删除按钮添加事件监听器
            if (isOwnProfile) {
                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const postId = parseInt(e.target.dataset.postId);
                        if (confirm('确定要删除这条动态吗？')) {
                            handleDeletePost(postId, renderProfile); // 调用全局删除函数，传入重新渲染回调
                        }
                    });
                });
            }
        } else {
            userPostsFeed.innerHTML = '<p style="text-align: center;">暂无动态。</p>';
        }

        // 更新关注按钮状态（仅当不是自己的资料页面时）
        if (!isOwnProfile) {
            // 检查是否有登录用户来确定是否可以关注
            if (getLoggedInUser()) {
                if (isFollowing) {
                    followButton.textContent = '已关注';
                    followButton.classList.add('following');
                } else {
                    followButton.textContent = '关注';
                    followButton.classList.remove('following');
                }
            } else {
                followButton.style.display = 'none'; // 如果没有登录用户则隐藏关注按钮
            }
        }
    };

    // 关注/取消关注功能
    // 只有当当前用户存在且不是自己的资料页面时才添加事件监听器
    if (currentUser && !isOwnProfile && getLoggedInUser()) {
        followButton.addEventListener('click', () => {
            if (isFollowing) {
                // 模拟取消关注
                if (currentUser.followers > 0) currentUser.followers--;
                alert('已取消关注');
            } else {
                // 模拟关注
                currentUser.followers++;
                alert('关注成功');
            }
            isFollowing = !isFollowing; // 切换关注状态
            updateUser(currentUser); // 保存更改到模拟用户数据
            renderProfile(); // 重新渲染以更新计数和按钮文本
        });
    }

    // 编辑资料功能
    if (isOwnProfile) {
        editProfileButton.addEventListener('click', () => {
            window.location.href = `edit_profile.html?id=${currentUserId}`; // 跳转到编辑资料页面
        });
    }

    // 初始渲染
    renderProfile();

    // 监听存储事件以处理跨标签页/窗口的登录/登出
    window.addEventListener('storage', (e) => {
        if (e.key === 'loggedInUser' || e.key === 'userNickname') {
            // 当登录状态改变时重新评估当前用户并重新渲染资料页面
            const currentUserId = getUserIdFromUrl();
            currentUser = currentUserId ? getUserByStudentId(currentUserId) : null;
            renderProfile();
        }
    });
});