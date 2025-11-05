#!/usr/bin/env python3
"""
Script to add AdSense ad containers to Jain Docs and Tools pages
Carefully places ads without disrupting content
"""

import os
import re
from pathlib import Path

# Define the AdSense ad block for Jain Docs
JAIN_DOCS_AD_BLOCK = '''
                    <!-- AdSense - Jain Docs Ad -->
                    <div class="ad-container article-bottom-ad">
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4315586112110103"
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
                        </script>
                    </div>
'''

def has_existing_ad(content):
    """Check if the page already has the specific ad slot"""
    return 'data-ad-slot="6328898375"' in content

def add_ad_to_jain_docs_page(file_path):
    """Add AdSense ad to a Jain Docs HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if ad already exists
        if has_existing_ad(content):
            print(f"⏭️  Ad already exists in: {file_path.name}")
            return False
        
        # Strategy 1: Add before </article> tag (most common in Jain Docs pages)
        if '</article>' in content:
            # Find the last </div> or content before </article>
            pattern = r'(</div>\s*</article>)'
            replacement = JAIN_DOCS_AD_BLOCK + r'\1'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Added ad to: {file_path.name}")
                return True
        
        # Strategy 2: Add before </main> tag
        if '</main>' in content:
            pattern = r'(\s*</main>)'
            replacement = JAIN_DOCS_AD_BLOCK + r'\1'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Added ad to: {file_path.name}")
                return True
        
        # Strategy 3: Add before footer
        if '<footer' in content:
            pattern = r'(\s*<footer)'
            replacement = JAIN_DOCS_AD_BLOCK + r'\1'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Added ad to: {file_path.name}")
                return True
        
        print(f"⚠️  Could not find suitable location in: {file_path.name}")
        return False
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def add_ad_to_tools_page(file_path):
    """Add AdSense ad to a Tools HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if ad already exists
        if has_existing_ad(content):
            print(f"⏭️  Ad already exists in: {file_path.name}")
            return False
        
        # For tools pages, add before </article> or </main>
        # Strategy 1: Add before closing </article> tag
        if '</article>' in content:
            pattern = r'(\s*</article>)'
            replacement = '\n' + JAIN_DOCS_AD_BLOCK + r'\1'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Added ad to: {file_path.name}")
                return True
        
        # Strategy 2: Add before </main> tag
        if '</main>' in content:
            pattern = r'(\s*</main>)'
            replacement = '\n' + JAIN_DOCS_AD_BLOCK + r'\1'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Added ad to: {file_path.name}")
                return True
        
        # Strategy 3: Add before footer placeholder
        if 'footer-placeholder' in content:
            pattern = r'(\s*<div id="footer-placeholder">)'
            replacement = '\n' + JAIN_DOCS_AD_BLOCK + r'\1'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Added ad to: {file_path.name}")
                return True
        
        print(f"⚠️  Could not find suitable location in: {file_path.name}")
        return False
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def process_jain_docs():
    """Process all Jain Docs HTML files"""
    print("\n" + "="*60)
    print("PROCESSING JAIN DOCS PAGES")
    print("="*60)
    
    base_dir = Path(r'c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\Jain Docs')
    pages_dir = base_dir / 'Pages'
    
    if not pages_dir.exists():
        print(f"❌ Directory not found: {pages_dir}")
        return 0, 0, 0
    
    html_files = list(pages_dir.glob('*.html'))
    print(f"Found {len(html_files)} HTML files in Jain Docs/Pages\n")
    
    success_count = 0
    skipped_count = 0
    failed_count = 0
    
    for html_file in html_files:
        result = add_ad_to_jain_docs_page(html_file)
        if result:
            success_count += 1
        elif result is False and 'Ad already exists' in str(result):
            skipped_count += 1
        else:
            failed_count += 1
    
    return success_count, skipped_count, failed_count

def process_tools():
    """Process all Tools HTML files"""
    print("\n" + "="*60)
    print("PROCESSING TOOLS PAGES")
    print("="*60)
    
    base_dir = Path(r'c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\TOOLS')
    
    if not base_dir.exists():
        print(f"❌ Directory not found: {base_dir}")
        return 0, 0, 0
    
    # Find all index.html files in subdirectories (each tool has its own folder)
    html_files = []
    for tool_dir in base_dir.iterdir():
        if tool_dir.is_dir() and tool_dir.name != 'shared':
            index_file = tool_dir / 'index.html'
            if index_file.exists():
                html_files.append(index_file)
    
    print(f"Found {len(html_files)} HTML files in TOOLS\n")
    
    success_count = 0
    skipped_count = 0
    failed_count = 0
    
    for html_file in html_files:
        result = add_ad_to_tools_page(html_file)
        if result:
            success_count += 1
        elif result is False and 'Ad already exists' in str(result):
            skipped_count += 1
        else:
            failed_count += 1
    
    return success_count, skipped_count, failed_count

def main():
    print("\n" + "🚀 " + "="*58)
    print("    ADDING ADSENSE ADS TO JAIN DOCS AND TOOLS PAGES")
    print("="*60)
    
    # Process Jain Docs
    jd_success, jd_skipped, jd_failed = process_jain_docs()
    
    # Process Tools
    t_success, t_skipped, t_failed = process_tools()
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"\n📊 JAIN DOCS:")
    print(f"   ✅ Successfully added: {jd_success}")
    print(f"   ⏭️  Already had ads: {jd_skipped}")
    print(f"   ⚠️  Failed: {jd_failed}")
    
    print(f"\n📊 TOOLS:")
    print(f"   ✅ Successfully added: {t_success}")
    print(f"   ⏭️  Already had ads: {t_skipped}")
    print(f"   ⚠️  Failed: {t_failed}")
    
    print(f"\n📊 TOTAL:")
    print(f"   ✅ Successfully added: {jd_success + t_success}")
    print(f"   ⏭️  Already had ads: {jd_skipped + t_skipped}")
    print(f"   ⚠️  Failed: {jd_failed + t_failed}")
    print("\n" + "="*60)
    print("✨ Process completed!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
