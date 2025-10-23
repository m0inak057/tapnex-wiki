"""
SEO Updater Script for Jain Docs HTML Pages
This script extracts SEO data and updates HTML files with proper meta tags,
removing all external references and keeping only Tapnex Wiki branding.
"""

import re
import os
import json
from pathlib import Path
from typing import Dict, List, Optional

class SEODataExtractor:
    """Extract SEO data from the jinvani-complete-seo-data.md file"""
    
    def __init__(self, seo_file_path: str):
        self.seo_file_path = seo_file_path
        self.pages_data = []
        
    def extract_all_pages(self) -> List[Dict]:
        """Extract SEO data for all pages from the markdown file"""
        with open(self.seo_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split by page sections (## page title)
        page_sections = re.split(r'\n## ', content)
        
        print(f"Found {len(page_sections)} sections in SEO file")
        
        for section in page_sections[1:]:  # Skip the header
            page_data = self._extract_page_data(section)
            if page_data:
                self.pages_data.append(page_data)
        
        print(f"Successfully extracted data for {len(self.pages_data)} pages")
        return self.pages_data
    
    def _extract_page_data(self, section: str) -> Optional[Dict]:
        """Extract SEO data from a single page section"""
        try:
            # Extract page title (first line)
            title_match = re.search(r'^(.+?)(?:\n|$)', section)
            if not title_match:
                return None
            
            full_title = title_match.group(1).strip()
            
            # Extract meta description
            desc_match = re.search(r'\*\*Meta Description\*\*:\s*(.+?)(?:\n|$)', section, re.MULTILINE)
            description = desc_match.group(1).strip() if desc_match else ""
            
            # Extract H1 tags
            h1_match = re.search(r'#### H1 Tags.*?\n\n1\.\s*(.+?)(?:\n|$)', section, re.DOTALL)
            h1_title = h1_match.group(1).strip() if h1_match else full_title
            
            # Extract top 20 keywords
            keywords = self._extract_keywords(section)
            
            # Extract Open Graph data
            og_title_match = re.search(r'\*\*og:title\*\*:\s*(.+?)(?:\n|$)', section)
            og_title = og_title_match.group(1).strip() if og_title_match else full_title
            
            og_desc_match = re.search(r'\*\*og:description\*\*:\s*(.+?)(?:\n|$)', section)
            og_description = og_desc_match.group(1).strip() if og_desc_match else description
            
            # Extract Twitter card data
            twitter_title_match = re.search(r'\*\*twitter:title\*\*:\s*(.+?)(?:\n|$)', section)
            twitter_title = twitter_title_match.group(1).strip() if twitter_title_match else full_title
            
            twitter_desc_match = re.search(r'\*\*twitter:description\*\*:\s*(.+?)(?:\n|$)', section)
            twitter_description = twitter_desc_match.group(1).strip() if twitter_desc_match else description
            
            return {
                'title': full_title,
                'h1_title': h1_title,
                'meta_description': description,
                'keywords': keywords,
                'og_title': og_title,
                'og_description': og_description,
                'twitter_title': twitter_title,
                'twitter_description': twitter_description
            }
        except Exception as e:
            print(f"Error extracting page data: {e}")
            return None
    
    def _extract_keywords(self, section: str) -> List[str]:
        """Extract top 20 keywords from the keyword table"""
        keywords = []
        
        # Find the keyword table section
        keyword_section = re.search(
            r'#### Top 20 Keywords.*?\n\| Keyword \| Count \|.*?\n((?:\|.+?\|\n)+)',
            section,
            re.DOTALL
        )
        
        if keyword_section:
            rows = keyword_section.group(1).strip().split('\n')
            for row in rows[:20]:  # Get top 20
                keyword_match = re.match(r'\|\s*(.+?)\s*\|', row)
                if keyword_match:
                    keyword = keyword_match.group(1).strip()
                    # Filter out invalid keywords
                    if keyword and keyword != '---' and not keyword.startswith('-') and len(keyword) > 1:
                        keywords.append(keyword)
        
        return keywords


class HTMLUpdater:
    """Update HTML files with SEO data"""
    
    def __init__(self, pages_dir: str, base_url: str = "https://wiki.tapnex.tech"):
        self.pages_dir = Path(pages_dir)
        self.base_url = base_url
        
    def find_html_file(self, page_title: str) -> Optional[Path]:
        """Find the HTML file matching the page title"""
        # Clean the title for matching
        clean_title = page_title.split(' - ')[0].strip()
        clean_title = re.sub(r'\s+\|\s+.*$', '', clean_title)  # Remove | suffix
        clean_title = re.sub(r'\s*-\s*Jinvani:.*$', '', clean_title)  # Remove Jinvani suffix
        
        # Try exact match first
        html_file = self.pages_dir / f"{clean_title}.html"
        if html_file.exists():
            return html_file
        
        # Try partial matching
        for html_file in self.pages_dir.glob("*.html"):
            if html_file.stem.lower() in clean_title.lower() or clean_title.lower() in html_file.stem.lower():
                return html_file
        
        return None
    
    def update_html_file(self, html_file: Path, seo_data: Dict) -> bool:
        """Update a single HTML file with SEO data"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Update the head section with new SEO data
            updated_content = self._update_head_section(content, html_file.stem, seo_data)
            
            # Remove external references
            updated_content = self._remove_external_references(updated_content)
            
            # Write back
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            return True
        except Exception as e:
            print(f"Error updating {html_file.name}: {e}")
            return False
    
    def _update_head_section(self, content: str, filename: str, seo_data: Dict) -> str:
        """Update the <head> section with new SEO meta tags"""
        
        # Prepare keywords string
        keywords_str = ", ".join(seo_data['keywords'][:20]) if seo_data['keywords'] else "Jain Mantra, Jain Prayer, Jain Stotra, Jainism, Tapnex Wiki"
        
        # Add Tapnex-specific keywords
        keywords_str = f"{keywords_str}, जैन धर्म, जिनवाणी, Tapnex Wiki"
        
        # Create URL-friendly slug
        slug = re.sub(r'[^\w\s-]', '', filename.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        page_url = f"{self.base_url}/jain-docs/{slug}"
        
        # Build the new head section
        new_head = f"""<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>{seo_data['title']}</title>
    <meta name="description" content="{seo_data['meta_description']}">
    <meta name="keywords" content="{keywords_str}">
    <meta name="author" content="Tapnex Wiki">
    <meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:locale" content="hi_IN">
    <meta property="og:title" content="{seo_data['og_title']}">
    <meta property="og:description" content="{seo_data['og_description']}">
    <meta property="og:url" content="{page_url}">
    <meta property="og:site_name" content="Tapnex Wiki - जैन धर्म संग्रह">
    <meta property="og:image" content="{self.base_url}/images/TAPNEX_LOGO.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{seo_data['twitter_title']}">
    <meta name="twitter:description" content="{seo_data['twitter_description']}">
    <meta name="twitter:image" content="{self.base_url}/images/TAPNEX_LOGO.png">
    <meta name="twitter:site" content="@tapnex">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{page_url}">
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{seo_data['title'].replace('"', '\\"')}",
      "description": "{seo_data['meta_description'].replace('"', '\\"')}",
      "keywords": "{keywords_str}",
      "author": {{
        "@type": "Organization",
        "name": "Tapnex Wiki",
        "url": "{self.base_url}"
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "Tapnex Wiki",
        "logo": {{
          "@type": "ImageObject",
          "url": "{self.base_url}/images/TAPNEX_LOGO.png"
        }}
      }},
      "inLanguage": "hi",
      "about": {{
        "@type": "Thing",
        "name": "Jainism",
        "description": "जैन धर्म"
      }}
    }}
    </script>
    """
        
        # Replace the entire head section up to and including </head>
        updated_content = re.sub(
            r'<head>.*?</head>',
            new_head,
            content,
            flags=re.DOTALL,
            count=1
        )
        
        # Add back the stylesheets and scripts that should be in head
        # Find where </head> should be and insert necessary links before it
        updated_content = updated_content.replace(
            '</script>\n    ',
            '</script>\n    \n    <!-- Additional Ad Styles -->\n    <link rel="stylesheet" href="../../additional-ad-styles.css">\n    \n    <!-- Article Styles -->\n    <link rel="stylesheet" href="../../styles/article-styles.css">\n    \n    <!-- Article Scripts -->\n    <script src="../../scripts/article-scripts.js" defer></script>\n</head>',
            1
        )
        
        return updated_content
    
    def _remove_external_references(self, content: str) -> str:
        """Remove all external website references"""
        
        # Remove jinvani.in references
        content = re.sub(r'jinvani\.in', 'Tapnex Wiki', content, flags=re.IGNORECASE)
        
        # Remove external links in href (keep only internal links starting with ../ or / or #)
        # This is a cautious approach - we keep relative links but remove absolute external URLs
        content = re.sub(
            r'href="https?://(?!wiki\.tapnex\.tech)[^"]*"',
            'href="#"',
            content,
            flags=re.IGNORECASE
        )
        
        # Remove external social media references except Tapnex's own
        content = re.sub(r'@swarn\d+', '@tapnex', content, flags=re.IGNORECASE)
        
        # Update site name references
        content = re.sub(r'site_name":\s*"jinvani\.in"', 'site_name": "Tapnex Wiki"', content, flags=re.IGNORECASE)
        
        return content


def main():
    """Main execution function"""
    
    # Define paths
    base_dir = Path(__file__).parent
    seo_file = base_dir / "jinvani-complete-seo-data.md"
    pages_dir = base_dir / "Pages"
    
    print("=" * 70)
    print("SEO UPDATER FOR JAIN DOCS - TAPNEX WIKI")
    print("=" * 70)
    print()
    
    # Step 1: Extract SEO data
    print("📊 Step 1: Extracting SEO data from markdown file...")
    extractor = SEODataExtractor(str(seo_file))
    pages_data = extractor.extract_all_pages()
    
    if not pages_data:
        print("❌ No SEO data found. Exiting.")
        return
    
    print(f"✅ Extracted SEO data for {len(pages_data)} pages")
    print()
    
    # Step 2: Update HTML files
    print("🔧 Step 2: Updating HTML files...")
    updater = HTMLUpdater(str(pages_dir))
    
    updated_count = 0
    not_found_count = 0
    error_count = 0
    
    for i, page_data in enumerate(pages_data, 1):
        print(f"\n[{i}/{len(pages_data)}] Processing: {page_data['title'][:60]}...")
        
        # Find matching HTML file
        html_file = updater.find_html_file(page_data['title'])
        
        if not html_file:
            print(f"   ⚠️  HTML file not found")
            not_found_count += 1
            continue
        
        print(f"   📄 Found: {html_file.name}")
        
        # Update the file
        if updater.update_html_file(html_file, page_data):
            print(f"   ✅ Updated successfully")
            updated_count += 1
        else:
            print(f"   ❌ Error updating file")
            error_count += 1
    
    # Summary
    print()
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total pages in SEO data: {len(pages_data)}")
    print(f"✅ Successfully updated: {updated_count}")
    print(f"⚠️  HTML files not found: {not_found_count}")
    print(f"❌ Errors: {error_count}")
    print()
    print("🎉 SEO update process completed!")
    print("=" * 70)


if __name__ == "__main__":
    main()
