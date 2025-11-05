#!/usr/bin/env python3
"""
Robust Ad Removal Script - Batch Processing
Handles encoding issues and processes files safely
"""

import re
import os
import sys

# Force UTF-8 encoding for console output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Pattern to match ad blocks
AD_BLOCK_PATTERN = re.compile(
    r'<!-- AdSense.*?-->\s*'
    r'<div class="ad-container[^>]*>.*?'
    r'<script async src="https://pagead2\.googlesyndication\.com.*?</script>\s*'
    r'<ins class="adsbygoogle".*?</ins>\s*'
    r'<script>.*?\(adsbygoogle = window\.adsbygoogle.*?</script>\s*'
    r'</div>',
    re.DOTALL | re.MULTILINE
)

def remove_ads_from_file(file_path):
    """Remove ad blocks from a single file"""
    try:
        # Read with UTF-8 encoding
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            original_content = f.read()
        
        # Count ad blocks
        ad_matches = list(AD_BLOCK_PATTERN.finditer(original_content))
        ad_count = len(ad_matches)
        
        if ad_count == 0:
            return True, 0, "No ads"
        
        # Remove ad blocks
        new_content = AD_BLOCK_PATTERN.sub('', original_content)
        
        # Verify important content markers still exist
        if '<body' in original_content and '<body' not in new_content:
            return False, 0, "ERROR: Body tag removed"
        
        if '</body>' in original_content and '</body>' not in new_content:
            return False, 0, "ERROR: Closing body tag removed"
        
        # Write cleaned content
        with open(file_path, 'w', encoding='utf-8', errors='ignore') as f:
            f.write(new_content)
        
        return True, ad_count, "OK"
        
    except Exception as e:
        return False, 0, f"Error: {str(e)[:50]}"

def process_jain_docs():
    """Process all Jain Docs files"""
    import glob
    
    files = glob.glob("Jain Docs/Pages/*.html")
    total = len(files)
    processed = 0
    success = 0
    failed = 0
    no_ads = 0
    total_ads_removed = 0
    
    print(f"Processing {total} files...")
    print("="*60)
    
    for i, file_path in enumerate(files, 1):
        filename = os.path.basename(file_path)
        # Truncate long filenames for display
        display_name = filename[:40] + "..." if len(filename) > 40 else filename
        
        status, ad_count, message = remove_ads_from_file(file_path)
        processed += 1
        
        if status:
            if ad_count > 0:
                success += 1
                total_ads_removed += ad_count
                print(f"[{i}/{total}] OK - {ad_count} ads - {display_name}")
            else:
                no_ads += 1
                print(f"[{i}/{total}] SKIP - {display_name}")
        else:
            failed += 1
            print(f"[{i}/{total}] FAIL - {display_name} - {message}")
        
        # Progress update every 25 files
        if i % 25 == 0:
            print(f"\nProgress: {i}/{total} files processed\n")
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total files: {total}")
    print(f"Successfully cleaned: {success}")
    print(f"No ads found: {no_ads}")
    print(f"Failed: {failed}")
    print(f"Total ads removed: {total_ads_removed}")
    print("="*60)

if __name__ == "__main__":
    try:
        process_jain_docs()
    except KeyboardInterrupt:
        print("\n\nStopped by user")
    except Exception as e:
        print(f"\nFatal error: {e}")
