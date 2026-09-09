# AIO Community Forum

A lightweight community forum for Enigma2 users, inspired by the AIO IPTV Projekt community.

## Features
- 🔐 Passwordless email login (magic links)
- 📝 Create posts with rich text (up to 50,000 characters)
- 💬 Comment on posts
- 🏷️ Tag posts by plugin, app, or system
- 📱 Responsive design
- 🔗 Automatic link highlighting

## Quick Start

### Option 1: Deploy on GitHub Pages
1. Fork or clone this repository
2. Enable GitHub Pages in repository Settings → Pages
3. Select the `main` branch and `/ (root)` folder
4. Your site will be live at `https://your-username.github.io/repo-name/`

### Option 2: Run Locally
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the backend: `npm start`
4. Open `index.html` in your browser

## Connecting a Real Backend
1. Update `CONFIG.API_URL` in `script.js`
2. Deploy your backend to Render, Vercel, or Heroku
3. Configure CORS and email service (SendGrid, SES, etc.)

## File Structure