/**
 * 用户注册页面JavaScript文件
 * 功能：处理用户注册表单验证和提交
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取注册表单元素
    const registerForm = document.getElementById('registerForm');

    // 为注册表单添加提交事件监听器
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        let isValid = true; // 表单验证状态标志

        // 清除之前的错误信息
        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

        // 学号验证（示例：必须是8位数字）
        const studentId = document.getElementById('studentId').value;
        if (!/^[0-9]{8}$/.test(studentId)) {
            document.getElementById('studentIdError').textContent = '学号必须是8位数字。';
            isValid = false;
        }

        // 密码验证（示例：至少6个字符）
        const password = document.getElementById('password').value;
        if (password.length < 6) {
            document.getElementById('passwordError').textContent = '密码至少需要6个字符。';
            isValid = false;
        }

        // 确认密码验证
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = '两次输入的密码不一致。';
            isValid = false;
        }

        // 昵称验证（示例：不能为空）
        const nickname = document.getElementById('nickname').value;
        if (nickname.trim() === '') {
            document.getElementById('nicknameError').textContent = '昵称不能为空。';
            isValid = false;
        }

        // 如果所有验证都通过
        if (isValid) {
            alert('注册成功！');
            // 在实际应用中，您会将此数据发送到后端服务器
            // 对于此模拟，我们可以重定向到登录页面或主页
            window.location.href = 'index.html'; // 注册成功后重定向到主页
        } else {
            alert('请检查您的输入。');
        }
    });
});