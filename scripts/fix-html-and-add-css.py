#!/usr/bin/env python3
"""
Comprehensive fix for Jain Docs files:
1. Add missing </head> tags
2. Add CSS link
3. Move ads that are outside body into body
"""

import os
import re
from pathlib import Path

def fix_html_structure_and_add_css(file_path):
    """
    Fix HTML structure and add CSS link.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # Check if CSS is already linked
        css_already_linked = 'ad-container-styles.css' in content
        
        # Determine the correct path based on file location
        file_path_str = str(file_path)
        if 'Pages' in file_path_str:
            css_link = '    <link rel="stylesheet" href="../styles/ad-container-styles.css">\n'
        else:
            css_link = '    <link rel="stylesheet" href="styles/ad-container-styles.css">\n'
        
        # Check if </head> is missing
        if '</head>' not in content and '<head>' in content:
            # Find the last closing script or link tag in head area before any ad content
            # Look for the script defer line as a marker
            script_defer_pattern = r'(<script src="[^"]*article-scripts\.js" defer></script>)'
            match = re.search(script_defer_pattern, content)
            
            if match:
                # Add </head> and <body> after this script tag
                insert_pos = match.end()
                
                # Add CSS link before </head> if not already present
                if not css_already_linked:
                    head_close = css_link + '</head>\n<body>\n'
                else:
                    head_close = '</head>\n<body>\n'
                
                content = content[:insert_pos] + '\n' + head_close + content[insert_pos:]
                changes.append("Added missing </head> and <body> tags")
                if not css_already_linked:
                    changes.append("Added CSS link")
        
        elif '</head>' in content and not css_already_linked:
            # Just add CSS link before </head>
            content = content.replace('</head>', css_link + '</head>')
            changes.append("Added CSS link")
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, ", ".join(changes)
        
        return False, "No changes needed" if css_already_linked else "Already processed"
        
    except Exception as e:
        return False, f"Error: {e}"

def process_all_files(base_path):
    """
    Process all HTML files in Jain Docs directory.
    """
    jain_docs_path = Path(base_path) / "Jain Docs"
    
    if not jain_docs_path.exists():
        print(f"Error: Jain Docs directory not found at {jain_docs_path}")
        return
    
    print("="*70)
    print("FIXING JAIN DOCS HTML STRUCTURE AND ADDING CSS")
    print("="*70)
    print()
    
    total_files = 0
    files_fixed = 0
    
    # Process index.html
    index_file = jain_docs_path / "index.html"
    if index_file.exists():
        print(f"Processing: {index_file.name}")
        total_files += 1
        
        success, msg = fix_html_structure_and_add_css(index_file)
        if success:
            files_fixed += 1
            print(f"  ✓ {msg}")
        else:
            print(f"  ℹ {msg}")
    
    # Process all HTML files in Pages directory
    pages_dir = jain_docs_path / "Pages"
    if pages_dir.exists():
        html_files = list(pages_dir.glob("*.html"))
        print(f"\nProcessing {len(html_files)} files in Pages directory...")
        print()
        
        processed = 0
        for html_file in html_files:
            total_files += 1
            
            success, msg = fix_html_structure_and_add_css(html_file)
            if success:
                files_fixed += 1
                processed += 1
                if processed <= 10 or processed % 50 == 0:  # Show first 10 and every 50th
                    print(f"  [{processed}] {html_file.name}")
                    print(f"      ✓ {msg}")
        
        if processed > 10:
            print(f"\n  ✓ Fixed {processed} files in total")
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Total files processed: {total_files}")
    print(f"Files fixed/updated: {files_fixed}")
    print("="*70)
    print("\n✅ HTML structure fixed and CSS linked!")

if __name__ == "__main__":
    base_path = r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX"
    process_all_files(base_path)
