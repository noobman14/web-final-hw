/* search.js - 搜索页面脚本 */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    const button = document.getElementById('searchButton');
    button.addEventListener('click', () => performSearch(input.value));
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(input.value); });
    // 建议点击操作
    const suggestions = document.querySelector('.suggestions');
    document.querySelectorAll('.history-tag').forEach(tag => {
        tag.addEventListener('click', () => { input.value = tag.textContent; performSearch(tag.textContent); });
    });
    document.querySelectorAll('.hot-list li').forEach(item => {
        item.addEventListener('click', () => {
            const term = item.querySelector('.term').textContent;
            input.value = term;
            performSearch(term);
        });
    });
    document.querySelectorAll('.recommend-item').forEach(item => {
        item.addEventListener('click', () => {
            const term = item.querySelector('.recommend-title').textContent;
            input.value = term;
            performSearch(term);
        });
    });
});

function performSearch(query) {
    // 搜索时隐藏建议区块
    const suggestions = document.querySelector('.suggestions');
    if (suggestions) suggestions.style.display = 'none';
    const container = document.getElementById('results');
    container.innerHTML = '';
    const q = query.trim();
    if (!q) {
        container.innerHTML = '<p>请输入搜索关键字。</p>';
        return;
    }
    // 搜索用户
    const users = getUsers().filter(u => u.nickname.includes(q) || u.studentId.includes(q));
    const userSection = document.createElement('div');
    userSection.classList.add('search-results-section');
    userSection.innerHTML = '<h3><i class="fa fa-user"></i> 用户结果</h3>';
    const userList = document.createElement('ul');
    if (users.length === 0) {
        userList.innerHTML = '<li>无用户结果</li>';
    } else {
        users.forEach(u => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa fa-user"></i> ${u.nickname} (${u.studentId})`;
            li.addEventListener('click', () => window.location.href = `profile.html?user=${u.studentId}`);
            userList.appendChild(li);
        });
    }
    userSection.appendChild(userList);
    container.appendChild(userSection);
    // 搜索动态
    const posts = getPosts().filter(p => p.content.includes(q));
    const postSection = document.createElement('div');
    postSection.classList.add('search-results-section');
    postSection.innerHTML = '<h3><i class="fa fa-paper-plane"></i> 动态结果</h3>';
    if (posts.length === 0) {
        postSection.innerHTML += '<p>无动态结果</p>';
    } else {
        posts.forEach(p => {
            const div = document.createElement('div');
            div.classList.add('post-snippet');
            div.innerHTML = `<i class="fa fa-paper-plane"></i> ${p.content.slice(0, 50)}...`;
            div.addEventListener('click', () => window.location.href = `post_detail.html?postId=${p.id}`);
            postSection.appendChild(div);
        });
    }
    container.appendChild(postSection);
} 