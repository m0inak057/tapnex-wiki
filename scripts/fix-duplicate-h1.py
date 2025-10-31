#!/usr/bin/env python3
"""
Fix duplicate H1 tags in article pages.
Replaces <h1>Wiki</h1> in sidebar with <span class="sidebar-logo-text">Wiki</span>
"""

import os
import re
from pathlib import Path

def fix_h1_in_file(file_path):
    """Fix duplicate H1 tag in a single HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has the problematic H1 in sidebar
        # Pattern: <h1>Wiki</h1> within the sidebar logo section
        pattern = r'<h1>Wiki</h1>'
        replacement = r'<span class="sidebar-logo-text">Wiki</span>'
        
        if pattern in content:
            original_content = content
            fixed_content = content.replace(pattern, replacement)
            
            if fixed_content != original_content:
                # Write fixed content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                
                return True, "Fixed H1"
            else:
                return False, "No changes"
        else:
            return False, "Pattern not found"
            
    except Exception as e:
        return False, f"Error: {str(e)}"

def process_directory(base_dir):
    """Process all HTML files in a directory recursively."""
    html_files = []
    
    # Find all index.html files recursively
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    return html_files

def main():
    """Main function to fix H1 tags in all article pages."""
    base_path = Path(r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX")
    
    # Directories to process
    directories = [
        base_path / "EVENT-MANAGEMENT",
        base_path / "MARKETING",
        base_path / "TECHNOLOGY"
    ]
    
    total_files = 0
    fixed_count = 0
    error_count = 0
    
    print("Fixing duplicate H1 tags in article pages...")
    print("=" * 70)
    
    for directory in directories:
        if not directory.exists():
            print(f"⚠ Directory not found: {directory}")
            continue
        
        print(f"\nProcessing: {directory.name}/")
        print("-" * 70)
        
        html_files = process_directory(directory)
        dir_fixed = 0
        
        for file_path in html_files:
            total_files += 1
            success, message = fix_h1_in_file(file_path)
            
            if success:
                fixed_count += 1
                dir_fixed += 1
                # Get relative path for display
                rel_path = Path(file_path).relative_to(base_path)
                print(f"✓ FIXED: {rel_path}")
            elif "Error" in message:
                error_count += 1
                rel_path = Path(file_path).relative_to(base_path)
                print(f"✗ ERROR: {rel_path} - {message}")
        
        print(f"  → Fixed {dir_fixed} files in {directory.name}/")
    
    print("\n" + "=" * 70)
    print(f"\nSummary:")
    print(f"  Total HTML files scanned: {total_files}")
    print(f"  Files with H1 fixed: {fixed_count}")
    print(f"  Files unchanged: {total_files - fixed_count - error_count}")
    print(f"  Errors: {error_count}")
    
    if fixed_count > 0:
        print(f"\n✅ Successfully fixed {fixed_count} files!")
        print("\n⚠ NEXT STEP: Add CSS to /styles/article-styles.css")

if __name__ == "__main__":
    main()
