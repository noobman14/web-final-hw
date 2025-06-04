document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

        // Student ID validation (example: must be 8 digits)
        const studentId = document.getElementById('studentId').value;
        if (!/^[0-9]{8}$/.test(studentId)) {
            document.getElementById('studentIdError').textContent = '学号必须是8位数字。';
            isValid = false;
        }

        // Password validation (example: min 6 characters)
        const password = document.getElementById('password').value;
        if (password.length < 6) {
            document.getElementById('passwordError').textContent = '密码至少需要6个字符。';
            isValid = false;
        }

        // Confirm Password validation
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = '两次输入的密码不一致。';
            isValid = false;
        }

        // Nickname validation (example: not empty)
        const nickname = document.getElementById('nickname').value;
        if (nickname.trim() === '') {
            document.getElementById('nicknameError').textContent = '昵称不能为空。';
            isValid = false;
        }

        if (isValid) {
            alert('注册成功！');
            // In a real application, you would send this data to a backend server
            // For this simulation, we can redirect to a login page or homepage
            window.location.href = 'index.html'; // Redirect to homepage after successful registration
        } else {
            alert('请检查您的输入。');
        }
    });
});