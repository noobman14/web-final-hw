/**
 * 编辑动态页面JavaScript文件
 * 功能：处理用户动态的编辑和保存
 * 作者：校园生活交友平台开发团队
 * 版本：1.0
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的主要元素
    const editPostForm = document.getElementById('editPostForm'); // 编辑动态表单
    const postContent = document.getElementById('postContent'); // 动态内容文本域
    const imageUpload = document.getElementById('imageUpload'); // 图片上传输入框
    const imageUrl = document.getElementById('imageUrl'); // 图片URL输入框
    const tags = document.getElementById('tags'); // 话题标签输入框
    const postContentError = document.getElementById('postContentError'); // 内容错误提示

    // 获取要编辑的动态ID（假设从URL参数中获取）
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));

    // 获取所有动态数据
    const posts = getPosts();

    // 查找要编辑的动态
    const postToEdit = posts.find(post => post.id === postId);

    // 如果找到要编辑的动态，填充表单
    if (postToEdit) {
        postContent.value = postToEdit.content;
        imageUrl.value = postToEdit.image || '';
        tags.value = postToEdit.tags ? postToEdit.tags.join(', ') : '';
    } else {
        alert('未找到要编辑的动态。');
        window.location.href = 'index.html';
    }

    // 编辑动态表单提交事件处理
    editPostForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        let isValid = true; // 表单验证状态标志

        // 清除内容错误信息
        postContentError.textContent = '';

        // 内容验证
        if (postContent.value.trim() === '') {
            postContentError.textContent = '动态内容不能为空。';
            isValid = false;
        }

        // 如果验证通过且找到要编辑的动态
        if (isValid && postToEdit) {
            // 更新动态信息
            postToEdit.content = postContent.value.trim();
            postToEdit.image = imageUrl.value.trim() || null;
            postToEdit.tags = tags.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            // 保存更新后的动态数据
            savePosts(posts);

            alert('动态编辑成功！');
            window.location.href = `post_detail.html?id=${postId}`; // 重定向到编辑后的动态详情页面
        } else if (!postToEdit) {
            alert('无法保存：未找到要编辑的动态。');
        }
    });
});