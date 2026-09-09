// backend.js - For local testing only
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let posts = [
    {
        id: 'sample-1',
        title: 'Welcome to AIO Community!',
        content: 'This is a sample post. Feel free to introduce yourself and ask questions about Enigma2 setups, IPTV, and plugins.',
        type: 'information',
        tag: 'General',
        author: 'admin@example.com',
        date: new Date(Date.now() - 86400000).toISOString(),
        comments: [
            { id: 'c1', text: 'Great community!', author: 'user@example.com', date: new Date().toISOString() }
        ]
    }
];

// Routes
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.post('/api/posts', (req, res) => {
    const newPost = { ...req.body, id: 'post-' + Date.now() };
    posts.unshift(newPost);
    res.json({ success: true, post: newPost });
});

app.post('/api/comments', (req, res) => {
    const { postId, comment } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({ ...comment, id: 'cmt-' + Date.now() });
        res.json({ success: true, comment });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.post('/api/auth/magic-link', (req, res) => {
    console.log(`📧 Magic link sent to: ${req.body.email}`);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🔧 Backend running at http://localhost:${PORT}`);
});