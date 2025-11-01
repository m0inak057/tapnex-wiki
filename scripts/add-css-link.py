#!/usr/bin/env python3
"""
Script to add CSS link to all Jain Docs HTML files.
"""

import os
import re
from pathlib import Path

def add_css_link_to_file(file_path):
    """
    Add the ad-container-styles.css link to the HTML file if not already present.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if the CSS is already linked
        if 'ad-container-styles.css' in content:
            return False, "CSS already linked"
        
        # Determine the correct path based on file location
        file_path_str = str(file_path)
        
        if 'Pages' in file_path_str:
            css_link = '    <link rel="stylesheet" href="../styles/ad-container-styles.css">'
        else:
            css_link = '    <link rel="stylesheet" href="styles/ad-container-styles.css">'
        
        # Find </head> and add before it
        if '</head>' in content:
            # Add it right before </head>
            content = content.replace('</head>', f'{css_link}\n</head>')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, "CSS link added"
        else:
            return False, "No </head> tag found"
            
    except Exception as e:
        return False, f"Error: {e}"

def process_jain_docs_files(base_path):
    """
    Process all HTML files in Jain Docs directory.
    """
    jain_docs_path = Path(base_path) / "Jain Docs"
    
    if not jain_docs_path.exists():
        print(f"Error: Jain Docs directory not found at {jain_docs_path}")
        return
    
    print("="*70)
    print("ADDING CSS LINK TO JAIN DOCS FILES")
    print("="*70)
    print()
    
    total_files = 0
    css_added = 0
    
    # Process index.html
    index_file = jain_docs_path / "index.html"
    if index_file.exists():
        print(f"Processing: {index_file.name}")
        total_files += 1
        
        success, msg = add_css_link_to_file(index_file)
        if success:
            css_added += 1
            print(f"  ✓ {msg}")
        else:
            print(f"  ℹ {msg}")
    
    # Process all HTML files in Pages directory
    pages_dir = jain_docs_path / "Pages"
    if pages_dir.exists():
        html_files = list(pages_dir.glob("*.html"))
        print(f"\nProcessing {len(html_files)} files in Pages directory...")
        
        for html_file in html_files:
            total_files += 1
            
            success, msg = add_css_link_to_file(html_file)
            if success:
                css_added += 1
        
        print(f"  ✓ Added CSS link to {css_added - 1} page files")
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Total files processed: {total_files}")
    print(f"Files with CSS link added: {css_added}")
    print("="*70)

if __name__ == "__main__":
    base_path = r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX"
    process_jain_docs_files(base_path)
