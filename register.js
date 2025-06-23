/**
 * 用户注册页面JavaScript文件
 * 功能：处理用户注册表单验证和提交
 * 作者：校园生活交友平台开发团队
 * 版本：2.1
 */

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const nicknameInput = document.getElementById('nickname');
    const bioInput = document.getElementById('bio');
    const interestsInput = document.getElementById('interests');
    const avatarUrlInput = document.getElementById('avatarUrl');
    const avatarFileInput = document.getElementById('avatarFile');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    // 实时学号验证
    studentIdInput.addEventListener('input', (e) => {
        const studentId = e.target.value;
        const errorElement = document.getElementById('studentIdError');

        if (studentId.length > 0 && !/^\d*$/.test(studentId)) {
            errorElement.textContent = '学号只能包含数字';
        } else if (studentId.length > 0 && studentId.length < 10) {
            errorElement.textContent = '学号不足10位';
        } else if (studentId.length > 10) {
            errorElement.textContent = '学号不能超过10位';
        } else {
            errorElement.textContent = '';
        }
    });

    // 实时密码验证
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const errorElement = document.getElementById('passwordError');

        if (password.length > 0 && password.length < 8) {
            errorElement.textContent = '密码至少需要8个字符';
        } else if (password.length >= 8 && !/[A-Z]/.test(password)) {
            errorElement.textContent = '密码必须包含至少一个大写字母';
        } else {
            errorElement.textContent = '';
        }

        // 触发密码确认验证
        if (confirmPasswordInput.value.length > 0) {
            confirmPasswordInput.dispatchEvent(new Event('input'));
        }
    });

    // 实时密码匹配验证
    confirmPasswordInput.addEventListener('input', (e) => {
        const confirmPassword = e.target.value;
        const password = passwordInput.value;
        const errorElement = document.getElementById('confirmPasswordError');

        if (confirmPassword.length > 0 && password !== confirmPassword) {
            errorElement.textContent = '两次输入的密码不一致';
        } else {
            errorElement.textContent = '';
        }
    });

    // 实时昵称验证
    nicknameInput.addEventListener('input', (e) => {
        const nickname = e.target.value;
        const errorElement = document.getElementById('nicknameError');

        if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]{0,20}$/.test(nickname)) {
            errorElement.textContent = '只能包含中文、字母、数字和下划线';
        } else if (nickname.length > 20) {
            errorElement.textContent = '昵称不能超过20个字符';
        } else {
            errorElement.textContent = '';
        }
    });

    /**
     * 设置密码可见性切换功能
     * @param {HTMLInputElement} inputEl - 密码输入框
     * @param {HTMLButtonElement} buttonEl - 切换按钮
     */
    const setupPasswordToggle = (inputEl, buttonEl) => {
        // 点击输入框时显示图标
        inputEl.addEventListener('focus', () => {
            buttonEl.style.visibility = 'visible';
        });

        // 离开输入框时隐藏图标
        inputEl.addEventListener('blur', () => {
            buttonEl.style.visibility = 'hidden';
        });

        // 点击图标切换密码可见性
        buttonEl.addEventListener('mousedown', (e) => {
            e.preventDefault(); // 防止输入框失焦
            const icon = buttonEl.querySelector('i');
            if (inputEl.type === 'password') {
                inputEl.type = 'text';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                inputEl.type = 'password';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });
    };

    // 为两个密码框设置切换功能
    if (passwordInput && togglePassword) {
        setupPasswordToggle(passwordInput, togglePassword);
    }
    if (confirmPasswordInput && toggleConfirmPassword) {
        setupPasswordToggle(confirmPasswordInput, toggleConfirmPassword);
    }

    // 表单提交验证
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // 学号最终验证
        const studentId = studentIdInput.value;
        if (!/^\d{10}$/.test(studentId)) {
            showError('studentIdError', '学号必须是10位数字');
            isValid = false;
        }

        // 密码最终验证
        const password = passwordInput.value;
        if (password.length < 8) {
            showError('passwordError', '密码至少需要8个字符');
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            showError('passwordError', '密码必须包含至少一个大写字母');
            isValid = false;
        }

        // 密码匹配最终验证
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) {
            showError('confirmPasswordError', '两次输入的密码不一致');
            isValid = false;
        }

        // 昵称最终验证
        const nickname = nicknameInput.value;
        if (nickname.trim() === '') {
            showError('nicknameError', '昵称不能为空');
            isValid = false;
        } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$/.test(nickname)) {
            showError('nicknameError', '昵称只能包含中文、字母、数字和下划线(2-20位)');
            isValid = false;
        }

        if (isValid) {
            registerUser({
                studentId: studentIdInput.value,
                password: passwordInput.value,
                nickname: nicknameInput.value,
                bio: bioInput.value,
                interests: interestsInput.value,
            });
        } else {
            alert('请检查您的输入是否正确');
        }
    });

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
    }

    function registerUser(userData) {
        try {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.studentId === userData.studentId)) {
                alert('该学号已注册，请直接登录');
                return;
            }
            // 头像处理
            let avatar = 'pic/avatar/defaultava.png';
            if (avatarFileInput && avatarFileInput.files.length > 0) {
                avatar = 'pic/avatar/' + avatarFileInput.files[0].name;
            } else if (avatarUrlInput && avatarUrlInput.value.trim()) {
                avatar = avatarUrlInput.value.trim();
            }

            const interests = userData.interests ? userData.interests.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

            const newUser = {
                studentId: userData.studentId,
                password: userData.password,
                nickname: userData.nickname,
                bio: userData.bio,
                interests: interests,
                avatar,
                friends: [],
                followers: []
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('注册成功！即将跳转到登录页面');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('注册失败:', error);
            alert('注册失败，请稍后重试');
        }
    }
});