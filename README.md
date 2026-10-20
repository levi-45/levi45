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


## XenForo-style category rows
The homepage and Downloads page display seven full-width rows with icons, live download counts, and the latest matching resource. Counts are calculated from `data/content.json`. To add a resource, create an item with `type: "download"` and a `category` matching one of the seven category names exactly. No sample download is included.


## New: subcategories
Click any main category on the homepage to see its subcategories. Click a subcategory to view its files.

To add a download, insert a new object in `data/content.json` inside `items`, for example:

```json
{
  "id": "my-openatv-file",
  "type": "download",
  "title": "OpenATV image for my receiver",
  "mainCategory": "Enigma2 Image Teams",
  "subcategory": "OpenATV",
  "category": "Enigma2 Image Teams",
  "date": "2026-10-20",
  "version": "1.0",
  "summary": "Describe the image and supported receiver.",
  "body": "Detailed information about this download.",
  "file": "downloads/my-image.zip"
}
```

Upload the matching file under `downloads/`. Do not include example files unless you want them published. Keep your existing content.json if you have published articles; merge the new entries instead of overwriting.

## Resource Publisher (offline, no database)

1. Extract this ZIP on your computer. Open `publisher.html` in a browser.
2. Download the **current** `data/content.json` from your GitHub repository and select it in the publisher. This preserves your existing entries.
3. Enter a download, news item or tutorial and click **Add to draft**. Repeat for additional entries.
4. Click **Download updated content.json** and upload it to the repository as `data/content.json`, replacing that file only.
5. For downloads, separately upload the actual file to `downloads/` (e.g. `downloads/my-plugin.zip`). For screenshots upload images to `images/`. Use those paths in the publisher.
6. Commit the changes; GitHub Pages will update shortly afterward.

**Important:** Do not upload `publisher.html` or `publisher.js` to your public site. The publisher runs locally, is not an authenticated admin panel, and does not upload files or publish directly to GitHub. Always start with the latest `content.json` to avoid overwriting newer content. Keep a backup of your repository before updating.
