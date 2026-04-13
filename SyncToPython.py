"""
Daily inventory sync: copy + compress photos, copy DB, regenerate JSON, git push.

Scheduler (Windows Task Scheduler): run either
  - run_daily_sync.bat   (same folder as this script), or
  - python SyncToPython.py
from this repo’s root directory (or use full paths in the scheduled action).

Test without pushing:  python SyncToPython.py --dry-run
"""

import os
import stat
import shutil
import subprocess
import sys
from datetime import datetime

_SCRIPTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts")
if _SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, _SCRIPTS_DIR)
from photo_compress import copy_tree_with_compressed_photos

# -------------------------------------------------------
# CONFIGURE THESE PATHS
# -------------------------------------------------------
SOURCE_ITEMS = r"C:\Users\sburton\OneDrive - RS Automation\Ebay App\items"
SOURCE_DB    = r"C:\Users\sburton\InventoryApp\inventory.db"
GITHUB_REPO  = r"C:\Users\sburton\Inventory-RSA-main"
# -------------------------------------------------------

DRY_RUN = "--dry-run" in sys.argv

LOCK_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".sync-lock")
LOG_FILE  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sync-log.txt")

def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def run(cmd):
    result = subprocess.run(cmd, cwd=GITHUB_REPO, shell=True,
                            capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"Command failed: {cmd}\n{result.stderr}")
    return result.stdout

def force_remove(path):
    # Forces removal of read-only files on Windows
    def handle_error(func, path, exc_info):
        os.chmod(path, stat.S_IWRITE)
        func(path)
    shutil.rmtree(path, onerror=handle_error)

# --- Lock check ---
if os.path.exists(LOCK_FILE):
    log("Sync already in progress, skipping.")
    exit(0)

open(LOCK_FILE, "w").close()

try:
    log("Starting sync...")

    # Wipe destination items folder and re-copy contents from source
    dest_items = os.path.join(GITHUB_REPO, "items")
    if os.path.exists(dest_items):
        force_remove(dest_items)
    os.makedirs(dest_items)

    for item in os.listdir(SOURCE_ITEMS):
        s = os.path.join(SOURCE_ITEMS, item)
        d = os.path.join(dest_items, item)
        if os.path.isdir(s):
            copy_tree_with_compressed_photos(s, d, log_warn=log)
        else:
            shutil.copy2(s, d)

    log("Copied items folder (photos compressed under each photos/).")

    # Copy database file
    shutil.copy2(SOURCE_DB, os.path.join(GITHUB_REPO, "inventory.db"))
    log("Copied inventory.db.")

    from export_inventory import export_inventory

    log("Exporting data/inventory.json from SQLite...")
    if not export_inventory():
        raise RuntimeError("export_inventory.py failed")
    pub_data = os.path.join(GITHUB_REPO, "public", "data")
    os.makedirs(pub_data, exist_ok=True)
    shutil.copy2(
        os.path.join(GITHUB_REPO, "data", "inventory.json"),
        os.path.join(pub_data, "inventory.json"),
    )
    log("Updated public/data/inventory.json.")

    if DRY_RUN:
        log("Dry run: skipping git add / commit / push.")
    else:
        run("git add .")
        run(f'git commit -m "listings update {datetime.now().isoformat()}" --allow-empty')
        run("git push origin main")

    log("Sync complete.")

except Exception as e:
    log(f"ERROR: {e}")

finally:
    if os.path.exists(LOCK_FILE):
        os.remove(LOCK_FILE)
