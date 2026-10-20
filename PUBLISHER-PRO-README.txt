Levi45 Resource Publisher Pro

1. Keep publisher.html and publisher.js on your computer, not on your public site.
2. Open publisher.html in a browser.
3. Load the latest data/content.json from your repository.
4. Choose a .ipk/.deb file, select category and subcategory, fill details and click Add to draft.
5. Click Generate GitHub upload ZIP. Extract it.
6. Upload data/content.json into GitHub repository data/ and package(s) into downloads/.
7. Commit and wait for GitHub Pages to deploy.

Do not upload the generated ZIP as a single file to GitHub Pages. Upload its extracted contents, preserving paths.
For packages larger than 25 MiB, use GitHub Releases and paste the HTTPS release asset URL instead.
The tool is offline; no credentials or tokens needed. It does not directly upload files.
