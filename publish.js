document.addEventListener('DOMContentLoaded', () => {
    const publishForm = document.getElementById('publishForm');
    const postContent = document.getElementById('postContent');
    const imageUpload = document.getElementById('imageUpload');
    const imageUrl = document.getElementById('imageUrl');
    const imagePreview = document.getElementById('imagePreview');
    const postContentError = document.getElementById('postContentError');

    // Image preview functionality
    imageUpload.addEventListener('change', (event) => {
        imagePreview.innerHTML = ''; // Clear previous previews
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
            imageUrl.value = ''; // Clear image URL if file is uploaded
        }
    });

    imageUrl.addEventListener('input', () => {
        imagePreview.innerHTML = ''; // Clear file preview if URL is entered
        if (imageUrl.value.trim() !== '') {
            const img = document.createElement('img');
            img.src = imageUrl.value.trim();
            imagePreview.appendChild(img);
            imageUpload.value = ''; // Clear file input if URL is used
        }
    });

    publishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Clear previous errors
        postContentError.textContent = '';

        // Post content validation
        if (postContent.value.trim() === '') {
            postContentError.textContent = '动态内容不能为空。';
            isValid = false;
        }

        if (isValid) {
            // In a real application, you would send this data to a backend server
            const newPost = {
                content: postContent.value.trim(),
                image: imageUpload.files.length > 0 ? imageUpload.files[0].name : imageUrl.value.trim(),
                tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                timestamp: new Date().toLocaleString(),
                likes: 0,
                comments: 0
            };
            console.log('新动态:', newPost);
            alert('动态发布成功！');
            // For now, we will redirect to the homepage to see the feed (without actual new post rendering)
            window.location.href = 'index.html';
        } else {
            alert('请检查您的输入。');
        }
    });
});