/**
 * 编辑个人资料页面JavaScript文件
 * 功能：处理用户个人资料的编辑和保存
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的主要元素
    const editProfileForm = document.getElementById('editProfileForm'); // 编辑资料表单
    const editNickname = document.getElementById('editNickname'); // 昵称输入框
    const editBio = document.getElementById('editBio'); // 简介输入框
    const editInterests = document.getElementById('editInterests'); // 兴趣标签输入框
    const editAvatar = document.getElementById('editAvatar'); // 头像URL输入框
    const editNicknameError = document.getElementById('editNicknameError'); // 昵称错误提示

    // 获取登录用户的ID（目前使用模拟数据）
    const loggedInUserId = localStorage.getItem('loggedInUser') || '20230001'; // 如果未登录则默认使用模拟用户
    let currentUser = getUserByStudentId(loggedInUserId); // 获取当前用户信息

    // 用当前用户数据填充表单
    if (currentUser) {
        editNickname.value = currentUser.nickname || ''; // 设置昵称
        editBio.value = currentUser.bio || ''; // 设置简介
        editInterests.value = currentUser.interests ? currentUser.interests.join(', ') : ''; // 设置兴趣标签（用逗号分隔）
        editAvatar.value = currentUser.avatar || ''; // 设置头像URL
    } else {
        alert('未找到用户信息，请先登录。');
        // 可选择重定向到登录页面
        // window.location.href = 'login.html';
    }

    // 编辑资料表单提交事件处理
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        let isValid = true; // 表单验证状态标志

        // 清除昵称错误信息
        editNicknameError.textContent = '';

        // 昵称验证
        if (editNickname.value.trim() === '') {
            editNicknameError.textContent = '昵称不能为空。';
            isValid = false;
        }

        // 如果验证通过且用户存在
        if (isValid && currentUser) {
            // 更新用户信息
            currentUser.nickname = editNickname.value.trim(); // 更新昵称
            currentUser.bio = editBio.value.trim(); // 更新简介
            currentUser.interests = editInterests.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''); // 更新兴趣标签
            currentUser.avatar = editAvatar.value.trim(); // 更新头像URL

            updateUser(currentUser); // 将更新后的用户数据保存到localStorage
            alert('个人资料更新成功！');
            window.location.href = `profile.html?id=${loggedInUserId}`; // 重定向到更新后的个人资料页面
        } else if (!currentUser) {
            alert('无法保存：未找到用户数据。');
        }
    });
});