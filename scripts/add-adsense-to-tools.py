#!/usr/bin/env python3
"""
Script to add new AdSense script to all TOOLS HTML files
Adds the ad with slot 1056713798 before closing </body> tag
"""

import os
import re
from pathlib import Path

# Define the new AdSense ad block
NEW_AD_BLOCK = '''
    <!-- AdSense - In-Feed Ad -->
    <div class="ad-container" style="margin-top: 3rem;">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4315586112110103"
             crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-format="autorelaxed"
             data-ad-client="ca-pub-4315586112110103"
             data-ad-slot="1056713798"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>
'''

def add_adsense_to_file(file_path):
    """Add AdSense ad to a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if this specific ad slot is already present
        if 'data-ad-slot="1056713798"' in content:
            print(f"⏭️  Ad already exists in: {file_path.name}")
            return False
        
        # Check if this is a valid HTML file with body tag
        if '</body>' not in content:
            print(f"⚠️  No </body> tag found in: {file_path.name}")
            return False
        
        # Add the ad just before </body>
        pattern = r'(\s*)</body>'
        replacement = NEW_AD_BLOCK + r'\1</body>'
        new_content = re.sub(pattern, replacement, content, count=1)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        print(f"⚠️  Could not add ad to: {file_path.name}")
        return False
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    # Base directory
    base_dir = Path(r'c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\TOOLS')
    
    # Find all HTML files in TOOLS directory
    html_files = list(base_dir.rglob('*.html'))
    
    # Filter out the shared footer file
    html_files = [f for f in html_files if 'shared' not in str(f)]
    
    print(f"Found {len(html_files)} HTML files in TOOLS")
    print("=" * 60)
    
    success_count = 0
    skipped_count = 0
    failed_count = 0
    
    for html_file in html_files:
        result = add_adsense_to_file(html_file)
        if result is True:
            print(f"✅ Added ad to: {html_file.relative_to(base_dir.parent)}")
            success_count += 1
        elif result is False and 'already exists' in str(result):
            skipped_count += 1
        else:
            failed_count += 1
    
    print("=" * 60)
    print(f"\n📊 Summary:")
    print(f"   ✅ Successfully added ads: {success_count} files")
    print(f"   ⏭️  Already had ad (skipped): {skipped_count} files")
    print(f"   ❌ Failed: {failed_count} files")
    print(f"   📁 Total processed: {len(html_files)} files")

if __name__ == "__main__":
    main()
