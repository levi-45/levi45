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


## Download categories

The Downloads page now shows six permanent categories: **OpenATV**, **OpenPLi**, **Enigma2 Plugins**, **Channel Lists**, **Picons**, and **Receiver Tools**. Categories remain visible even when empty.

To add a download, upload your file into `downloads/`, then add an entry to `data/content.json` under `items`. Example:

```json
{
  "id": "my-plugin-v1",
  "type": "download",
  "category": "Enigma2 Plugins",
  "title": "My Enigma2 Plugin v1",
  "date": "2026-10-20",
  "summary": "Description and supported receiver models.",
  "body": "Installation instructions and compatibility notes.",
  "file": "downloads/my-plugin-v1.ipk"
}
```

Remember to put a comma between JSON entries. The website has no registration, login, database or paid service. GitHub repository file-size and bandwidth limits still apply.


## Resource Manager pages
Each download in `data/content.json` gets its own resource detail page when clicked.
Optional download fields: `version`, `size`, `receivers` (list), `screenshots` (list of paths inside `images/` or `downloads/`), and `installation`.
`file` should point to a file inside `downloads/` (for example `downloads/my-plugin.zip`) or a trusted HTTPS download URL.
The included example resource has no file and is for demonstration only; remove or replace it before publishing real downloads.
Add screenshot images to an `images/` folder in the repository.
GitHub Pages is static: it does not count downloads, accept uploads from visitors, or provide user accounts.


## Seven homepage categories
The seven download categories are defined in `script.js` and are always shown, even when empty. For a download to appear under a category, use the exact category name in `data/content.json`. Categories: Enigma2 Image Teams, Enigma2 Plugins, Enigma2 Skins, IPTV, SoftCam, Satellite Receiver, Tools.
