#!/usr/bin/env python3
"""
Export inventory data from SQLite database to JSON format for web catalog.
"""

import sqlite3
import json
import os
import glob
from pathlib import Path
from typing import Dict, List, Any
import sys

# Add location parser
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from location_parser import parse_location

def get_database_path():
    """Get the path to the inventory database."""
    script_dir = Path(__file__).parent.parent
    db_path = script_dir / 'inventory.db'
    return db_path

def get_items_folder():
    """Get the path to the items folder."""
    script_dir = Path(__file__).parent.parent
    items_path = script_dir / 'items'
    return items_path

def load_categories(conn: sqlite3.Connection) -> Dict[int, str]:
    """Load all categories from database."""
    cursor = conn.cursor()
    cursor.execute('SELECT id, name FROM Category')
    return {row[0]: row[1] for row in cursor.fetchall()}

def find_item_images(item_code: str, items_folder: Path) -> tuple[List[str], str]:
    """
    Find images for an item by searching for folders matching the inventory code.
    Returns (list of image paths relative to repo root, folder name).
    """
    images = []
    folder_name = None
    
    # Search for folders starting with the inventory code
    pattern = str(items_folder / f"{item_code}*")
    matching_folders = glob.glob(pattern)
    
    if matching_folders:
        # Use the first matching folder
        folder_path = Path(matching_folders[0])
        folder_name = folder_path.name
        
        # Look for photos folder
        photos_folder = folder_path / 'photos'
        if photos_folder.exists():
            # Find all image files
            image_extensions = ['*.jpg', '*.jpeg', '*.JPG', '*.JPEG', '*.png', '*.PNG']
            for ext in image_extensions:
                images.extend(glob.glob(str(photos_folder / ext)))
            
            # Sort images naturally (photo_1, photo_2, etc.)
            images.sort(key=lambda x: (
                int(''.join(filter(str.isdigit, Path(x).stem)) or '0'),
                Path(x).stem
            ))
            
            # Convert to relative paths from repo root
            repo_root = items_folder.parent
            images = [str(Path(img).relative_to(repo_root)).replace('\\', '/') for img in images]
    
    return images, folder_name or ''

def export_inventory():
    """Export inventory data from database to JSON."""
    db_path = get_database_path()
    items_folder = get_items_folder()
    output_path = Path(__file__).parent.parent / 'data' / 'inventory.json'
    
    if not db_path.exists():
        print(f"Error: Database not found at {db_path}")
        return False
    
    if not items_folder.exists():
        print(f"Warning: Items folder not found at {items_folder}")
    
    # Connect to database
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    
    try:
        # Load categories
        categories = load_categories(conn)
        
        # Load all items
        cursor = conn.cursor()
        cursor.execute('''
            SELECT 
                id, inventory_code, category_id, item_name, brand, model_number,
                serial_number, quantity_on_hand, location, condition, sale_price,
                notes, created_at, updated_at
            FROM Item
            ORDER BY inventory_code
        ''')
        
        items = []
        manufacturers_set = set()
        locations_set = set()
        
        for row in cursor.fetchall():
            item_code = row['inventory_code']
            category_id = row['category_id']
            category_name = categories.get(category_id, 'Uncategorized')
            
            # Find images
            images, image_folder = find_item_images(item_code, items_folder)
            
            # Parse location
            location_str = row['location'] or ''
            location_parsed = parse_location(location_str)
            
            # Manufacturer (use brand, fallback to Uncategorized)
            manufacturer = row['brand'] or 'Uncategorized'
            if manufacturer:
                manufacturers_set.add(manufacturer)
            
            if location_str:
                locations_set.add(location_str)
            
            item_data = {
                'code': item_code,
                'title': row['item_name'] or '',
                'category': category_name,
                'categoryId': category_id,
                'manufacturer': manufacturer,
                'brand': row['brand'],
                'modelNumber': row['model_number'],
                'serialNumber': row['serial_number'],
                'location': location_str,
                'locationParsed': location_parsed,
                'price': float(row['sale_price']) if row['sale_price'] else None,
                'currency': 'USD',
                'condition': row['condition'],
                'quantity': row['quantity_on_hand'],
                'description': row['notes'] or '',
                'images': images,
                'imageFolder': image_folder,
            }
            
            items.append(item_data)
        
        # Build output structure
        output_data = {
            'items': items,
            'categories': [{'id': k, 'name': v} for k, v in sorted(categories.items())],
            'manufacturers': sorted(list(manufacturers_set)),
            'locations': sorted(list(locations_set)),
        }
        
        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully exported {len(items)} items to {output_path}")
        print(f"  Categories: {len(output_data['categories'])}")
        print(f"  Manufacturers: {len(output_data['manufacturers'])}")
        print(f"  Locations: {len(output_data['locations'])}")
        
        return True
        
    except Exception as e:
        print(f"Error exporting inventory: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        conn.close()

if __name__ == '__main__':
    success = export_inventory()
    sys.exit(0 if success else 1)

