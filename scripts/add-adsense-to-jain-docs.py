#!/usr/bin/env python3
"""
Script to add AdSense script to all Jain Docs HTML files
Adds the ad before the closing </article> tag or before the footer
"""

import os
import re
from pathlib import Path

# Define the new AdSense ad block
NEW_AD_BLOCK = '''
                    <!-- AdSense - In-Feed Ad -->
                    <div class="ad-container article-bottom-ad">
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
        
        # Strategy 1: Try to add before </article> tag
        if '</article>' in content:
            # Add the ad just before </article>
            pattern = r'(\s*)</article>'
            replacement = NEW_AD_BLOCK + r'\1</article>'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                return True
        
        # Strategy 2: Try to add before </main> tag
        if '</main>' in content:
            pattern = r'(\s*)</main>'
            replacement = NEW_AD_BLOCK + r'\1</main>'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                return True
        
        # Strategy 3: Try to add before footer
        if '<footer' in content:
            pattern = r'(\s*)<footer'
            replacement = NEW_AD_BLOCK + r'\1<footer'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                return True
        
        print(f"⚠️  Could not find suitable location in: {file_path.name}")
        return False
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    # Base directory
    base_dir = Path(r'c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\Jain Docs')
    
    # Find all HTML files in Pages directory
    pages_dir = base_dir / 'Pages'
    html_files = list(pages_dir.glob('*.html'))
    
    # Also check index.html in main Jain Docs directory
    index_file = base_dir / 'index.html'
    if index_file.exists():
        html_files.append(index_file)
    
    print(f"Found {len(html_files)} HTML files in Jain Docs")
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
