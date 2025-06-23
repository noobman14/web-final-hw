// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的主要元素
    const publishForm = document.getElementById('publishForm'); // 发布表单
    const postContent = document.getElementById('postContent'); // 动态内容输入框
    const imageUpload = document.getElementById('imageUpload'); // 图片上传输入框
    const imageUrl = document.getElementById('imageUrl'); // 图片URL输入框
    const imagePreview = document.getElementById('imagePreview'); // 图片预览区域
    const postContentError = document.getElementById('postContentError'); // 内容错误提示
    const tagsInput = document.getElementById('tags'); // 话题标签输入框
    const visibilitySelect = document.getElementById('visibility'); // 可见范围选择框

    // 图片预览功能 - 处理文件上传
    imageUpload.addEventListener('change', (event) => {
        imagePreview.innerHTML = ''; // 清除之前的预览
        const files = event.target.files; // 获取上传的文件
        if (files) {
            // 遍历所有上传的文件
            Array.from(files).forEach(file => {
                const reader = new FileReader(); // 创建文件读取器
                reader.onload = (e) => {
                    const img = document.createElement('img'); // 创建图片元素
                    img.src = e.target.result; // 设置图片源
                    imagePreview.appendChild(img); // 添加到预览区域
                };
                reader.readAsDataURL(file); // 读取文件为DataURL
            });
            imageUrl.value = ''; // 如果上传了文件，清空图片URL输入框
        }
    });

    // 图片预览功能 - 处理URL输入
    imageUrl.addEventListener('input', () => {
        imagePreview.innerHTML = ''; // 如果输入了URL，清除文件预览
        if (imageUrl.value.trim() !== '') {
            const img = document.createElement('img'); // 创建图片元素
            img.src = imageUrl.value.trim(); // 设置图片源为输入的URL
            imagePreview.appendChild(img); // 添加到预览区域
            imageUpload.value = ''; // 如果使用了URL，清空文件输入框
        }
    });

    // 发布表单提交事件处理
    publishForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        let isValid = true; // 表单校验状态标志

        // 登录校验
        const currentUser = localStorage.getItem('loggedInUser');
        if (!currentUser) {
            alert('请先登录后再发布动态。');
            window.location.href = 'login.html';
            return;
        }

        // 清除之前的错误信息
        postContentError.textContent = '';

        // 动态内容校验
        if (postContent.value.trim() === '') {
            postContentError.textContent = '动态内容不能为空。';
            isValid = false;
        }

        // 如果校验通过
        if (isValid) {
            // 获取可见范围
            const visibility = visibilitySelect.value;
            // 处理图片字段
            let image = '';
            if (imageUpload.files.length > 0) {
                image = imageUpload.files[0].name;
            } else if (imageUrl.value.trim() !== '') {
                image = imageUrl.value.trim();
            }
            // 处理标签
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            // 构建新动态对象
            const newPost = {
                authorId: currentUser,
                content: postContent.value.trim(),
                image: image,
                tags: tags,
                timestamp: new Date().toLocaleString(),
                likes: 0,
                comments: [],
                visibility
            };
            // 获取所有动态数据
            let posts = getPosts();
            // 生成新的动态ID
            const newPostId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
            newPost.id = newPostId;
            // 添加新动态到数据中
            posts.push(newPost);
            // 保存更新后的动态数据
            savePosts(posts);
            alert('动态发布成功！');
            // 跳转到主页
            window.location.href = 'index.html';
        } else {
            alert('请检查您的输入。');
        }
    });
});

// 获取所有动态数据的函数
function getPosts() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

// 保存动态数据到localStorage的函数
function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}