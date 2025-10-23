#!/usr/bin/env python3
"""
Fix CSS and JS path references in Jain Docs HTML files.
This script updates incorrect path references to point to the correct locations.
"""

import os
import re
import glob

def fix_paths_in_file(file_path):
    """Fix CSS and JS paths in a single HTML file."""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix CSS path references
        content = re.sub(
            r'<link rel="stylesheet" href="../../additional-ad-styles\.css">',
            '<link rel="stylesheet" href="../additional-ad-styles.css">',
            content
        )
        
        content = re.sub(
            r'<link rel="stylesheet" href="../../styles/article-styles\.css">',
            '<link rel="stylesheet" href="../styles/article-styles.css">',
            content
        )
        
        # Fix JS script references
        content = re.sub(
            r'<script src="../../scripts/article-scripts\.js" defer></script>',
            '<script src="../scripts/article-scripts.js" defer></script>',
            content
        )
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed paths in: {file_path}")
            return True
        else:
            print(f"No changes needed in: {file_path}")
            return False
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to fix all HTML files in the Pages directory."""
    
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    pages_dir = os.path.join(script_dir, 'Pages')
    
    if not os.path.exists(pages_dir):
        print(f"Pages directory not found: {pages_dir}")
        return
    
    # Find all HTML files in the Pages directory
    html_pattern = os.path.join(pages_dir, '**/*.html')
    html_files = glob.glob(html_pattern, recursive=True)
    
    if not html_files:
        print("No HTML files found in the Pages directory.")
        return
    
    print(f"Found {len(html_files)} HTML files to process...")
    
    fixed_count = 0
    total_count = len(html_files)
    
    for html_file in html_files:
        if fix_paths_in_file(html_file):
            fixed_count += 1
    
    print(f"\nProcessing complete!")
    print(f"Total files processed: {total_count}")
    print(f"Files with fixes applied: {fixed_count}")
    print(f"Files that needed no changes: {total_count - fixed_count}")

if __name__ == "__main__":
    main()