# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   pip install -r scripts/requirements.txt
   ```

2. **Export Inventory Data**
   ```bash
   python scripts/export_inventory.py
   ```
   This creates `data/inventory.json` from your SQLite database.

3. **Test Locally**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

4. **Build for Production**
   ```bash
   npm run build
   ```
   Output will be in the `out/` directory.

## GitHub Setup

### Initial Repository Setup

1. Create a new GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (or use GitHub Actions)
   - Save

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build the site when you push to `main`
- Deploy to GitHub Pages

### Pushing Updates from Python App

1. Set environment variables:
   ```bash
   export GITHUB_TOKEN=your_github_personal_access_token
   export GITHUB_REPO=username/repo-name
   ```

2. Run the push script:
   ```bash
   python scripts/push_to_github.py
   ```

   This will:
   - Export inventory data from SQLite
   - Commit and push to GitHub
   - Trigger automatic rebuild

### Getting a GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token and use it as `GITHUB_TOKEN`

## Custom Domain Setup

If deploying to a subdirectory (e.g., `rsautomation.net/inventory`):

1. Update `next.config.js`:
   ```javascript
   basePath: '/inventory',
   ```

2. Configure in GitHub Pages settings:
   - Custom domain: `rsautomation.net`
   - Add CNAME file or configure DNS

## Email Configuration

Update the quote request email in `components/QuoteRequest.tsx`:

```typescript
window.location.href = `mailto:quotes@rsautomation.net?subject=...`;
```

For production, consider using an API endpoint with SendGrid, Resend, or similar service.

## Troubleshooting

### Build Fails

- Ensure `data/inventory.json` exists
- Check that all images exist in `items/` folder
- Verify database connection if running export script

### Images Not Loading

- Check image paths in JSON are relative to repo root
- Verify file extensions match (case-sensitive)
- Ensure images are committed to repository

### GitHub Pages Not Updating

- Check Actions tab for workflow status
- Verify repository settings allow Pages
- Ensure workflow has proper permissions

