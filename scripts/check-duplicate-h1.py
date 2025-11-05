#!/usr/bin/env python3
"""
Check for duplicate H1 tags in HTML files.
"""

import os
import re
from pathlib import Path

def count_h1_tags(file_path):
    """Count H1 tags in a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all H1 tags (opening tags)
        h1_pattern = r'<h1[^>]*>'
        h1_matches = re.findall(h1_pattern, content, re.IGNORECASE)
        
        return len(h1_matches), h1_matches
            
    except Exception as e:
        return 0, []

def main():
    """Check all HTML files for duplicate H1 tags."""
    base_path = Path(r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX")
    
    directories = [
        base_path / "EVENT-MANAGEMENT",
        base_path / "MARKETING",
        base_path / "TECHNOLOGY"
    ]
    
    print("Checking for duplicate H1 tags...")
    print("=" * 70)
    
    files_with_multiple_h1 = []
    total_files = 0
    
    for directory in directories:
        if not directory.exists():
            continue
        
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith('.html'):
                    total_files += 1
                    file_path = os.path.join(root, file)
                    count, matches = count_h1_tags(file_path)
                    
                    if count > 1:
                        rel_path = Path(file_path).relative_to(base_path)
                        files_with_multiple_h1.append((rel_path, count))
                        print(f"⚠ MULTIPLE H1: {rel_path} ({count} H1 tags)")
    
    print("\n" + "=" * 70)
    print(f"\nSummary:")
    print(f"  Total HTML files checked: {total_files}")
    print(f"  Files with multiple H1 tags: {len(files_with_multiple_h1)}")
    print(f"  Files with single H1: {total_files - len(files_with_multiple_h1)}")
    
    if len(files_with_multiple_h1) == 0:
        print(f"\n✅ EXCELLENT! All files have correct H1 structure!")
        print("   No duplicate H1 tags found. Your pages are SEO-compliant!")
    else:
        print(f"\n⚠ Found {len(files_with_multiple_h1)} files with duplicate H1 tags:")
        for file, count in files_with_multiple_h1:
            print(f"   - {file}: {count} H1 tags")

if __name__ == "__main__":
    main()
