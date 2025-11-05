#!/usr/bin/env python3
"""
Fix AdSense ad placement in Jain Docs pages.
This script restructures the HTML to properly place ads within the article content area.
"""

import os
import re
from pathlib import Path

def fix_html_structure(content):
    """
    Fix the HTML structure to properly place ads within the article content.
    """
    
    # Pattern to match the malformed article opening with all divs on one line
    # This captures the article opening tag through the entry-content div
    article_pattern = r'<article><div class="ast-post-format- single-layout-1"><header class="entry-header"><h1 class="entry-title" itemprop="headline">(.*?)</h1>\s*</header><div class="entry-content clear"([^>]*)itemprop="text">(.*?)</div></div></div>'
    
    def replace_article(match):
        h1_content = match.group(1)
        entry_attrs = match.group(2)
        content_start = match.group(3)
        
        # Reconstruct with proper formatting and keep the content div open
        new_structure = f'''<article>
    <div class="ast-post-format- single-layout-1">
        <header class="entry-header">
            <h1 class="entry-title" itemprop="headline">{h1_content}</h1>
        </header>
        <div class="entry-content clear"{entry_attrs}itemprop="text">
{content_start}'''
        
        return new_structure
    
    # Apply the fix
    fixed_content = re.sub(article_pattern, replace_article, content, flags=re.DOTALL)
    
    # Now we need to find where the ads are placed and move the first ad inside the content
    # Find the position of the first AdSense ad block that's outside the article
    
    # Pattern to find ads that appear right after the malformed closing tags
    ad_outside_pattern = r'(</div>)\s*\n\s*\n\s*(<!-- AdSense - In-Content Ad -->.*?</script>\s*</div>)'
    
    def move_ad_inside(match):
        # Keep one closing div, move ad inside, then close remaining divs
        ad_block = match.group(2)
        return f'\n\n            {ad_block}\n        </div>\n    </div>\n</div>'
    
    fixed_content = re.sub(ad_outside_pattern, move_ad_inside, fixed_content, count=1, flags=re.DOTALL)
    
    # Now handle the remaining ads that are outside the article tag
    # These should be moved inside the article, before the closing article tag
    
    # Find where </article> is and move ads before it
    article_end_pattern = r'\s*</article>'
    
    # Find all ad blocks that come after </article>
    ads_after_article_pattern = r'</article>\s*((?:<!-- AdSense.*?</div>\s*)+)'
    
    match = re.search(ads_after_article_pattern, fixed_content, re.DOTALL)
    if match:
        ads_blocks = match.group(1)
        # Remove ads from after article
        fixed_content = re.sub(ads_after_article_pattern, '</article>', fixed_content, flags=re.DOTALL)
        # Add ads before </article>
        fixed_content = re.sub(r'(\s*</div>\s*</div>\s*</article>)', 
                               f'\n\n{ads_blocks}\n        </div>\n    </div>\n</article>', 
                               fixed_content, count=1)
    
    return fixed_content

def process_file(file_path):
    """Process a single HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has the problematic pattern
        if '<article><div class="ast-post-format- single-layout-1">' in content:
            original_content = content
            fixed_content = fix_html_structure(content)
            
            if fixed_content != original_content:
                # Backup original file
                backup_path = str(file_path) + '.backup'
                with open(backup_path, 'w', encoding='utf-8') as f:
                    f.write(original_content)
                
                # Write fixed content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                
                return True, "Fixed"
            else:
                return False, "No changes needed"
        else:
            return False, "Pattern not found"
            
    except Exception as e:
        return False, f"Error: {str(e)}"

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
    
    print(f"Found {total_files} HTML files to process...")
    print("-" * 60)
    
    for i, file_path in enumerate(html_files, 1):
        success, message = process_file(file_path)
        
        if success:
            fixed_count += 1
            status = "✓ FIXED"
        elif "Error" in message:
            error_count += 1
            status = "✗ ERROR"
        else:
            status = "- SKIP"
        
        if i % 10 == 0 or success or "Error" in message:
            print(f"[{i}/{total_files}] {status}: {file_path.name}")
    
    print("-" * 60)
    print(f"\nSummary:")
    print(f"  Total files: {total_files}")
    print(f"  Fixed: {fixed_count}")
    print(f"  Skipped: {total_files - fixed_count - error_count}")
    print(f"  Errors: {error_count}")
    print(f"\nBackup files created with .backup extension")

if __name__ == "__main__":
    main()
