#!/usr/bin/env python3
"""
Jain Docs SEO Optimization Script
----------------------------------
This script optimizes all Jain Docs pages for SEO by:
1. Changing language attribute from 'en' to 'hi'
2. Adding/updating meta tags (title and description)
3. Adding structured data (Article and BreadcrumbList schema)
"""

import os
import re
from pathlib import Path
from urllib.parse import quote

# Base configuration
BASE_URL = "https://wiki.tapnex.tech"
JAIN_DOCS_DIR = Path(r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\Jain Docs")
PAGES_DIR = JAIN_DOCS_DIR / "Pages"

def sanitize_filename(filename):
    """Remove .html extension and sanitize for URL"""
    return filename.replace('.html', '').strip()

def create_title_from_filename(filename):
    """Create a title from filename"""
    name = sanitize_filename(filename)
    return f"{name} | जिनवाणी संग्रह | Jain Docs"

def create_description_from_filename(filename):
    """Create a meta description from filename"""
    name = sanitize_filename(filename)
    return f"Read {name} on TapNex Wiki Jain Docs. Complete collection of Jain stotras, chalisas, pujas, and bhajans. जिनवाणी संग्रह - {name}"

def extract_existing_title(content):
    """Extract existing title from HTML if present"""
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    if title_match:
        return title_match.group(1).strip()
    return None

def extract_existing_description(content):
    """Extract existing meta description if present"""
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    if desc_match:
        return desc_match.group(1).strip()
    return None

def change_language_attribute(content):
    """Change lang='en' to lang='hi'"""
    # Handle various formats: lang="en", lang='en', lang=en
    content = re.sub(r'<html\s+lang=["\']?en["\']?', '<html lang="hi"', content, flags=re.IGNORECASE)
    return content

def add_or_update_meta_tags(content, title, description):
    """Add or update title and meta description tags"""
    
    # Check if title exists
    existing_title = extract_existing_title(content)
    if existing_title:
        # Update existing title
        content = re.sub(
            r'<title>.*?</title>',
            f'<title>{title}</title>',
            content,
            flags=re.IGNORECASE | re.DOTALL
        )
    else:
        # Add title after <head> tag
        content = re.sub(
            r'(<head[^>]*>)',
            r'\1\n <title>' + title + '</title>',
            content,
            flags=re.IGNORECASE
        )
    
    # Check if meta description exists
    existing_desc = extract_existing_description(content)
    if existing_desc:
        # Update existing description
        content = re.sub(
            r'<meta\s+name=["\']description["\']\s+content=["\'][^"\']*["\']',
            f'<meta name="description" content="{description}"',
            content,
            flags=re.IGNORECASE
        )
    else:
        # Add meta description after title or after <head>
        if '<title>' in content.lower():
            content = re.sub(
                r'(</title>)',
                r'\1\n <meta name="description" content="' + description + '">',
                content,
                flags=re.IGNORECASE
            )
        else:
            content = re.sub(
                r'(<head[^>]*>)',
                r'\1\n <meta name="description" content="' + description + '">',
                content,
                flags=re.IGNORECASE
            )
    
    return content

def create_article_schema(filename, title, description):
    """Create Article schema JSON-LD"""
    url_encoded_name = quote(filename)
    url = f"{BASE_URL}/Jain%20Docs/Pages/{url_encoded_name}"
    
    schema = f'''
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {{
    "@type": "WebPage",
    "@id": "{url}"
  }},
  "headline": "{title}",
  "description": "{description}",
  "publisher": {{
    "@type": "Organization",
    "name": "TapNex Wiki",
    "logo": {{
      "@type": "ImageObject",
      "url": "{BASE_URL}/images/TAPNEX_LOGO.png"
    }}
  }},
  "author": {{
    "@type": "Organization",
    "name": "TapNex"
  }}
}}
</script>'''
    return schema

def create_breadcrumb_schema(filename):
    """Create BreadcrumbList schema JSON-LD"""
    page_name = sanitize_filename(filename)
    
    schema = f'''
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{{
    "@type": "ListItem",
    "position": 1,
    "name": "TapNex Wiki",
    "item": "{BASE_URL}/"
  }},{{
    "@type": "ListItem",
    "position": 2,
    "name": "Jain Docs",
    "item": "{BASE_URL}/Jain%20Docs/index.html"
  }},{{
    "@type": "ListItem",
    "position": 3,
    "name": "{page_name}"
  }}]
}}
</script>'''
    return schema

def has_schema(content, schema_type):
    """Check if content already has specific schema type"""
    if schema_type == "Article":
        return '"@type": "Article"' in content or '"@type":"Article"' in content
    elif schema_type == "BreadcrumbList":
        return '"@type": "BreadcrumbList"' in content or '"@type":"BreadcrumbList"' in content
    return False

def add_schemas(content, filename, title, description):
    """Add Article and BreadcrumbList schemas if they don't exist"""
    
    # Check if schemas already exist
    has_article = has_schema(content, "Article")
    has_breadcrumb = has_schema(content, "BreadcrumbList")
    
    schemas_to_add = []
    
    if not has_article:
        schemas_to_add.append(create_article_schema(filename, title, description))
    
    if not has_breadcrumb:
        schemas_to_add.append(create_breadcrumb_schema(filename))
    
    if schemas_to_add:
        schemas_text = '\n'.join(schemas_to_add)
        # Add schemas before </head> tag
        content = re.sub(
            r'(</head>)',
            schemas_text + '\n\n</head>',
            content,
            flags=re.IGNORECASE
        )
    
    return content

def optimize_index_file():
    """Optimize the main Jain Docs index.html file"""
    index_path = JAIN_DOCS_DIR / "index.html"
    
    if not index_path.exists():
        print(f"❌ Index file not found: {index_path}")
        return False
    
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Change language attribute
        content = change_language_attribute(content)
        
        # 2. Add/update meta tags
        title = "Jain Docs | जिनवाणी संग्रह | Stotras, Chalisas, Pujas"
        description = "A complete digital collection of Jain stotras, chalisas, pujas, bhajans, and more. जिनवाणी संग्रह - स्तोत्र, चालीसा, पूजा, और भजन का एक संपूर्ण डिजिटल संग्रह।"
        content = add_or_update_meta_tags(content, title, description)
        
        # Only write if content changed
        if content != original_content:
            with open(index_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Optimized: Jain Docs/index.html")
            return True
        else:
            print(f"ℹ️  No changes needed: Jain Docs/index.html")
            return False
            
    except Exception as e:
        print(f"❌ Error optimizing index.html: {e}")
        return False

def optimize_page_file(filepath):
    """Optimize a single page file"""
    filename = filepath.name
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Change language attribute
        content = change_language_attribute(content)
        
        # 2. Create title and description
        # First try to use existing title/description if they're meaningful
        existing_title = extract_existing_title(content)
        existing_desc = extract_existing_description(content)
        
        # Use existing if it's not generic or empty, otherwise create from filename
        if existing_title and len(existing_title) > 10 and "Jain Docs" in existing_title:
            title = existing_title
        else:
            title = create_title_from_filename(filename)
        
        if existing_desc and len(existing_desc) > 20:
            description = existing_desc
        else:
            description = create_description_from_filename(filename)
        
        # 3. Add/update meta tags
        content = add_or_update_meta_tags(content, title, description)
        
        # 4. Add schemas
        content = add_schemas(content, filename, title, description)
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        else:
            return False
            
    except Exception as e:
        print(f"❌ Error optimizing {filename}: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 70)
    print("🚀 Starting Jain Docs SEO Optimization")
    print("=" * 70)
    print()
    
    # Step 1: Optimize index.html
    print("📄 Step 1: Optimizing Jain Docs/index.html...")
    optimize_index_file()
    print()
    
    # Step 2: Optimize all page files
    print("📄 Step 2: Optimizing all pages in Jain Docs/Pages/...")
    print()
    
    if not PAGES_DIR.exists():
        print(f"❌ Pages directory not found: {PAGES_DIR}")
        return
    
    # Get all HTML files
    html_files = list(PAGES_DIR.glob("*.html"))
    total_files = len(html_files)
    
    if total_files == 0:
        print("❌ No HTML files found in Pages directory")
        return
    
    print(f"📊 Found {total_files} HTML files to optimize")
    print()
    
    optimized_count = 0
    skipped_count = 0
    
    for i, filepath in enumerate(html_files, 1):
        if optimize_page_file(filepath):
            print(f"✅ [{i}/{total_files}] Optimized: {filepath.name}")
            optimized_count += 1
        else:
            print(f"ℹ️  [{i}/{total_files}] No changes: {filepath.name}")
            skipped_count += 1
    
    # Summary
    print()
    print("=" * 70)
    print("📊 OPTIMIZATION SUMMARY")
    print("=" * 70)
    print(f"✅ Total files processed: {total_files + 1}")  # +1 for index.html
    print(f"✅ Files optimized: {optimized_count + 1}")  # +1 for index.html
    print(f"ℹ️  Files skipped (already optimized): {skipped_count}")
    print()
    print("🎉 SEO optimization complete!")
    print()
    print("Changes made to each file:")
    print("  1. ✅ Changed language attribute from 'en' to 'hi'")
    print("  2. ✅ Added/updated <title> tag")
    print("  3. ✅ Added/updated <meta name='description'> tag")
    print("  4. ✅ Added Article schema (JSON-LD)")
    print("  5. ✅ Added BreadcrumbList schema (JSON-LD)")
    print()

if __name__ == "__main__":
    main()
