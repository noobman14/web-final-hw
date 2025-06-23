/* search.js - 搜索页面脚本 */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    const button = document.getElementById('searchButton');
    button.addEventListener('click', () => performSearch(input.value));
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(input.value); });
    // 动态渲染历史记录
    renderSearchHistory();
    // 建议点击操作
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
    // 清空历史
    const clearBtn = document.querySelector('.clear-history');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('searchHistory');
            renderSearchHistory();
        });
    }
});

function saveSearchHistory(keyword) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    keyword = keyword.trim();
    if (!keyword) return;
    history = history.filter(item => item !== keyword); // 去重
    history.unshift(keyword); // 新的放前面
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

function renderSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const container = document.querySelector('.history-tags');
    if (!container) return;
    container.innerHTML = '';
    if (history.length === 0) {
        container.innerHTML = '<span style="color:#aaa;">暂无历史</span>';
        return;
    }
    history.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'history-tag';
        span.textContent = tag;
        span.onclick = () => {
            document.getElementById('searchInput').value = tag;
            performSearch(tag);
        };
        container.appendChild(span);
    });
}

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
    saveSearchHistory(q);
    renderSearchHistory();
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
    const posts = getVisiblePostsForUser().filter(p => p.content.includes(q));
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
            div.addEventListener('click', () => window.location.href = `post_detail.html?id=${p.id}`);
            postSection.appendChild(div);
        });
    }
    container.appendChild(postSection);
    // 添加返回按钮
    const backBtn = document.createElement('button');
    backBtn.textContent = '返回搜索';
    backBtn.style = 'margin: 24px auto 0; display: block; padding: 10px 28px; border-radius: 6px; background: #007bff; color: #fff; border: none; font-size: 16px; cursor: pointer;';
    backBtn.onclick = () => {
        // 显示建议区块，清空结果
        if (suggestions) suggestions.style.display = '';
        container.innerHTML = '<p>请输入关键字并点击搜索。</p>';
    };
    container.appendChild(backBtn);
}