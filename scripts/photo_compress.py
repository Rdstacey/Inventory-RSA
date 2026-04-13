"""
Compress inventory photos when copying into the Git repo copy of `items/`.
Only files inside a folder named `photos` (any case) are re-encoded; other
files are copied unchanged.
"""

from __future__ import annotations

import os
import shutil
from pathlib import Path

from PIL import Image, ImageOps

# Tune for smaller repo / faster Pages loads vs. visible quality
JPEG_QUALITY = 85
WEBP_QUALITY = 82
PNG_COMPRESS_LEVEL = 9

_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def compress_image(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    ext = src.suffix.lower()
    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img)
        if ext in (".jpg", ".jpeg"):
            rgb = img.convert("RGB")
            rgb.save(
                dst,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
                progressive=True,
            )
        elif ext == ".png":
            img.save(dst, format="PNG", optimize=True, compress_level=PNG_COMPRESS_LEVEL)
        elif ext == ".webp":
            img.save(dst, format="WEBP", quality=WEBP_QUALITY, method=6)
        else:
            shutil.copy2(src, dst)


def copy_tree_with_compressed_photos(
    src_dir: str | Path,
    dst_dir: str | Path,
    log_warn,
) -> None:
    """Mirror src_dir into dst_dir; re-compress images under any `photos/` folder."""
    src_dir = Path(src_dir).resolve()
    dst_dir = Path(dst_dir).resolve()
    dst_dir.mkdir(parents=True, exist_ok=True)

    for root, _dirs, files in os.walk(src_dir):
        root_p = Path(root)
        rel = root_p.relative_to(src_dir)
        dst_root = dst_dir / rel
        dst_root.mkdir(parents=True, exist_ok=True)
        in_photos = root_p.name.lower() == "photos"

        for name in files:
            src_f = root_p / name
            dst_f = dst_root / name
            if in_photos and src_f.suffix.lower() in _IMAGE_SUFFIXES:
                try:
                    compress_image(src_f, dst_f)
                except Exception as e:
                    log_warn(f"Compress failed for {src_f}, copying original: {e}")
                    shutil.copy2(src_f, dst_f)
            else:
                shutil.copy2(src_f, dst_f)
