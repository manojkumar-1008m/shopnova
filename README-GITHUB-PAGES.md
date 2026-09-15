# ShopNova — GitHub Pages

## Upload correctly

Upload the **contents of this folder** to the root of your GitHub repository.
Do NOT upload the `shopnova` folder itself as a nested folder.

The repository root must contain:

- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `src/`
- `.github/workflows/deploy.yml`

## Deploy

1. Push the files to the `main` branch.
2. Open GitHub → Settings → Pages.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open the **Actions** tab and wait for the deployment workflow to finish.
5. Open the Pages URL shown by GitHub.

The site uses HashRouter so routes work on GitHub Pages.
