# Inventory Manager

A Python desktop application for managing inventory in a small automation/process engineering shop.

## Features

- **Multi-user inventory tracking** with data stored on a shared network drive
- **Custom categories** with user-defined fields (Pumps, Valves, Motors, etc.)
- **Photo management** with automatic thumbnail generation
- **Global sequential inventory codes** (INV-000001 format) with concurrency-safe generation
- **Sortable and filterable** main inventory list
- **Label printing** with QR codes and barcodes
- **Purchase and Sale Price** tracking

## Requirements

- Python 3.8 or higher
- Access to a network share (or local directory for testing)
- Windows, macOS, or Linux

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

The application uses a network share to store data. By default, it uses:
- Windows: `\\SERVER\Share\InventoryApp`
- Development: `~/InventoryApp` (your home directory)

To change the network share location, set the `INVENTORY_NETWORK_SHARE` environment variable:

**Windows (PowerShell):**
```powershell
$env:INVENTORY_NETWORK_SHARE = "\\SERVER\Share\InventoryApp"
```

**Windows (Command Prompt):**
```cmd
set INVENTORY_NETWORK_SHARE=\\SERVER\Share\InventoryApp
```

**Linux/macOS:**
```bash
export INVENTORY_NETWORK_SHARE=/path/to/share
```

## Running the Application

```bash
python main.py
```

## First Run

On first run, the application will:
1. Create the database schema
2. Initialize the inventory code sequence (starts at 1)
3. Seed example categories (Pumps, Valves, Motors, Sensors, Controllers) with custom fields

## Usage

### Creating Items

1. Click "New Item" - the system will automatically generate the next inventory code
2. Fill in item details (name, category, brand, model, etc.)
3. Add photos if desired
4. Set purchase and sale prices
5. Fill in any custom fields for the selected category
6. Click "Save"

### Managing Categories

1. Click "Manage Categories"
2. Create new categories or edit existing ones
3. Add custom fields to categories (text, number, dropdown, boolean, date)
4. Custom fields can be required or optional

### Printing Labels

1. Open an item for editing
2. Click "Print Label"
3. The label includes:
   - Large inventory code
   - QR code (contains JSON with code, name, category)
   - Code128 barcode
   - Optional item name and category

### Setting Starting Inventory Number

1. Click "Admin: Set Starting Number"
2. Enter the desired starting number
3. This is useful if you want to start from a specific number (e.g., 1000)

## Database Structure

The application uses SQLite with WAL (Write-Ahead Logging) mode for better multi-user concurrency.

**Tables:**
- `AppSequence` - Stores the next inventory number (single row)
- `Category` - Item categories
- `CategoryField` - Custom fields for each category
- `Item` - Inventory items
- `ItemFieldValue` - Values for custom fields
- `ItemPhoto` - Photo records

## File Structure

```
InventoryApp/
├── inventory.db          # SQLite database
├── items/                # Item photos and thumbnails
│   └── INV-000001/
│       ├── photos/       # Original photos
│       └── thumbs/       # Generated thumbnails
```

## Inventory Code Format

- Default prefix: `INV-`
- Default width: 6 digits
- Format: `INV-000001`, `INV-000002`, etc.
- Configurable in `config.py`

## Troubleshooting

### "Database is locked" errors

The application includes automatic retry logic for database locks. If you see this error frequently:
- Ensure the network share has proper permissions
- Check that WAL mode is enabled (it should be automatic)
- Reduce concurrent users if possible

### Network share not accessible

- Verify the network path is correct
- Check Windows file sharing permissions
- Ensure the share is mapped or accessible via UNC path
- For testing, use a local directory path

### Photos not displaying

- Check that photo files exist in the items folder
- Verify file permissions on the network share
- Check the log file for errors

## Logging

The application logs to:
- Console output
- `inventory_manager.log` file (in the application directory)

## License

This is a custom application for internal use.


