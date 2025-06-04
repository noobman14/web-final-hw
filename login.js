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
            // Save studentId if "Remember Me" is checked
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberedStudentId', studentIdInput.value);
            } else {
                localStorage.removeItem('rememberedStudentId');
            }

            alert('登录成功！');
            // In a real application, you would authenticate with a backend
            window.location.href = 'index.html'; // Redirect to homepage after successful login
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