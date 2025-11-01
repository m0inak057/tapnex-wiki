#!/usr/bin/env python3
"""
Script to update Jain Docs HTML files to include ad container styles
and ensure all ads are properly wrapped in styled containers.
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
        
        # Find the head section and add the CSS link before </head>
        # Look for existing style/link tags in head to insert near them
        css_link = '\n    <!-- Ad Container Styles -->\n    <link rel="stylesheet" href="../styles/ad-container-styles.css">\n'
        
        # For index.html (root level), use different path
        if file_path.endswith('index.html') and 'Pages' not in file_path:
            css_link = '\n    <!-- Ad Container Styles -->\n    <link rel="stylesheet" href="styles/ad-container-styles.css">\n'
        
        # Try to insert before </head>
        if '</head>' in content:
            content = content.replace('</head>', css_link + '</head>')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, "CSS link added"
        else:
            return False, "No </head> tag found"
            
    except Exception as e:
        return False, f"Error: {e}"

def wrap_ads_in_containers(file_path):
    """
    Ensure all AdSense ads are properly wrapped in ad-container divs.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modifications = 0
        
        # Pattern to find ads that are NOT already in proper containers
        # Match the complete ad block
        ad_pattern = r'(<script async src="https://pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js[^>]*>.*?</script>\s*(?:<!--[^>]*-->)?\s*<ins class="adsbygoogle"[^>]*>.*?</ins>\s*<script>\s*\(adsbygoogle = window\.adsbygoogle \|\| \[\]\)\.push\({}\);\s*</script>)'
        
        # Find all ad blocks
        matches = list(re.finditer(ad_pattern, content, re.DOTALL))
        
        for match in reversed(matches):  # Process in reverse to maintain positions
            ad_block = match.group(1)
            start_pos = match.start()
            end_pos = match.end()
            
            # Check if this ad is already wrapped in a proper container
            # Look backwards for <div class="ad-container
            check_start = max(0, start_pos - 200)
            preceding_text = content[check_start:start_pos]
            
            # Check if already wrapped
            if '<div class="ad-container' in preceding_text and preceding_text.rstrip().endswith('>'):
                continue  # Already wrapped, skip
            
            # Determine container class based on context
            container_class = "ad-container article-mid-ad"
            
            # Check if it's near the beginning (top ad)
            lines_before = content[:start_pos].count('\n')
            if lines_before < 150:  # Rough estimate for top of page
                container_class = "ad-container ad-top article-top-ad"
            
            # Check if it's near the end (bottom ad)
            lines_after = content[end_pos:].count('\n')
            if lines_after < 100:  # Rough estimate for bottom of page
                container_class = "ad-container ad-bottom article-bottom-ad"
            
            # Wrap the ad in a container
            wrapped_ad = f'\n            <!-- AdSense - In-Content Ad -->\n            <div class="{container_class}">\n                {ad_block}\n            </div>\n'
            
            # Replace in content
            content = content[:start_pos] + wrapped_ad + content[end_pos:]
            modifications += 1
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return modifications, "Ads wrapped in containers"
        
        return 0, "No changes needed"
        
    except Exception as e:
        return 0, f"Error: {e}"

def process_jain_docs_files(base_path):
    """
    Process all HTML files in Jain Docs directory.
    """
    jain_docs_path = Path(base_path) / "Jain Docs"
    
    if not jain_docs_path.exists():
        print(f"Error: Jain Docs directory not found at {jain_docs_path}")
        return
    
    print("="*70)
    print("JAIN DOCS AD CONTAINER STYLE UPDATER")
    print("="*70)
    print()
    
    total_files = 0
    css_added = 0
    ads_wrapped = 0
    
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
        
        wraps, msg = wrap_ads_in_containers(index_file)
        if wraps > 0:
            ads_wrapped += wraps
            print(f"  ✓ Wrapped {wraps} ad(s) in containers")
    
    # Process all HTML files in Pages directory
    pages_dir = jain_docs_path / "Pages"
    if pages_dir.exists():
        html_files = list(pages_dir.glob("*.html"))
        print(f"\nProcessing {len(html_files)} files in Pages directory...")
        print()
        
        for i, html_file in enumerate(html_files, 1):
            total_files += 1
            
            success, msg = add_css_link_to_file(html_file)
            if success:
                css_added += 1
            
            wraps, wrap_msg = wrap_ads_in_containers(html_file)
            if wraps > 0:
                ads_wrapped += wraps
            
            # Show progress for files with changes
            if success or wraps > 0:
                print(f"  [{i}/{len(html_files)}] {html_file.name}")
                if success:
                    print(f"      ✓ CSS linked")
                if wraps > 0:
                    print(f"      ✓ {wraps} ad(s) containerized")
    
    # Summary
    print("\n" + "="*70)
    print("UPDATE SUMMARY")
    print("="*70)
    print(f"Total files processed: {total_files}")
    print(f"Files with CSS link added: {css_added}")
    print(f"Total ads wrapped in containers: {ads_wrapped}")
    print("="*70)
    print("\n✅ All updates completed!")
    print("\n📝 Next Steps:")
    print("   1. Test the pages to ensure ads display correctly")
    print("   2. Check responsive behavior on mobile devices")
    print("   3. Verify ad containers have proper styling")
    print("\n💡 The new CSS file provides:")
    print("   • Professional ad container styling")
    print("   • Responsive design for all devices")
    print("   • Dark mode support")
    print("   • Smooth animations and transitions")
    print("   • Accessibility features")

if __name__ == "__main__":
    base_path = r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX"
    process_jain_docs_files(base_path)
