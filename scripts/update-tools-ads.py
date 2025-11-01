#!/usr/bin/env python3
"""
Script to replace all AdSense ad scripts in Tools pages with new in-article ad format.
This replaces old ad formats with the new in-article ads that work better across the site.
"""

import os
import re
from pathlib import Path

# New ad script that will replace all existing ad blocks
NEW_AD_SCRIPT = '''<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4315586112110103"
     crossorigin="anonymous"></script>
<!-- jain docs -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-4315586112110103"
     data-ad-slot="6328898375"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>'''

def find_and_replace_ad_blocks(file_path):
    """
    Find and replace all AdSense ad blocks in a file.
    Returns the number of replacements made.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements = 0
        
        # Pattern to match the complete ad block structure
        # This matches: <script async src="...adsbygoogle.js..."> ... </script> (the push part)
        ad_block_pattern = r'<script async src="https://pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js\?client=ca-pub-4315586112110103"[^>]*>.*?</script>\s*(?:<!--.*?-->)?\s*<ins class="adsbygoogle"[^>]*>.*?</ins>\s*<script>\s*\(adsbygoogle = window\.adsbygoogle \|\| \[\]\)\.push\({}\);\s*</script>'
        
        # Replace all occurrences
        content, count = re.subn(ad_block_pattern, NEW_AD_SCRIPT, content, flags=re.DOTALL)
        replacements += count
        
        # If content changed, write it back
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return replacements
        
        return 0
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0

def process_tools_directory(base_path):
    """
    Process all HTML files in the TOOLS directory.
    """
    tools_path = Path(base_path) / "TOOLS"
    
    if not tools_path.exists():
        print(f"Error: TOOLS directory not found at {tools_path}")
        return
    
    total_files = 0
    total_replacements = 0
    files_modified = 0
    
    print("="*70)
    print("TOOLS AD SCRIPT UPDATER")
    print("="*70)
    print(f"Base path: {base_path}")
    print(f"Target: TOOLS directory")
    print("="*70)
    print()
    
    # Process main index.html in TOOLS root
    index_file = tools_path / "index.html"
    if index_file.exists():
        print(f"Processing: TOOLS/index.html")
        replacements = find_and_replace_ad_blocks(index_file)
        total_files += 1
        if replacements > 0:
            total_replacements += replacements
            files_modified += 1
            print(f"  ✓ Replaced {replacements} ad block(s)")
    
    # Process all HTML files in tool subdirectories
    html_files = list(tools_path.glob("*/index.html"))
    print(f"\nFound {len(html_files)} tool pages")
    print()
    
    for html_file in html_files:
        tool_name = html_file.parent.name
        total_files += 1
        replacements = find_and_replace_ad_blocks(html_file)
        if replacements > 0:
            total_replacements += replacements
            files_modified += 1
            print(f"  ✓ {tool_name}: Replaced {replacements} ad block(s)")
    
    # Summary
    print("\n" + "="*70)
    print("REPLACEMENT SUMMARY")
    print("="*70)
    print(f"Total files processed: {total_files}")
    print(f"Files modified: {files_modified}")
    print(f"Total ad blocks replaced: {total_replacements}")
    print("="*70)
    print("\n✅ All ad scripts have been updated to the new in-article format!")
    print("📌 New ad slot ID: 6328898375")
    print("📌 Ad format: Auto (responsive, in-article)")

if __name__ == "__main__":
    # Base path (parent directory of TOOLS)
    base_path = r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX"
    
    process_tools_directory(base_path)
