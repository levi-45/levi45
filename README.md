# Levi45 Community — free GitHub Pages website

A XenForo 2-inspired **static** Enigma2 download, news and tutorial site. No registration, backend, database or paid service is required.

## Publish

1. Back up your existing GitHub repository files first.
2. Upload **the contents of this ZIP** (not a containing folder) into the root of `levi45` on GitHub. Keep `data/content.json` inside the `data` folder.
3. In GitHub repository **Settings → Pages**, set deployment from the `main` branch and `/ (root)` folder if not already configured.
4. Visit https://levi-45.github.io/levi45/ and hard-refresh if needed.

## Add a download

1. Upload a file to the `downloads/` folder in your GitHub repository. GitHub's web uploader has a 25 MiB per-file limit; larger files may need a release or another host.
2. Open `data/content.json` in GitHub, click the pencil icon, and add an entry **inside the items array**, separated from the previous entry by a comma:

```json
{
  "id": "my-first-plugin",
  "type": "download",
  "category": "Plugins & Addons",
  "title": "My first plugin",
  "date": "2026-10-20",
  "summary": "Example plugin for a compatible Enigma2 receiver.",
  "body": "Check your receiver and image compatibility before installing.",
  "file": "downloads/my-first-plugin.ipk"
}
```

Use a unique `id` for every entry. The filename in `file` must match the uploaded file exactly. You may also use a direct `https://` URL to a hosted download. Do not upload files you are not allowed to redistribute.

## Add news or guides

Add another entry with `"type": "news"` or `"type": "guide"`; provide `id`, `category`, `title`, `date`, `summary` and `body`. Write paragraphs in `body` using `\n\n` (JSON escaped newlines). Do not include `file` for articles. The supplied two entries are starter examples and can be edited or deleted.

## Important limits

- Visitors can read and download, but **cannot register, log in, post or comment**.
- Site content is public and edited through GitHub commits only. Protect your GitHub account with 2FA.
- No backend means no reliable download counts, private files, or user accounts.
- Only upload files safe and legal to share. GitHub Pages and repository hosting have usage and size limits.
- Check JSON syntax when editing; invalid JSON stops the library from loading.
