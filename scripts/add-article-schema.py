#!/usr/bin/env python3
"""
Script to add Article schema to all article pages in EVENT-MANAGEMENT, MARKETING, and TECHNOLOGY folders
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional

# Define the base directory
BASE_DIR = Path(__file__).parent.parent
FOLDERS_TO_PROCESS = ['EVENT-MANAGEMENT', 'MARKETING', 'TECHNOLOGY']

# Article type mapping based on category
ARTICLE_TYPE_MAP = {
    'TECHNOLOGY': 'TechArticle',
    'MARKETING': 'Article',
    'EVENT-MANAGEMENT': 'Article'
}

# Publisher information
PUBLISHER_INFO = {
    "@type": "Organization",
    "name": "TapNex Wiki",
    "logo": {
        "@type": "ImageObject",
        "url": "https://wiki.tapnex.tech/images/TAPNEX_LOGO.png",
        "width": 600,
        "height": 60
    }
}

# Author information
AUTHOR_INFO = {
    "@type": "Organization",
    "name": "TapNex"
}

def extract_h1_title(html_content: str) -> Optional[str]:
    """Extract the H1 title from the HTML content"""
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html_content, re.IGNORECASE | re.DOTALL)
    if h1_match:
        # Remove any HTML tags from the h1 content
        title = h1_match.group(1)
        title = re.sub(r'<[^>]+>', '', title)
        return title.strip()
    return None

def extract_meta_description(html_content: str) -> Optional[str]:
    """Extract the meta description from the HTML"""
    desc_match = re.search(
        r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']',
        html_content,
        re.IGNORECASE
    )
    if desc_match:
        return desc_match.group(1).strip()
    return None

def extract_canonical_url(html_content: str) -> Optional[str]:
    """Extract the canonical URL from the HTML"""
    canonical_match = re.search(
        r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']',
        html_content,
        re.IGNORECASE
    )
    if canonical_match:
        return canonical_match.group(1).strip()
    return None

def extract_og_image(html_content: str) -> Optional[str]:
    """Extract the Open Graph image URL from the HTML"""
    og_image_match = re.search(
        r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']',
        html_content,
        re.IGNORECASE
    )
    if og_image_match:
        return og_image_match.group(1).strip()
    return None

def extract_page_title(html_content: str) -> str:
    """Extract the main title from the HTML page title tag"""
    title_match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE | re.DOTALL)
    if title_match:
        full_title = title_match.group(1).strip()
        # Remove common suffixes
        for separator in [' | TapNex', ' - TapNex', ' | TapNex Wiki', ' - TapNex Wiki']:
            if separator in full_title:
                full_title = full_title.split(separator)[0].strip()
        return full_title
    return "Article"

def get_file_dates(file_path: Path) -> Tuple[str, str]:
    """
    Get the creation and modification dates of the file.
    For now, we'll use the current date as default since we don't have git history.
    In production, you'd want to extract this from git or file metadata.
    """
    # Get file modification time
    try:
        mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
        date_modified = mod_time.strftime('%Y-%m-%d')
    except:
        date_modified = "2025-10-31"
    
    # For publication date, we'll use a reasonable default
    # In a real scenario, you'd want to track this in git or metadata
    date_published = "2025-01-01"  # Default to start of year
    
    return date_published, date_modified

def has_article_schema(html_content: str) -> bool:
    """Check if the page already has Article schema"""
    # Check for both Article and TechArticle types
    return bool(re.search(r'"@type":\s*"(Tech)?Article"', html_content))

def generate_article_schema(
    category: str,
    headline: str,
    description: str,
    image_url: str,
    canonical_url: str,
    date_published: str,
    date_modified: str
) -> str:
    """Generate Article or TechArticle schema for a page"""
    
    # Determine article type based on category
    article_type = ARTICLE_TYPE_MAP.get(category, 'Article')
    
    # Build the schema
    schema = {
        "@context": "https://schema.org",
        "@type": article_type,
        "headline": headline,
        "image": image_url,
        "datePublished": date_published,
        "dateModified": date_modified,
        "author": AUTHOR_INFO,
        "publisher": PUBLISHER_INFO,
        "description": description,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical_url
        }
    }
    
    # Format as pretty JSON
    json_str = json.dumps(schema, indent=4, ensure_ascii=False)
    
    # Wrap in script tags with proper indentation
    article_script = f'''
    <!-- Article Schema -->
    <script type="application/ld+json">
    {json_str}
    </script>'''
    
    return article_script

def add_article_schema_to_file(file_path: Path, category: str, subfolder: str) -> bool:
    """Add article schema to a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if article schema already exists
        if has_article_schema(content):
            print(f"  ⏭️  Skipping (already has Article schema): {file_path.name}")
            return False
        
        # Extract necessary information
        h1_title = extract_h1_title(content)
        if not h1_title:
            # Fall back to page title if no H1 found
            h1_title = extract_page_title(content)
        
        meta_description = extract_meta_description(content)
        if not meta_description:
            print(f"  ⚠️  Warning: No meta description found in {file_path.name}")
            meta_description = h1_title  # Fallback to headline
        
        canonical_url = extract_canonical_url(content)
        if not canonical_url:
            print(f"  ⚠️  Warning: No canonical URL found in {file_path.name}")
            canonical_url = f"https://wiki.tapnex.tech/{category}/{subfolder}/"
        
        image_url = extract_og_image(content)
        if not image_url:
            # Default to logo if no specific image
            image_url = "https://wiki.tapnex.tech/images/TAPNEX_LOGO.png"
        
        # Get dates
        date_published, date_modified = get_file_dates(file_path)
        
        # Generate article schema
        article_schema = generate_article_schema(
            category=category,
            headline=h1_title,
            description=meta_description,
            image_url=image_url,
            canonical_url=canonical_url,
            date_published=date_published,
            date_modified=date_modified
        )
        
        # Find the closing </head> tag and insert before it
        head_close_pattern = r'(\s*)</head>'
        head_match = re.search(head_close_pattern, content, re.IGNORECASE)
        
        if not head_match:
            print(f"  ❌ Could not find </head> tag in: {file_path.name}")
            return False
        
        # Insert the article schema before </head>
        new_content = content[:head_match.start()] + article_schema + '\n' + content[head_match.start():]
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        article_type = ARTICLE_TYPE_MAP.get(category, 'Article')
        print(f"  ✅ Added {article_type} schema to: {file_path.name}")
        print(f"     Headline: {h1_title[:60]}...")
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
    
    article_type = ARTICLE_TYPE_MAP.get(category, 'Article')
    print(f"\n📁 Processing category: {category} (Using {article_type} schema)")
    print(f"   Path: {category_path}")
    
    total_files = 0
    updated_files = 0
    
    # Find all index.html files in subfolders
    for subfolder in sorted(category_path.iterdir()):
        if subfolder.is_dir():
            index_file = subfolder / 'index.html'
            if index_file.exists():
                total_files += 1
                subfolder_name = subfolder.name
                if add_article_schema_to_file(index_file, category, subfolder_name):
                    updated_files += 1
    
    print(f"   📊 Updated {updated_files}/{total_files} files")
    return total_files, updated_files

def main():
    """Main function to process all folders"""
    print("=" * 70)
    print("📰 Article Schema Implementation Tool")
    print("=" * 70)
    print(f"Base directory: {BASE_DIR}")
    print(f"\nSchema Types:")
    print(f"  • TECHNOLOGY → TechArticle")
    print(f"  • MARKETING → Article")
    print(f"  • EVENT-MANAGEMENT → Article")
    
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
        print("2. Test with Google's Rich Results Test")
        print("3. Validate using Schema.org validator")
        print("4. Check for any warnings in Google Search Console")
        print("5. Monitor for rich results appearance (Articles, Top Stories)")
        print("\n💡 Note: Article schema can enable features like:")
        print("   • Enhanced article appearance in search")
        print("   • Top Stories carousel eligibility")
        print("   • Better content understanding by Google")
    else:
        print("\n✅ All files already have Article schema!")

if __name__ == '__main__':
    main()
