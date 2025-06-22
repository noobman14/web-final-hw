// 权限检查
// 权限检查
const loggedInUserId = localStorage.getItem('loggedInUser');
if (!loggedInUserId) {
    alert('请先登录！');
    window.location.href = 'login.html';
} else {
    const users = getUsers();
    const currentUser = users.find(user => user.studentId === loggedInUserId);
    if (!currentUser || currentUser.role !== 'admin') {
        alert('无权访问管理员页面！');
        window.location.href = 'login.html';
    }
}

// DOM元素
const elements = {
    tableBody: document.querySelector('#userTable tbody'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    totalUsers: document.getElementById('totalUsers'),
    activeUsers: document.getElementById('activeUsers'),
    bannedUsers: document.getElementById('bannedUsers'),
    confirmModal: document.getElementById('confirmModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    confirmCancel: document.getElementById('confirmCancel'),
    confirmOk: document.getElementById('confirmOk')
};

// 状态管理
let state = {
    currentAction: null,
    selectedUserId: null
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupEventListeners();
});

// 主数据加载函数
function loadUserData(filter = '') {
    const users = getUsers().map(user => ({
        ...user,
        registerTime: user.registerTime || '2025-01-01' // 默认注册时间
    }));

    // 过滤用户
    const filteredUsers = filter ?
        users.filter(u =>
            u.studentId.includes(filter) ||
            u.nickname.toLowerCase().includes(filter.toLowerCase())
        ) : users;

    // 更新统计和表格
    updateStatistics(users);
    renderUserTable(filteredUsers);
}

// 渲染用户表格
function renderUserTable(users) {
    elements.tableBody.innerHTML = users.map(user => `
        <tr data-id="${user.studentId}">
            <td>${user.studentId}</td>
            <td>${user.nickname}</td>
            <td>${user.registerTime}</td>
            <td class="${user.isActive !== false ? 'status-active' : 'status-banned'}">
                ${user.isActive !== false ? '✅ 正常' : '❌ 封禁'}
            </td>
            <td class="action-btns">
                <button class="btn ${user.isActive !== false ? 'btn-danger' : 'btn-success'} ban-btn">
                    ${user.isActive !== false ? '封禁' : '解封'}
                </button>
                <button class="btn btn-primary reset-btn">重置密码</button>
                <button class="btn view-btn">查看详情</button>
            </td>
        </tr>
    `).join('');
}

// 更新统计卡片
function updateStatistics(users) {
    elements.totalUsers.textContent = users.length;
    elements.activeUsers.textContent = users.filter(u => u.isActive !== false).length;
    elements.bannedUsers.textContent = users.filter(u => u.isActive === false).length;
}

// 事件监听设置
function setupEventListeners() {
    // 搜索功能
    elements.searchBtn.addEventListener('click', () => searchUsers());
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchUsers();
    });

    // 刷新
    elements.refreshBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        loadUserData();
    });

    // 登出
    elements.logoutBtn.addEventListener('click', logout);

    // 表格操作按钮
    elements.tableBody.addEventListener('click', handleTableActions);

    // 模态框按钮
    elements.confirmCancel.addEventListener('click', hideModal);
    elements.confirmOk.addEventListener('click', confirmAction);
}

// 搜索用户
function searchUsers() {
    loadUserData(elements.searchInput.value.trim());
}

// 表格操作处理
function handleTableActions(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    state.selectedUserId = row.dataset.id;
    const user = getUsers().find(u => u.studentId === state.selectedUserId);

    if (e.target.classList.contains('ban-btn')) {
        showModal(
            user.isActive !== false ? '封禁用户' : '解封用户',
            `确定要${user.isActive !== false ? '封禁' : '解封'}用户 ${user.nickname} 吗？`,
            'toggleBan'
        );
    } else if (e.target.classList.contains('reset-btn')) {
        showModal(
            '重置密码',
            `确定要将用户 ${user.nickname} 的密码重置为 "123456AA" 吗？`,
            'resetPassword'
        );
    } else if (e.target.classList.contains('view-btn')) {
        viewUserDetails(user);
    }
}

// 管理员功能方法
// 修正后的toggleUserBan函数
// 封禁/解封用户（安全版）
// 修改 confirmAction 函数中的 toggleBan 调用，传入 selectedUserId

function confirmAction() {
    switch (state.currentAction) {
        case 'toggleBan': 
            toggleUserBan(state.selectedUserId); 
            break;
        case 'resetPassword': 
            resetUserPassword(); 
            break;
    }
    hideModal();
}

// 修改 toggleUserBan，接收studentId参数
function toggleUserBan(studentId) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.studentId === studentId);

    if (userIndex === -1) {
        console.error('用户不存在');
        return false;
    }

    users[userIndex].isActive = !users[userIndex].isActive;
    saveUsers(users);

    // 如果当前登录用户被封禁，强制登出
    const loggedInUser = getLoggedInUser();
    if (loggedInUser === studentId && !users[userIndex].isActive) {
        localStorage.removeItem('loggedInUser');
        alert('您的账号已被封禁');
        window.location.href = 'login.html';
    }

    showToast(`用户 ${users[userIndex].nickname} 已${users[userIndex].isActive ? '解封' : '封禁'}`);
    
    // 刷新数据和界面
    loadUserData();

    return true;
}


//重置密码功能
function resetUserPassword() {
    const users = getUsers();
    const user = users.find(u => u.studentId === state.selectedUserId);

    if (user) {
        user.password = '123456AA';
        saveUsers(users);
        showToast(`用户 ${user.nickname} 的密码已重置为 123456AA`);
    }
}

// 查看详情弹窗，增加显示用户类型
function viewUserDetails(user) {
    const userType = user.role === 'admin' ? '管理员' : '普通用户';
    const details = `
        <strong>学号:</strong> ${user.studentId}<br>
        <strong>昵称:</strong> ${user.nickname}<br>
        <strong>简介:</strong> ${user.bio || '无'}<br>
        <strong>兴趣标签:</strong> ${user.interests?.join(', ') || '无'}<br>
        <strong>状态:</strong> ${user.isActive !== false ? '正常' : '封禁'}<br>
        <strong>用户类型:</strong> ${userType}
    `;
    showModal('用户详情', details);
}

// 模态框控制
function showModal(title, message, actionType = null) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.innerHTML = message;
    state.currentAction = actionType;
    elements.confirmModal.style.display = 'flex';

    // 如果是查看详情，隐藏确认按钮
    if (!actionType) {
        elements.confirmOk.style.display = 'none';
    } else {
        elements.confirmOk.style.display = 'block';
    }
}

function hideModal() {
    elements.confirmModal.style.display = 'none';
    state.currentAction = null;
}

// 辅助功能
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 初始化Toast样式
function initToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toast-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.5s;
        }
        .fade-out {
            animation: fadeOut 0.5s forwards;
        }
        @keyframes slideIn {
            from { bottom: -50px; opacity: 0; }
            to { bottom: 20px; opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; visibility: hidden; }
        }
    `;
    document.head.appendChild(style);
}

// 初始化
initToastStyles();