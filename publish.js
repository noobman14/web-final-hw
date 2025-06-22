/**
 * 发布动态页面JavaScript文件
 * 功能：处理动态发布表单、图片预览和内容验证
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的主要元素
    const publishForm = document.getElementById('publishForm'); // 发布表单
    const postContent = document.getElementById('postContent'); // 动态内容输入框
    const imageUpload = document.getElementById('imageUpload'); // 图片上传输入框
    const imageUrl = document.getElementById('imageUrl'); // 图片URL输入框
    const imagePreview = document.getElementById('imagePreview'); // 图片预览区域
    const postContentError = document.getElementById('postContentError'); // 内容错误提示

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
        let isValid = true; // 表单验证状态标志

        // 清除之前的错误信息
        postContentError.textContent = '';

        // 动态内容验证
        if (postContent.value.trim() === '') {
            postContentError.textContent = '动态内容不能为空。';
            isValid = false;
        }

        // 如果验证通过
        if (isValid) {
            // 在实际应用中，您会将此数据发送到后端服务器
            const newPost = {
                content: postContent.value.trim(), // 动态内容
                image: imageUpload.files.length > 0 ? imageUpload.files[0].name : imageUrl.value.trim(), // 图片信息
                tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // 标签数组
                timestamp: new Date().toLocaleString(), // 发布时间
                likes: 0, // 初始点赞数
                comments: 0 // 初始评论数
            };
            console.log('新动态:', newPost); // 在控制台输出新动态信息
            alert('动态发布成功！');
            // 目前，我们将重定向到主页查看动态流（没有实际的新动态渲染）
            window.location.href = 'index.html';
        } else {
            alert('请检查您的输入。');
        }
    });
});