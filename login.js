document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    // "Show Password" functionality
    showPasswordCheckbox.addEventListener('change', () => {
        if (showPasswordCheckbox.checked) {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });

    // "Remember Me" functionality
    // Load saved studentId if present
    if (localStorage.getItem('rememberedStudentId')) {
        studentIdInput.value = localStorage.getItem('rememberedStudentId');
        rememberMeCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

        // Basic validation for student ID
        if (studentIdInput.value.trim() === '') {
            document.getElementById('studentIdError').textContent = '学号不能为空。';
            isValid = false;
        }

        // Basic validation for password
        if (passwordInput.value.trim() === '') {
            document.getElementById('passwordError').textContent = '密码不能为空。';
            isValid = false;
        }

        if (isValid) {
            // Verify user credentials
            let users = [];
            try {
                users = getUsers();
            } catch (error) {
                console.error('Error getting users:', error);
                alert('加载用户信息失败，请稍后再试。');
                return;
            }

            const user = users.find(u => u.studentId === studentIdInput.value.trim() && u.password === passwordInput.value.trim());

            if (user) {
                // Save studentId if "Remember Me" is checked
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedStudentId', studentIdInput.value);
                } else {
                    localStorage.removeItem('rememberedStudentId');
                }

                // Set login status
                localStorage.setItem('loggedInUser', user.studentId);
                localStorage.setItem('userNickname', user.nickname);

                alert('登录成功！');
                window.location.href = 'index.html'; // Redirect to homepage after successful login
            } else {
                alert('学号或密码错误，请重试。');
            }
        } else {
            alert('请检查您的输入。');
        }
    });

    // "Forgot Password" link
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('忘记密码功能正在开发中，请联系管理员重置密码。');
    });
});