#!/usr/bin/env python3
"""
Script to add BreadcrumbList schema to all article pages in EVENT-MANAGEMENT, MARKETING, and TECHNOLOGY folders
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Define the base directory
BASE_DIR = Path(__file__).parent.parent
FOLDERS_TO_PROCESS = ['EVENT-MANAGEMENT', 'MARKETING', 'TECHNOLOGY']

# Category display names
CATEGORY_NAMES = {
    'EVENT-MANAGEMENT': 'Event Management',
    'MARKETING': 'Marketing Guides',
    'TECHNOLOGY': 'Technology Guides'
}

def extract_page_title(html_content: str) -> str:
    """Extract the main title from the HTML page title tag"""
    title_match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE | re.DOTALL)
    if title_match:
        # Extract just the main part before the first | or - separator
        full_title = title_match.group(1).strip()
        # Remove common suffixes
        for separator in [' | TapNex', ' - TapNex', ' | TapNex Wiki', ' - TapNex Wiki']:
            if separator in full_title:
                full_title = full_title.split(separator)[0].strip()
        return full_title
    return "Article"

def format_folder_name(folder_name: str) -> str:
    """Convert folder name to readable format"""
    # Replace hyphens and underscores with spaces
    name = folder_name.replace('-', ' ').replace('_', ' ')
    # Capitalize each word
    name = ' '.join(word.capitalize() for word in name.split())
    # Handle special cases with ampersands
    name = name.replace('&', '&amp;')
    return name

def generate_breadcrumb_schema(category: str, subfolder: str, page_title: str, canonical_url: str) -> str:
    """Generate BreadcrumbList schema for a page"""
    
    # Build the schema
    schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
    }
    
    # Level 1: Home
    schema["itemListElement"].append({
        "@type": "ListItem",
        "position": 1,
        "name": "TapNex Wiki Home",
        "item": "https://wiki.tapnex.tech/"
    })
    
    # Level 2: Category
    category_name = CATEGORY_NAMES.get(category, category)
    category_url = f"https://wiki.tapnex.tech/{category}/"
    schema["itemListElement"].append({
        "@type": "ListItem",
        "position": 2,
        "name": category_name,
        "item": category_url
    })
    
    # Level 3: Current Page
    schema["itemListElement"].append({
        "@type": "ListItem",
        "position": 3,
        "name": page_title,
        "item": canonical_url if canonical_url else f"https://wiki.tapnex.tech/{category}/{subfolder}/"
    })
    
    # Format as pretty JSON
    import json
    json_str = json.dumps(schema, indent=4, ensure_ascii=False)
    
    # Wrap in script tags with proper indentation
    breadcrumb_script = f'''
    <!-- Breadcrumb Schema -->
    <script type="application/ld+json">
    {json_str}
    </script>'''
    
    return breadcrumb_script

def extract_canonical_url(html_content: str) -> str:
    """Extract the canonical URL from the HTML"""
    canonical_match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', html_content, re.IGNORECASE)
    if canonical_match:
        return canonical_match.group(1).strip()
    return ""

def has_breadcrumb_schema(html_content: str) -> bool:
    """Check if the page already has breadcrumb schema"""
    return 'BreadcrumbList' in html_content or 'Breadcrumb Schema' in html_content

def add_breadcrumb_to_file(file_path: Path, category: str, subfolder: str) -> bool:
    """Add breadcrumb schema to a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if breadcrumb already exists
        if has_breadcrumb_schema(content):
            print(f"  ⏭️  Skipping (already has breadcrumb): {file_path.name}")
            return False
        
        # Extract page title and canonical URL
        page_title = extract_page_title(content)
        canonical_url = extract_canonical_url(content)
        
        # Generate breadcrumb schema
        breadcrumb_schema = generate_breadcrumb_schema(category, subfolder, page_title, canonical_url)
        
        # Find the closing </head> tag and insert before it
        head_close_pattern = r'(\s*)</head>'
        head_match = re.search(head_close_pattern, content, re.IGNORECASE)
        
        if not head_match:
            print(f"  ❌ Could not find </head> tag in: {file_path.name}")
            return False
        
        # Insert the breadcrumb schema before </head>
        new_content = content[:head_match.start()] + breadcrumb_schema + '\n' + content[head_match.start():]
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ Added breadcrumb to: {file_path.name}")
        return True
        
    except Exception as e:
        print(f"  ❌ Error processing {file_path.name}: {str(e)}")
        return False

def process_folder(base_path: Path, category: str) -> Tuple[int, int]:
    """Process all HTML files in a category folder"""
    category_path = base_path / category
    
    if not category_path.exists():
        print(f"❌ Category folder not found: {category}")
        return 0, 0
    
    print(f"\n📁 Processing category: {category}")
    print(f"   Path: {category_path}")
    
    total_files = 0
    updated_files = 0
    
    # Find all index.html files in subfolders
    for subfolder in category_path.iterdir():
        if subfolder.is_dir():
            index_file = subfolder / 'index.html'
            if index_file.exists():
                total_files += 1
                subfolder_name = subfolder.name
                if add_breadcrumb_to_file(index_file, category, subfolder_name):
                    updated_files += 1
    
    print(f"   📊 Updated {updated_files}/{total_files} files")
    return total_files, updated_files

def main():
    """Main function to process all folders"""
    print("=" * 70)
    print("🔧 Breadcrumb Schema Implementation Tool")
    print("=" * 70)
    print(f"Base directory: {BASE_DIR}")
    
    total_all = 0
    updated_all = 0
    
    for category in FOLDERS_TO_PROCESS:
        total, updated = process_folder(BASE_DIR, category)
        total_all += total
        updated_all += updated
    
    print("\n" + "=" * 70)
    print(f"✨ Summary: Updated {updated_all}/{total_all} files across all categories")
    print("=" * 70)
    
    if updated_all > 0:
        print("\n📝 Next Steps:")
        print("1. Review the changes in a few sample files")
        print("2. Test the pages in Google's Rich Results Test")
        print("3. Commit the changes to your repository")
        print("4. Monitor Google Search Console for breadcrumb appearance")
    else:
        print("\n✅ All files already have breadcrumb schema!")

if __name__ == '__main__':
    main()
