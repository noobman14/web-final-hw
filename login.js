/**
 * 用户登录页面JavaScript文件
 * 功能：处理用户登录验证、记住密码和忘记密码功能
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的主要元素
    const loginForm = document.getElementById('loginForm'); // 登录表单
    const studentIdInput = document.getElementById('studentId'); // 学号输入框
    const passwordInput = document.getElementById('password'); // 密码输入框
    const togglePasswordButton = document.getElementById('togglePassword'); // 显示密码复选框
    const rememberMeCheckbox = document.getElementById('rememberMe'); // 记住我复选框
    const forgotPasswordLink = document.getElementById('forgotPassword'); // 忘记密码链接
    const icon = document.querySelector('i');
    // 眼睛图标"显示密码"功能
    togglePasswordButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text'; // 显示密码
            togglePasswordButton.querySelector('i').classList.replace('fa-eye-slash','fa-eye');
        } else {
            passwordInput.type = 'password'; // 隐藏密码
            togglePasswordButton.querySelector('i').classList.replace('fa-eye','fa-eye-slash');
        }
    });

    // "记住我"功能
    // 如果存在保存的学号，则加载到输入框中
    if (localStorage.getItem('rememberedStudentId')) {
        studentIdInput.value = localStorage.getItem('rememberedStudentId');
        rememberMeCheckbox.checked = true; // 自动勾选记住我
    }

    // 登录表单提交事件处理
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        let isValid = true; // 表单验证状态标志

        // 清除之前的错误信息
        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

        // 学号基本验证
        if (studentIdInput.value.trim() === '') {
            document.getElementById('studentIdError').textContent = '学号不能为空。';
            isValid = false;
        }

        // 密码基本验证
        if (passwordInput.value.trim() === '') {
            document.getElementById('passwordError').textContent = '密码不能为空。';
            isValid = false;
        }

        // 如果基本验证通过
        if (isValid) {
            // 验证用户凭据
            let users = [];
            try {
                users = getUsers(); // 获取用户列表
            } catch (error) {
                console.error('Error getting users:', error);
                alert('加载用户信息失败，请稍后再试。');
                return;
            }

            // 查找匹配的用户
            const user = users.find(u => u.studentId === studentIdInput.value.trim() && u.password === passwordInput.value.trim());

            if (user) {
                // 如果勾选了"记住我"，保存学号
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedStudentId', studentIdInput.value);
                } else {
                    localStorage.removeItem('rememberedStudentId'); // 否则删除保存的学号
                }

                // 设置登录状态
                localStorage.setItem('loggedInUser', user.studentId); // 保存登录用户ID
                localStorage.setItem('userNickname', user.nickname); // 保存用户昵称

                alert('登录成功！');
                window.location.href = 'index.html'; // 登录成功后重定向到主页
            } else {
                alert('学号或密码错误，请重试。');
            }
        } else {
            alert('请检查您的输入。');
        }
    });

    // "忘记密码"链接事件处理
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault(); // 阻止默认链接行为
        alert('忘记密码功能正在开发中，请联系管理员重置密码。');
    });
});