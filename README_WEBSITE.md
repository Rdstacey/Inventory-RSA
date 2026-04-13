# Inventory Catalog Website

A static website catalog for RS Automation inventory, built with Next.js and deployed on GitHub Pages.

## Features

- **Individual Item Pages**: Clean URLs like `/inventory/INV-000001`
- **Master Listing Page**: Filterable and searchable inventory list
- **Image Galleries**: Thumbnail previews with click-to-expand viewing
- **Advanced Filtering**: By category, manufacturer, region, and country
- **One-Click Quote Requests**: Quick quote request form
- **Fast Performance**: Static site generation for optimal load times
- **GitHub Pages Hosting**: Automatic deployment via GitHub Actions

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── inventory/         # Individual item pages
│   ├── page.tsx           # Master listing page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── InventoryCard.tsx  # Item card component
│   ├── FilterSidebar.tsx   # Left sidebar filters
│   ├── FilterBar.tsx      # Top filter bar
│   ├── ImageGallery.tsx   # Image gallery
│   └── QuoteRequest.tsx   # Quote request modal
├── lib/                    # Utility functions
│   ├── filters.ts         # Filtering logic
│   └── locationParser.ts  # Location parsing
├── types/                  # TypeScript types
├── data/                   # Inventory data (JSON)
├── items/                  # Inventory images
├── scripts/                # Python export scripts
│   ├── export_inventory.py
│   ├── location_parser.py
│   └── push_to_github.py
└── .github/workflows/      # GitHub Actions
```

## Setup

### Prerequisites

- Node.js 20+ and npm
- Python 3.8+ (for export scripts)
- GitHub repository

### Installation

1. Install Node.js dependencies:
```bash
npm install
```

2. Install Python dependencies (for export scripts):
```bash
pip install -r scripts/requirements.txt
```

### Exporting Inventory Data

To export inventory from the SQLite database:

```bash
python scripts/export_inventory.py
```

This will:
- Read from `inventory.db`
- Scan `items/` folder for images
- Generate `data/inventory.json`

### Pushing Updates to GitHub

To export and push updates to GitHub:

1. Set environment variables:
```bash
export GITHUB_TOKEN=your_github_token
export GITHUB_REPO=username/repo-name
```

2. Run the push script:
```bash
python scripts/push_to_github.py
```

This will:
- Export inventory data
- Commit and push to GitHub
- Trigger automatic rebuild and deployment

## Development

### Local Development

```bash
npm run dev
```

Visit http://localhost:3000

### Building for Production

```bash
npm run build
```

Static files will be in the `out/` directory.

## Deployment

The site is automatically deployed to GitHub Pages when:
- Changes are pushed to the `main` branch
- The GitHub Actions workflow runs successfully

### Manual Deployment

1. Build the site: `npm run build`
2. Push the `out/` directory to the `gh-pages` branch (or use GitHub Actions)

### Custom Domain

To use a custom domain (e.g., rsautomation.net/inventory):

1. Update `next.config.js` with the base path:
```javascript
basePath: '/inventory',
```

2. Configure the domain in GitHub Pages settings

## Configuration

### Email for Quote Requests

Update the email address in `components/QuoteRequest.tsx`:
```typescript
window.location.href = `mailto:quotes@rsautomation.net?subject=...`;
```

For production, replace with an API endpoint that sends emails via a service like SendGrid or Resend.

### GitHub Pages Base Path

If deploying to a subdirectory, update `next.config.js`:
```javascript
basePath: '/inventory',
```

## Data Format

The `data/inventory.json` file structure:

```json
{
  "items": [
    {
      "code": "INV-000001",
      "title": "Item Name",
      "category": "Category Name",
      "manufacturer": "Manufacturer",
      "location": "City, State",
      "locationParsed": {
        "city": "City",
        "state": "State",
        "country": "USA",
        "region": "Region"
      },
      "price": 1000.0,
      "currency": "USD",
      "description": "HTML description",
      "images": ["items/INV-000001 - .../photos/photo_1.JPG"]
    }
  ],
  "categories": [...],
  "manufacturers": [...],
  "locations": [...]
}
```

## Troubleshooting

### Images Not Loading

- Ensure image paths in JSON are relative to repository root
- Check that images exist in the `items/` folder structure
- Verify image file extensions match (case-sensitive)

### Build Errors

- Ensure `data/inventory.json` exists
- Check that all required fields are present in JSON
- Verify TypeScript types match the data structure

### GitHub Pages Not Updating

- Check GitHub Actions workflow status
- Verify repository settings allow GitHub Pages
- Ensure workflow has proper permissions

## License

Internal use only.

