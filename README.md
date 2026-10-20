# Levi45 Community — XenForo-inspired GitHub Pages starter

A fresh, responsive, original forum design inspired by the general layout of XenForo 2. This is **not XenForo** and contains no XenForo proprietary assets.

## Deploy to GitHub Pages

1. Download and unzip the release.
2. Back up your existing repository and any live data first. Replacing the website files does **not** automatically erase data stored on an external backend.
3. In `levi-45/levi45`, replace the existing website files with `index.html`, `style.css`, and `script.js` from this ZIP. Keep README.md if desired.
4. Commit changes to the branch GitHub Pages publishes (often `main`).
5. In repository Settings → Pages, select **Deploy from a branch** and choose your branch and `/ (root)`.
6. Visit `https://levi-45.github.io/levi45/` after deployment.

## What works now

- Responsive forum directory and six categories
- Create threads, browse recent threads, search, reply, and see counts
- Basic HTML escaping for user-generated content
- Posts and replies persist in the **same browser** using localStorage

## Important limitations

This is a **front-end prototype**, not a public multi-user forum. GitHub Pages serves static files and cannot host the server-side database or authentication logic. Each visitor sees only their own browser's local posts. Clearing browser storage removes them. There are no real accounts, moderation, file uploads, online user presence, or server-side security. Do **not** claim this is a live multi-user forum without connecting a secure backend.

For a production forum, integrate a service such as Supabase or Firebase with authentication, a shared database, authorization rules, rate limiting, anti-spam controls, and moderation. Never put secret service keys in client-side JavaScript.

## Reset local demo data

In browser developer tools, remove localStorage key `levi45_forum_v2` for the site, or clear site storage.


## Registration policy

**Registration is CLOSED by default.** This frontend does not include a registration form or working account system. The account button displays a registration-closed notice. This is **not** server-side enforcement: when adding a real authentication backend, disable public sign-ups in the authentication provider and enforce the rule on the server. The existing demo still allows anonymous browser-local posts and replies.
