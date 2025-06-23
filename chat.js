document.addEventListener('DOMContentLoaded', () => {
    const chatWithUserTitle = document.getElementById('chatWithUser');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    // 从URL获取私信对象的用户ID
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('with');

    if (userId) {
        const user = getUserByStudentId(userId);
        if (user) {
            chatWithUserTitle.textContent = `与 ${user.nickname} 的私信`;
        }
    }

    // 发送按钮的点击事件
    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            // 这里可以添加将消息显示在界面上的逻辑，但功能本身是禁用的
            console.log(`Attempted to send: ${message}`);
        }
        alert('私信功能正在开发中，敬请期待！');
    });

    // 可以在输入框中按回车键发送
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });
});