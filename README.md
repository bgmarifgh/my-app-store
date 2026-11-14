# My App Store — Personal GitHub-powered App Store

A beautiful, fully static **Play Store–style app store** that runs on **GitHub Pages**.

When users tap **Download**, the file is served directly from your **GitHub Releases**.

---

## ✨ Features

- Modern Material-inspired UI (dark & light mode)
- Featured apps carousel
- Category filters
- Live search
- App detail modal with screenshots, description, what’s new, metadata
- Direct download links to GitHub Release assets
- Fully responsive (mobile-first)
- Zero build step — pure HTML / CSS / JS
- Easy to customize via a single `apps.json` file

---

## 🚀 Quick Start (GitHub Pages)

1. **Create a new repository** (or use an existing one)
2. Upload / push the contents of this folder to the root (or `/docs`) of the repo
3. Go to **Settings → Pages**
4. Set **Source** to `Deploy from a branch`
5. Choose branch `main` (or `master`) and folder `/ (root)` or `/docs`
6. Save — your store will be live at:
   `https://YOUR_USERNAME.github.io/REPO_NAME/`

---

## 🛠 Customize Your Apps

Edit **`apps.json`**.

### Structure

```json
{
  "storeName": "My App Store",
  "storeTagline": "Your personal app store powered by GitHub",
  "featured": ["app-id-1", "app-id-2"],
  "categories": ["All", "Productivity", "Tools", "Games", ...],
  "apps": [
    {
      "id": "unique-id",
      "name": "App Name",
      "shortDescription": "One-liner shown on cards",
      "description": "Full description shown in the detail modal",
      "developer": "Your Name",
      "category": "Productivity",
      "icon": "https://... or relative path to icon.png",
      "screenshots": [
        "https://.../screenshot1.png",
        "https://.../screenshot2.png"
      ],
      "rating": 4.8,
      "reviewsCount": 128,
      "downloads": "12K+",
      "version": "2.4.1",
      "size": "18 MB",
      "updated": "2026-11-10",
      "requires": "Android 8.0+",
      "whatsNew": "• New feature\n• Bug fixes",
      "downloadUrl": "https://github.com/YOU/REPO/releases/latest/download/your-app.apk",
      "githubUrl": "https://github.com/YOU/REPO",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

### How to get a real Download URL from GitHub

1. Create a **Release** on your app’s repository
2. Upload the APK / EXE / DMG / AppImage / etc. as a release asset
3. The download link will look like:

```
https://github.com/USERNAME/REPO/releases/download/v1.0.0/filename.apk
```

or the convenient “latest” form:

```
https://github.com/USERNAME/REPO/releases/latest/download/filename.apk
```

Paste that URL into the `"downloadUrl"` field.

---

## 📁 File Structure

```
├── index.html      # Main page
├── styles.css      # All styles
├── script.js       # Logic & rendering
├── apps.json       # ← Edit this to add your apps
└── README.md
```

---

## 🎨 Tips

- **Icons**: Use square PNG/SVG (recommended 512×512). You can host them in the same repo (`icons/myapp.png`) or use any public URL.
- **Screenshots**: Portrait images work best (e.g. 1080×1920).
- **Multiple platforms**: You can list the same app multiple times with different `downloadUrl`s (Android / Windows / Linux) or put platform-specific buttons later.
- **Custom domain**: Add a `CNAME` file with your domain and configure DNS.

---

## 🔒 Notes

- This is a **static front-end**. All downloads come directly from GitHub — no backend, no tracking, no ads.
- Ratings, download counts, and reviews are currently static (you control them in `apps.json`).
- For a more advanced version you could later connect to the GitHub API to pull live release data.

---

Made to be forked, customized, and owned by you.
