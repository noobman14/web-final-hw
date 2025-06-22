/**
 * 数据管理模块 - data.js
 * 
 * 功能说明：
 * 1. 管理用户数据和动态数据的存储
 * 2. 提供数据的增删改查接口
 * 3. 使用localStorage模拟后端数据库
 * 4. 初始化默认数据
 * 
 * 数据结构：
 * - users: 用户信息数组
 * - posts: 动态信息数组
 */

/**
 * 初始化默认数据
 * 如果localStorage中没有数据，则创建默认的用户和动态数据
 */
function initializeData() {
    // 检查并初始化用户数据
    if (!localStorage.getItem('users')) {
        // 默认用户数据 - 8个不同专业背景的用户
        const defaultUsers = [
            // 计算机科学专业 - 编程爱好者
            {
                studentId: '2023000001',
                password: '123456AA',
                nickname: 'Alice',
                bio: '计算机科学专业，热爱编程和阅读。正在学习前端开发，希望能和大家一起交流技术！',
                interests: ['coding', 'reading', 'frontend'],
                avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                friends: ['20230002', '20230003']
            },
            // 体育学院 - 篮球校队成员
            {
                studentId: '2023000002',
                password: 'abcdefAA',
                nickname: 'Bob',
                bio: '体育学院学生，篮球校队成员。喜欢运动和音乐，欢迎大家来球场切磋！',
                interests: ['sports', 'music', 'basketball'],
                avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
            },
            // 艺术学院 - 设计专业
            {
                studentId: '2023000003',
                password: '123456AA',
                nickname: '小美',
                bio: '艺术学院设计专业，喜欢画画和摄影。记录生活中的美好瞬间～',
                interests: ['art', 'photography', 'design'],
                avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
            },
            // 物理学院 - 研究生
            {
                studentId: '2023000004',
                password: '123456AA',
                nickname: '学霸小明',
                bio: '物理学院研究生，专注于量子物理研究。偶尔也会打打游戏放松一下。',
                interests: ['physics', 'research', 'gaming'],
                avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
            },
            // 音乐学院 - 钢琴专业
            {
                studentId: '2023000005',
                password: '123456AA',
                nickname: '音乐小王子',
                bio: '音乐学院钢琴专业，热爱古典音乐。希望能用音乐传递快乐！',
                interests: ['music', 'piano', 'classical'],
                avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
            },
            // 食品科学专业 - 美食达人
            {
                studentId: '2023000006',
                password: '123456AA',
                nickname: '美食达人',
                bio: '食品科学专业，喜欢研究各种美食。分享校园美食攻略，带你吃遍校园！',
                interests: ['food', 'cooking', 'travel'],
                avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
            },
            // 商学院 - 创业青年
            {
                studentId: '2023000007',
                password: '123456AA',
                nickname: '创业青年',
                bio: '商学院学生，正在筹备自己的创业项目。喜欢和志同道合的朋友交流想法。',
                interests: ['business', 'startup', 'networking'],
                avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
            },
            // 文学院 - 文学少女
            {
                studentId: '2023000008',
                password: '123456AA',
                nickname: '文学少女',
                bio: '文学院中文系，热爱写作和诗歌。用文字记录青春的美好时光。',
                interests: ['literature', 'writing', 'poetry'],
                avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
            },
            // 个人账号 - 梁智炜
            {
                studentId: '2023150138',
                password: '123456AA',
                nickname: '宇文姜残',
                bio: '文明其精神，野蛮其体魄。',
                interests: ['E', 'G', 'E'],
                avatar: 'pic/avatar/lGSLAxQ1ux0WEDE.jpeg',
                role: 'admin'
            }
        ];
        ensureUserRelations(defaultUsers);
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    } else {
        // 补全已存在的用户数据
        let users = JSON.parse(localStorage.getItem('users'));
        if (ensureUserRelations(users)) {
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // 检查并初始化动态数据
    if (!localStorage.getItem('posts')) {
        // 默认动态数据 - 12条不同主题的校园生活动态
        const defaultPosts = [
            // 动态1：篮球训练
            {
                id: 1,
                authorId: '2023000002', // Bob
                content: '今天篮球校队训练，大家状态都很棒！特别是新来的学弟，投篮手感超好。期待下周的比赛！#篮球 #校队 #运动',
                image: '',
                likes: 78,
                comments: [
                    { author: 'Alice', content: '加油！期待看你们比赛！', timestamp: '2025-01-15 16:30' },
                    { author: '小美', content: '下次比赛记得通知我，我要去拍照！', timestamp: '2025-01-15 16:45' }
                ],
                timestamp: '2025-01-15 16:00',
                visibility: 'public'
            },
            // 动态2：编程学习
            {
                id: 2,
                authorId: '2023000001', // Alice
                content: '今天在图书馆学习了一整天，终于把JavaScript的异步编程搞明白了！感觉编程真的很有趣，虽然有时候会卡很久，但是解决bug的那一刻真的很爽！#编程 #学习 #JavaScript',
                image: '',
                likes: 65,
                comments: [
                    { author: '学霸小明', content: '异步编程确实是个难点，加油！', timestamp: '2025-01-15 15:20' },
                    { author: '创业青年', content: '要不要一起做个项目？', timestamp: '2025-01-15 15:35' }
                ],
                timestamp: '2025-01-15 15:00',
                visibility: 'public'
            },
            // 动态3：美食推荐
            {
                id: 3,
                authorId: '2023000006', // 美食达人
                content: '发现了一家超好吃的麻辣烫！就在学校东门的小巷子里，汤底很香，料也很新鲜。强烈推荐给大家！#美食 #麻辣烫 #校园美食',
                image: '',
                likes: 92,
                comments: [
                    { author: '小美', content: '求具体位置！我要去打卡！', timestamp: '2025-01-15 14:15' },
                    { author: 'Bob', content: '运动完正好可以去吃，哈哈', timestamp: '2025-01-15 14:30' },
                    { author: '文学少女', content: '听起来就很诱人，明天就去试试！', timestamp: '2025-01-15 14:45' }
                ],
                timestamp: '2025-01-15 14:00',
                visibility: 'public'
            },
            // 动态4：摄影作品
            {
                id: 4,
                authorId: '2023000003', // 小美
                content: '今天在校园里拍了一组樱花照片，春天的校园真的太美了！每一朵花都像是大自然的艺术品。#摄影 #樱花 #春天 #校园',
                image: 'pic/flower.png',
                likes: 108,
                comments: [
                    { author: 'Alice', content: '照片拍得真好看！', timestamp: '2025-01-15 13:20' },
                    { author: '音乐小王子', content: '春天的校园确实很美，适合写歌', timestamp: '2025-01-15 13:35' },
                    { author: '文学少女', content: '樱花如诗，美不胜收', timestamp: '2025-01-15 13:50' }
                ],
                timestamp: '2025-01-15 13:00',
                visibility: 'public'
            },
            // 动态5：音乐练习
            {
                id: 5,
                authorId: '2023000005', // 音乐小王子
                content: '今天在音乐厅练习了肖邦的夜曲，感觉状态不错。音乐真的能治愈心灵，希望每个人都能找到属于自己的旋律。#音乐 #钢琴 #肖邦 #夜曲',
                image: '',
                likes: 85,
                comments: [
                    { author: '小美', content: '下次能听你现场演奏吗？', timestamp: '2025-01-15 12:15' },
                    { author: '文学少女', content: '音乐和诗歌一样，都是心灵的表达', timestamp: '2025-01-15 12:30' }
                ],
                timestamp: '2025-01-15 12:00',
                visibility: 'public'
            },
            // 动态6：科研实验
            {
                id: 6,
                authorId: '2023000004', // 学霸小明
                content: '今天在实验室做量子纠缠实验，虽然失败了三次，但第四次终于成功了！科研就是这样，需要耐心和坚持。每一次失败都是通往成功的阶梯。#科研 #量子物理 #实验室',
                image: '',
                likes: 73,
                comments: [
                    { author: 'Alice', content: '太厉害了！量子物理听起来就很深奥', timestamp: '2025-01-15 11:20' },
                    { author: '创业青年', content: '这种精神值得学习！', timestamp: '2025-01-15 11:35' }
                ],
                timestamp: '2025-01-15 11:00',
                visibility: 'public'
            },
            // 动态7：创业想法
            {
                id: 7,
                authorId: '2023000007', // 创业青年
                content: '今天和几个同学讨论了一个新的创业想法，感觉很有潜力！现在的大学生真的很有想法，希望能做出一些有意义的事情。#创业 #创新 #团队合作',
                image: '',
                likes: 56,
                comments: [
                    { author: 'Alice', content: '需要程序员吗？我可以帮忙！', timestamp: '2025-01-15 10:15' },
                    { author: '美食达人', content: '听起来很有趣，加油！', timestamp: '2025-01-15 10:30' }
                ],
                timestamp: '2025-01-15 10:00',
                visibility: 'public'
            },
            // 动态8：诗歌创作
            {
                id: 8,
                authorId: '2023000008', // 文学少女
                content: '今天写了一首关于春天的诗，灵感来自校园里的樱花。诗歌是心灵的窗户，透过它可以看到更美的世界。#诗歌 #文学 #春天 #创作',
                image: '',
                likes: 67,
                comments: [
                    { author: '小美', content: '能分享一下你的诗吗？', timestamp: '2025-01-15 09:20' },
                    { author: '音乐小王子', content: '诗歌和音乐都是艺术的表现形式', timestamp: '2025-01-15 09:35' }
                ],
                timestamp: '2025-01-15 09:00',
                visibility: 'public'
            },
            // 动态9：编程比赛
            {
                id: 9,
                authorId: '2023000001', // Alice
                content: '今天参加了学校的编程比赛，虽然没拿到名次，但学到了很多！认识了很多志同道合的朋友，感觉编程社区真的很温暖。#编程比赛 #学习 #社区',
                image: '',
                likes: 45,
                comments: [
                    { author: 'Bob', content: '下次比赛加油！', timestamp: '2025-01-15 08:15' },
                    { author: '创业青年', content: '要不要一起组队参加下次比赛？', timestamp: '2025-01-15 08:30' }
                ],
                timestamp: '2025-01-15 08:00',
                visibility: 'public'
            },
            // 动态10：烹饪体验
            {
                id: 10,
                authorId: '2023000006', // 美食达人
                content: '今天尝试做了一道新菜——红烧肉，虽然卖相一般，但味道还不错！做饭真的是一件很治愈的事情，看着食材变成美食的过程很享受。#做饭 #红烧肉 #治愈',
                image: '',
                likes: 89,
                comments: [
                    { author: '小美', content: '看起来就很香！求教程！', timestamp: '2025-01-15 07:20' },
                    { author: 'Bob', content: '运动完正好需要补充能量，哈哈', timestamp: '2025-01-15 07:35' },
                    { author: '文学少女', content: '美食如诗，都是生活的艺术', timestamp: '2025-01-15 07:50' }
                ],
                timestamp: '2025-01-15 07:00',
                visibility: 'public'
            },
            // 动态11：绘画创作
            {
                id: 11,
                authorId: '2023000003', // 小美
                content: '今天在画室画了一幅水彩画，主题是校园的黄昏。画画的时候感觉时间都静止了，很享受这种专注的感觉。#画画 #水彩 #艺术 #专注',
                image: '',
                likes: 76,
                comments: [
                    { author: 'Alice', content: '能看看你的画吗？', timestamp: '2025-01-15 06:15' },
                    { author: '音乐小王子', content: '艺术都是相通的，很美', timestamp: '2025-01-15 06:30' }
                ],
                timestamp: '2025-01-15 06:00',
                visibility: 'public'
            },
            // 动态12：音乐练习
            {
                id: 12,
                authorId: '2023000005', // 音乐小王子
                content: '今天在琴房练习了四个小时，手指都酸了，但是很充实！音乐需要大量的练习，但每一次进步都让人兴奋。#练琴 #音乐 #坚持 #进步',
                image: '',
                likes: 58,
                comments: [
                    { author: '小美', content: '辛苦了！期待你的演出', timestamp: '2025-01-15 05:20' },
                    { author: '学霸小明', content: '科研也需要这种坚持的精神', timestamp: '2025-01-15 05:35' }
                ],
                timestamp: '2025-01-15 05:00',
                visibility: 'public'
            }
        ];
        // 将动态数据存储到localStorage
        localStorage.setItem('posts', JSON.stringify(defaultPosts));
    }
}

/**
 * 获取所有用户数据
 * @returns {Array} 用户数组
 */
function getUsers() {
    initializeData(); // 确保数据已初始化
    let users = JSON.parse(localStorage.getItem('users'));
    if (ensureUserRelations(users)) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    return users;
}

/**
 * 保存用户数据到localStorage
 * @param {Array} users - 用户数组
 */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * 获取所有动态数据
 * @returns {Array} 动态数组
 */
function getPosts() {
    initializeData(); // 确保数据已初始化
    const posts = JSON.parse(localStorage.getItem('posts'));
    return posts;
}

/**
 * 获取当前登录用户可见的动态（基于可见范围）
 * @returns {Array} 可见动态数组
 */
function getVisiblePostsForUser() {
    const posts = getPosts();
    const currentUserId = getLoggedInUser();

    return posts.filter(post => {
        if (post.visibility === 'public') return true;
        if (!currentUserId) return false;

        if (post.visibility === 'friends') {
            const author = getUserByStudentId(post.authorId);
            return author && author.friends && author.friends.includes(currentUserId);
        }

        return false;
    });
}

/**
 * 保存动态数据到localStorage
 * @param {Array} posts - 动态数组
 */
function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

/**
 * 添加新动态
 * @param {Object} post - 动态对象
 */
function addPost(post) {
    const posts = getPosts();
    // 生成新的动态ID（取当前最大ID + 1）
    post.id = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    // 将新动态添加到数组开头（最新动态显示在前面）
    posts.unshift(post);
    savePosts(posts);
}

/**
 * 根据学号获取用户信息
 * @param {string} studentId - 学号
 * @returns {Object|null} 用户对象或null
 */
function getUserByStudentId(studentId) {
    const users = getUsers();
    return users.find(user => user.studentId === studentId);
}

/**
 * 更新用户信息
 * @param {Object} updatedUser - 更新后的用户对象
 */
function updateUser(updatedUser) {
    let users = getUsers();
    // 找到并更新指定用户的信息
    users = users.map(user => user.studentId === updatedUser.studentId ? updatedUser : user);
    saveUsers(users);
}

/**
 * 根据作者ID获取动态列表
 * @param {string} authorId - 作者学号
 * @returns {Array} 该作者的动态数组
 */
function getPostsByAuthorId(authorId) {
    const posts = getPosts();
    return posts.filter(post => post.authorId === authorId);
}

/**
 * 获取当前登录用户
 * @returns {string|null} 当前登录用户的学号或null
 */
function getLoggedInUser() {
    return localStorage.getItem('loggedInUser');
}

function ensureUserRelations(users) {
    let changed = false;
    users.forEach(user => {
        if (!Array.isArray(user.friends)) {
            user.friends = [];
            changed = true;
        }
        if (!Array.isArray(user.followers)) {
            user.followers = [];
            changed = true;
        }
    });
    return changed;
}

// 页面加载时初始化数据
initializeData();