#!/usr/bin/env python3
"""
Fix AdSense ad placement in Jain Docs pages - Version 2.
This script properly places all ads within the article entry-content div.
"""

import os
import re
from pathlib import Path

def fix_html_structure_v2(content):
    """
    Fix the HTML structure to properly place ads within the article entry-content div.
    """
    
    # Find all ad blocks in the content
    ad_pattern = r'<!-- AdSense.*?</script>\s*</div>'
    ads = re.findall(ad_pattern, content, re.DOTALL)
    
    # Remove all ad blocks from the content temporarily
    content_without_ads = re.sub(ad_pattern, '', content, flags=re.DOTALL)
    
    # Find the closing tag of entry-content div that comes before </article>
    # We need to place ads just before these closing tags
    article_closing_pattern = r'(</article>)'
    
    if ads and re.search(article_closing_pattern, content_without_ads):
        # Build the ads section with proper indentation
        ads_section = '\n\n'
        for ad in ads:
            # Add proper indentation to each ad
            ads_section += '            ' + ad.strip() + '\n\n'
        
        # Insert ads before the closing tags of entry-content and article
        # Find the pattern where article closes
        fixed_content = re.sub(
            r'(\s*)(</article>)',
            lambda m: f'{ads_section}        </div>\n    </div>\n</article>',
            content_without_ads,
            count=1
        )
        
        return fixed_content
    
    return content

def process_file_v2(file_path):
    """Process a single HTML file - version 2."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has ads and article structure
        if 'AdSense' in content and '<article>' in content:
            original_content = content
            fixed_content = fix_html_structure_v2(content)
            
            if fixed_content != original_content:
                # Write fixed content (backup already exists from v1)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                
                return True, "Fixed v2"
            else:
                return False, "No changes needed v2"
        else:
            return False, "Pattern not found v2"
            
    except Exception as e:
        return False, f"Error v2: {str(e)}"

def main():
    """Main function to process all Jain Docs pages."""
    base_dir = Path(r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\Jain Docs\Pages")
    
    if not base_dir.exists():
        print(f"Directory not found: {base_dir}")
        return
    
    html_files = list(base_dir.glob("*.html"))
    total_files = len(html_files)
    fixed_count = 0
    error_count = 0
    
    print(f"Version 2: Processing {total_files} HTML files...")
    print("-" * 60)
    
    for i, file_path in enumerate(html_files, 1):
        success, message = process_file_v2(file_path)
        
        if success:
            fixed_count += 1
            status = "✓ FIXED V2"
            if i % 10 == 0 or success:
                print(f"[{i}/{total_files}] {status}: {file_path.name}")
        elif "Error" in message:
            error_count += 1
            status = "✗ ERROR V2"
            print(f"[{i}/{total_files}] {status}: {file_path.name}")
    
    print("-" * 60)
    print(f"\nVersion 2 Summary:")
    print(f"  Total files: {total_files}")
    print(f"  Fixed: {fixed_count}")
    print(f"  Skipped: {total_files - fixed_count - error_count}")
    print(f"  Errors: {error_count}")

if __name__ == "__main__":
    main()
