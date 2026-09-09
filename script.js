// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // For local testing, use this. For production, your backend URL
    API_URL: 'http://localhost:3000/api',
    STORAGE_KEY: 'forum_user',
};

// ============================================================
// STATE MANAGEMENT
// ============================================================
let currentUser = null;
let posts = [];

// ============================================================
// DOM REFERENCES
// ============================================================
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const loginMessage = document.getElementById('loginMessage');
const userDisplay = document.getElementById('userDisplay');
const userEmail = document.getElementById('userEmail');
const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('postsContainer');
const postContent = document.getElementById('postContent');
const charCounter = document.querySelector('.char-counter');

// ============================================================
// AUTHENTICATION
// ============================================================
// Check if user is already logged in (using localStorage)
function checkAuth() {
    const savedUser = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUIForLoggedInUser();
        } catch (e) {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
        }
    }
}

// Login modal controls
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', () => {
    loginModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Handle login form submission (simulated magic link)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (!email) return;
    
    loginMessage.textContent = 'Sending magic link...';
    loginMessage.style.color = '#1a73e8';
    
    // Simulate API call
    try {
        // In production, this would send a real magic link email
        await simulateApiCall('/auth/magic-link', { email });
        
        loginMessage.textContent = '✅ Magic link sent! Check your email.';
        loginMessage.style.color = '#065f46';
        
        // Simulate auto-login after 2 seconds (for demo)
        setTimeout(() => {
            // For demo purposes, we'll just log the user in
            currentUser = { email, id: 'demo-user-123' };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            loginModal.style.display = 'none';
            loginMessage.textContent = '';
            loadPosts();
        }, 2000);
        
    } catch (error) {
        loginMessage.textContent = '❌ Error: ' + error.message;
        loginMessage.style.color = '#991b1b';
    }
});

function updateUIForLoggedInUser() {
    loginBtn.style.display = 'none';
    userDisplay.style.display = 'inline';
    userEmail.textContent = currentUser.email;
}

// ============================================================
// POST MANAGEMENT
// ============================================================
// Character counter
postContent.addEventListener('input', () => {
    const count = postContent.value.length;
    charCounter.textContent = `${count} / 50,000`;
    if (count > 50000) {
        charCounter.style.color = '#991b1b';
    } else {
        charCounter.style.color = '#6b7a8f';
    }
});

// Handle new post submission
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please log in first!');
        loginBtn.click();
        return;
    }
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const type = document.getElementById('postType').value;
    const tag = document.getElementById('postTag').value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content.');
        return;
    }
    
    if (content.length > 50000) {
        alert('Content exceeds 50,000 characters.');
        return;
    }
    
    const newPost = {
        id: 'post-' + Date.now(),
        title,
        content,
        type,
        tag: tag || 'General',
        author: currentUser.email,
        date: new Date().toISOString(),
        comments: [],
    };
    
    // Simulate API call
    try {
        await simulateApiCall('/posts', newPost);
        posts.unshift(newPost); // Add to beginning
        renderPosts();
        postForm.reset();
        charCounter.textContent = '0 / 50,000';
        alert('✅ Post published successfully!');
        
        // If new user, show approval message
        if (currentUser.isNew) {
            alert('Your post is pending approval by moderators.');
        }
    } catch (error) {
        alert('Error publishing post: ' + error.message);
    }
});

// ============================================================
// RENDER POSTS
// ============================================================
function renderPosts() {
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p class="loading">No posts yet. Be the first to post!</p>';
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <span class="post-type ${post.type}">${post.type}</span>
                <span class="post-tag">#${post.tag}</span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-content">${autoLink(escapeHtml(post.content))}</div>
            <div class="post-meta">
                <span>👤 ${escapeHtml(post.author)}</span>
                <span>📅 ${new Date(post.date).toLocaleDateString()}</span>
                <span>💬 ${post.comments.length} comments</span>
            </div>
            ${renderComments(post)}
        </div>
    `).join('');
    
    // Attach comment form listeners
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', handleCommentSubmit);
    });
}

function renderComments(post) {
    if (!post.comments || post.comments.length === 0) {
        return `
            <div class="comments-section">
                <p style="color: #6b7a8f; font-size: 0.9rem;">No comments yet.</p>
                ${getCommentForm(post.id)}
            </div>
        `;
    }
    
    const commentsHtml = post.comments.map(comment => `
        <div class="comment">
            <strong>${escapeHtml(comment.author)}</strong>
            <span style="color: #6b7a8f; font-size: 0.8rem;">${new Date(comment.date).toLocaleDateString()}</span>
            <p>${escapeHtml(comment.text)}</p>
        </div>
    `).join('');
    
    return `
        <div class="comments-section">
            ${commentsHtml}
            ${getCommentForm(post.id)}
        </div>
    `;
}

function getCommentForm(postId) {
    if (!currentUser) {
        return `<p style="color: #6b7a8f; font-size: 0.9rem;">🔒 <a href="#" onclick="document.getElementById('loginBtn').click(); return false;">Log in</a> to comment.</p>`;
    }
    return `
        <form class="comment-form" data-post-id="${postId}">
            <input type="text" placeholder="Write a comment..." required />
            <button type="submit" class="btn-secondary">Post</button>
        </form>
    `;
}

// ============================================================
// COMMENT HANDLING
// ============================================================
async function handleCommentSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const postId = form.dataset.postId;
    const input = form.querySelector('input');
    const text = input.value.trim();
    
    if (!text) return;
    if (!currentUser) {
        alert('Please log in first.');
        return;
    }
    
    const comment = {
        id: 'cmt-' + Date.now(),
        text,
        author: currentUser.email,
        date: new Date().toISOString(),
    };
    
    try {
        await simulateApiCall('/comments', { postId, comment });
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push(comment);
            renderPosts();
        }
    } catch (error) {
        alert('Error posting comment: ' + error.message);
    }
}

// ============================================================
// LOAD POSTS (Simulated)
// ============================================================
async function loadPosts() {
    try {
        // Simulate loading from API
        const data = await simulateApiCall('/posts');
        posts = data;
        renderPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<p class="loading">Error loading posts. Please refresh.</p>';
    }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function autoLink(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
}

// Simulated API calls (replace with real fetch in production)
function simulateApiCall(endpoint, data = null) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (endpoint === '/posts') {
                // Return some sample data if no posts exist
                if (!posts.length) {
                    resolve([
                        {
                            id: 'sample-1',
                            title: 'Welcome to the Levi45 Community!',
                            content: 'This is a sample post. Feel free to introduce yourself and ask questions about Enigma2 setups, IPTV, and plugins.',
                            type: 'information',
                            tag: 'General',
                            author: 'admin@example.com',
                            date: new Date(Date.now() - 86400000).toISOString(),
                            comments: [
                                { id: 'c1', text: 'Great community!', author: 'user@example.com', date: new Date().toISOString() }
                            ]
                        }
                    ]);
                }
                resolve(posts);
            } else if (endpoint === '/auth/magic-link') {
                resolve({ success: true });
            } else if (endpoint === '/posts' && data) {
                resolve({ success: true, post: data });
            } else if (endpoint === '/comments' && data) {
                resolve({ success: true, comment: data.comment });
            } else {
                resolve({ success: true });
            }
        }, 300);
    });
}

// ============================================================
// INITIALIZATION
// ============================================================
checkAuth();
loadPosts();

console.log('🚀 Levi45 Community Forum loaded!');
console.log('📝 To connect a real backend, update CONFIG.API_URL');
