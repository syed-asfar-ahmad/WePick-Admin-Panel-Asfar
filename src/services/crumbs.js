// Users Module

const users = [
    { title: 'Users' },
    { title: 'Users List' }
];

const userPosts = [
    { title: 'Users' },
    { title: 'Users List', href: '/users' },
    { title: 'User Posts' }
];

const userPostDetail = (userId) => [
    { title: 'Dashboard', href: '/' },
    { title: 'Users', href: '/users' },
    { title: 'User Posts', href: userId && `/user/posts/${userId}` },
    { title: 'Post' }
];

// Posts Module

const posts = [
    { title: 'Posts' },
    { title: 'Posts List' }
];

const postDetail = [
    { title: 'Posts' },
    { title: 'Posts List', href: '/allpost' },
    { title: 'Post' }
];

// Moderation Module

const moderationPosts = [
    { title: 'Moderation' },
    { title: 'Posts'}
];

const moderationPostDetail = [
    { title: 'Moderation' },
    { title: 'Posts', href: '/moderation/posts'},
    { title: 'Post' }
];

const crumbs = {
    users,
    userPosts,
    userPostDetail,
    posts,
    postDetail,
    moderationPosts,
    moderationPostDetail
}

export default crumbs;