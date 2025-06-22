/**
 * 用户登录页面JavaScript文件
 * 功能：处理用户登录验证、记住密码和忘记密码功能
 * 作者：校园生活交友平台开发团队
 * 版本：1.1 (修复重复弹窗问题并优化代码结构)
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的主要元素
    const loginForm = document.getElementById('loginForm');
    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    // 显示/隐藏密码功能
    togglePasswordButton.type = 'button';
    togglePasswordButton.addEventListener('click', (e) => {
        e.preventDefault();
        const isPasswordVisible = passwordInput.type === 'text';
        passwordInput.type = isPasswordVisible ? 'password' : 'text';
        const icon = togglePasswordButton.querySelector('i');
        icon.classList.toggle('fa-eye', !isPasswordVisible);
        icon.classList.toggle('fa-eye-slash', isPasswordVisible);
    });

    // "记住我"功能初始化
    if (localStorage.getItem('rememberedStudentId')) {
        studentIdInput.value = localStorage.getItem('rememberedStudentId');
        rememberMeCheckbox.checked = true;
    }

    // 回车键提交表单
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.requestSubmit();
        }
    });

    // 登录表单提交处理
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

        const studentId = studentIdInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        if (!studentId) {
            document.getElementById('studentIdError').textContent = '学号不能为空。';
            isValid = false;
        }

        if (!password) {
            document.getElementById('passwordError').textContent = '密码不能为空。';
            isValid = false;
        }

        if (!isValid) {
            showAlert('请检查您的输入。');
            return;
        }

        try {
            const users = await getUsers();
            const user = users.find(u => u.studentId === studentId && u.password === password);

            if (user) {
                if (user.isActive === false) {
                    showAlert('您的账号已被封禁，无法登录。');
                    return; // 阻止继续登录
                }
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedStudentId', studentId);
                } else {
                    localStorage.removeItem('rememberedStudentId');
                }
                localStorage.setItem('loggedInUser', user.studentId);
                localStorage.setItem('userNickname', user.nickname);

                showAlert('登录成功！', () => {
                    window.location.href = 'index.html';
                });
            } else {
                showAlert('学号或密码错误，请重试。');
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
            showAlert('加载用户信息失败，请稍后再试。');
        }
    });


    // "忘记密码"链接事件处理
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAlert('忘记密码功能正在开发中，请联系管理员重置密码。');
    });

    /**
     * 显示提示消息
     * @param {string} message 提示消息内容
     * @param {function} [callback] 回调函数
     */
    function showAlert(message, callback) {
        // 这里可以使用更优雅的通知方式替代alert
        alert(message);
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
});