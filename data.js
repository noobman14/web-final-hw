// data.js

// Function to initialize default data in localStorage if it doesn't exist
function initializeData() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { studentId: '20230001', password: '123456', nickname: 'Alice', bio: 'Hello, I am Alice.', interests: ['coding', 'reading'], avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            { studentId: '20230002', password: 'abcdef', nickname: 'Bob', bio: 'Hi, I am Bob.', interests: ['sports', 'music'], avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('posts')) {
        const defaultPosts = [{
                id: 1,
                authorId: '20230001', // Link to Alice
                content: '今天学校的图书馆又扩建了，环境更好了！学习氛围一级棒！#图书馆 #学习日常',
                image: '',
                likes: 35,
                comments: [],
                timestamp: '2023-10-27 14:00'
            },
            {
                id: 2,
                authorId: '20230002', // Link to Bob
                content: '参加了校运动会，虽然没有拿到奖牌，但体验感十足，青春就该这样！#运动会 #青春',
                image: 'https://via.placeholder.com/400x200?text=Sports+Day',
                likes: 50,
                comments: [],
                timestamp: '2023-10-26 10:00'
            },
            {
                id: 3,
                authorId: '20230001', // Link to Alice
                content: '最近在学JavaScript，感觉很有趣！有没有大神可以指导一下？#编程 #前端',
                image: '',
                likes: 20,
                comments: [],
                timestamp: '2023-10-28 09:00'
            }
        ];
        localStorage.setItem('posts', JSON.stringify(defaultPosts));
    }
}

// Function to get all users
function getUsers() {
    initializeData();
    return JSON.parse(localStorage.getItem('users'));
}

// Function to save users
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to get all posts
function getPosts() {
    initializeData();
    return JSON.parse(localStorage.getItem('posts'));
}

// Function to save posts
function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Function to add a new post
function addPost(post) {
    const posts = getPosts();
    post.id = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    posts.unshift(post); // Add to the beginning to show latest first
    savePosts(posts);
}

// Function to get a user by student ID
function getUserByStudentId(studentId) {
    const users = getUsers();
    return users.find(user => user.studentId === studentId);
}

// Function to update a user
function updateUser(updatedUser) {
    let users = getUsers();
    users = users.map(user => user.studentId === updatedUser.studentId ? updatedUser : user);
    saveUsers(users);
}

// Function to get posts by author ID
function getPostsByAuthorId(authorId) {
    const posts = getPosts();
    return posts.filter(post => post.authorId === authorId);
}

// Initialize data when this script is loaded
initializeData();