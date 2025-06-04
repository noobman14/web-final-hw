document.addEventListener('DOMContentLoaded', () => {
    const editProfileForm = document.getElementById('editProfileForm');
    const editNickname = document.getElementById('editNickname');
    const editBio = document.getElementById('editBio');
    const editInterests = document.getElementById('editInterests');
    const editAvatar = document.getElementById('editAvatar');
    const editNicknameError = document.getElementById('editNicknameError');

    // Get the logged-in user's ID (mocking for now)
    const loggedInUserId = localStorage.getItem('loggedInUser') || '20230001'; // Default to a mock user if not logged in
    let currentUser = getUserByStudentId(loggedInUserId);

    // Populate form with current user data
    if (currentUser) {
        editNickname.value = currentUser.nickname || '';
        editBio.value = currentUser.bio || '';
        editInterests.value = currentUser.interests ? currentUser.interests.join(', ') : '';
        editAvatar.value = currentUser.avatar || '';
    } else {
        alert('未找到用户信息，请先登录。');
        // Optionally redirect to login page
        // window.location.href = 'login.html';
    }

    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        editNicknameError.textContent = '';

        if (editNickname.value.trim() === '') {
            editNicknameError.textContent = '昵称不能为空。';
            isValid = false;
        }

        if (isValid && currentUser) {
            currentUser.nickname = editNickname.value.trim();
            currentUser.bio = editBio.value.trim();
            currentUser.interests = editInterests.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            currentUser.avatar = editAvatar.value.trim();

            updateUser(currentUser); // Save updated user data to localStorage
            alert('个人资料更新成功！');
            window.location.href = `profile.html?id=${loggedInUserId}`; // Redirect to updated profile page
        } else if (!currentUser) {
            alert('无法保存：未找到用户数据。');
        }
    });
});