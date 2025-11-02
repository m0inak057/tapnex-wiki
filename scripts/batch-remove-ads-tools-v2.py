#!/usr/bin/env python3
"""
Batch remove AdSense ads from all HTML files in TOOLS folder
Updated pattern to catch ads without comments
"""

import os
import re
import glob
import sys
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Regex pattern to match complete ad blocks (with or without comment)
AD_BLOCK_PATTERN = re.compile(
    r'(?:<!-- AdSense.*?-->)?\s*'
    r'<div class="ad-container[^>]*>.*?</div>',
    re.DOTALL | re.MULTILINE
)

def remove_ads_from_file(file_path):
    """Remove all ad blocks from a file. Returns (success, ad_count, message)"""
    try:
        # Read file
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            original_content = f.read()
        
        # Check if file has ads
        ads_found = AD_BLOCK_PATTERN.findall(original_content)
        if not ads_found:
            return True, 0, "SKIP - No ads found"
        
        # Remove ads
        new_content = AD_BLOCK_PATTERN.sub('', original_content)
        
        # Basic integrity check - ensure body tag still exists
        if '<body' in original_content and '<body' not in new_content:
            return False, 0, "ERROR: Body tag removed"
        if '</body>' in original_content and '</body>' not in new_content:
            return False, 0, "ERROR: Closing body tag removed"
        
        # Create backup
        backup_path = file_path + '.backup'
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
        
        # Write cleaned content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        ad_count = len(ads_found)
        bytes_saved = len(original_content) - len(new_content)
        
        return True, ad_count, f"OK - {ad_count} ads"
        
    except Exception as e:
        return False, 0, f"ERROR: {str(e)}"

def main():
    # Get all HTML files recursively in TOOLS folder
    html_files = []
    for root, dirs, files in os.walk("TOOLS"):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    total_files = len(html_files)
    print(f"Processing {total_files} files...")
    print("=" * 60)
    
    success_count = 0
    skip_count = 0
    fail_count = 0
    total_ads_removed = 0
    
    for i, file_path in enumerate(html_files, 1):
        # Get short filename for display (max 40 chars)
        display_name = os.path.basename(file_path)
        if len(display_name) > 40:
            display_name = display_name[:37] + "..."
        
        success, ad_count, message = remove_ads_from_file(file_path)
        
        if success and ad_count > 0:
            success_count += 1
            total_ads_removed += ad_count
            print(f"[{i}/{total_files}] {message} - {display_name}")
        elif success and ad_count == 0:
            skip_count += 1
            print(f"[{i}/{total_files}] {message} - {display_name}")
        else:
            fail_count += 1
            print(f"[{i}/{total_files}] {message} - {display_name}")
        
        # Progress update every 10 files
        if i % 10 == 0:
            print(f"\nProgress: {i}/{total_files} files processed\n")
    
    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total files: {total_files}")
    print(f"Successfully cleaned: {success_count}")
    print(f"No ads found: {skip_count}")
    print(f"Failed: {fail_count}")
    print(f"Total ads removed: {total_ads_removed}")
    print("=" * 60)

if __name__ == "__main__":
    main()
