#!/usr/bin/env python3
"""
Script to add ad-container-styles.css to all Tools pages.
"""

import os
import re
from pathlib import Path

def add_css_link_to_tool_page(file_path):
    """
    Add the ad-container-styles.css link to the tool page if not already present.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if the CSS is already linked
        if 'ad-container-styles.css' in content:
            return False, "CSS already linked"
        
        # CSS link to add
        css_link = '    <link rel="stylesheet" href="/TOOLS/shared/ad-container-styles.css">\n'
        
        # Try to find </head> tag
        if '</head>' in content:
            # Add before </head>
            content = content.replace('</head>', css_link + '</head>')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, "CSS link added"
        else:
            return False, "No </head> tag found"
            
    except Exception as e:
        return False, f"Error: {e}"

def process_tools_directory(base_path):
    """
    Process all index.html files in TOOLS directory.
    """
    tools_path = Path(base_path) / "TOOLS"
    
    if not tools_path.exists():
        print(f"Error: TOOLS directory not found at {tools_path}")
        return
    
    print("="*70)
    print("ADDING AD CONTAINER CSS TO TOOLS PAGES")
    print("="*70)
    print()
    
    total_files = 0
    css_added = 0
    
    # Find all index.html files in TOOLS subdirectories
    html_files = list(tools_path.glob("*/index.html"))
    
    # Also include main tools index
    main_index = tools_path / "index.html"
    if main_index.exists():
        html_files.insert(0, main_index)
    
    print(f"Found {len(html_files)} tool pages to process\n")
    
    for html_file in html_files:
        total_files += 1
        tool_name = html_file.parent.name if html_file.name == "index.html" else "Main"
        
        success, msg = add_css_link_to_tool_page(html_file)
        if success:
            css_added += 1
            print(f"  ✓ {tool_name}: {msg}")
        elif "already linked" not in msg:
            print(f"  ✗ {tool_name}: {msg}")
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Total files processed: {total_files}")
    print(f"Files with CSS link added: {css_added}")
    print(f"Files already had CSS: {total_files - css_added}")
    print("="*70)
    print("\n✅ All tool pages updated!")
    print(f"\n📁 CSS File Location: TOOLS/shared/ad-container-styles.css")

if __name__ == "__main__":
    base_path = r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX"
    process_tools_directory(base_path)
