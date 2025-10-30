#!/usr/bin/env python3
"""
Helper script to generate Rich Results Test URLs for breadcrumb validation
"""

from pathlib import Path
from urllib.parse import quote

BASE_DIR = Path(__file__).parent.parent
FOLDERS_TO_PROCESS = ['EVENT-MANAGEMENT', 'MARKETING', 'TECHNOLOGY']

def generate_test_urls():
    """Generate list of URLs to test with Google Rich Results Test"""
    
    print("=" * 80)
    print("🔍 BREADCRUMB RICH RESULTS TEST HELPER")
    print("=" * 80)
    print("\nUse these URLs to test your breadcrumb implementation:\n")
    
    all_urls = []
    
    for category in FOLDERS_TO_PROCESS:
        category_path = BASE_DIR / category
        
        if not category_path.exists():
            continue
        
        print(f"\n{'='*80}")
        print(f"📁 {category}")
        print(f"{'='*80}\n")
        
        subfolders = sorted([f for f in category_path.iterdir() if f.is_dir()])
        
        for i, subfolder in enumerate(subfolders, 1):
            index_file = subfolder / 'index.html'
            if index_file.exists():
                page_url = f"https://wiki.tapnex.tech/{category}/{subfolder.name}/"
                all_urls.append(page_url)
                
                # Generate Rich Results Test URL
                encoded_url = quote(page_url, safe='')
                test_url = f"https://search.google.com/test/rich-results?url={encoded_url}"
                
                print(f"{i}. {subfolder.name}")
                print(f"   Page URL: {page_url}")
                print(f"   Test URL: {test_url}")
                print()
    
    print("=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    print(f"\nTotal pages with breadcrumb schema: {len(all_urls)}")
    
    print("\n" + "=" * 80)
    print("🎯 RECOMMENDED TESTING STRATEGY")
    print("=" * 80)
    print("""
1. **Priority Testing** (Test first):
   - One page from each category (3 pages total)
   - This validates the schema works across all categories
   
2. **Sample Testing** (Test next):
   - 2-3 random pages from each category
   - Ensures consistency across different page structures
   
3. **Full Validation** (Optional):
   - Test all pages if you want complete coverage
   - Can be done gradually over time

📝 How to use Rich Results Test:
   1. Click on any "Test URL" link above
   2. Wait for Google to analyze the page
   3. Look for "Breadcrumb" in the detected structured data
   4. Check for any errors or warnings
   5. If valid, you'll see: "Page is eligible for rich results"

⏱️  Note: Rich results may take 1-4 weeks to appear in actual search results
    after pages are crawled and indexed by Google.
""")
    
    print("=" * 80)
    print("🔗 QUICK ACCESS LINKS")
    print("=" * 80)
    
    # Print sample URLs for quick access
    sample_categories = {
        'EVENT-MANAGEMENT': 'Event-budgeting',
        'MARKETING': 'AI-Powered-Content-Creation-&-Exhaustive-Marketing',
        'TECHNOLOGY': 'NFC'
    }
    
    print("\nDirect Rich Results Test Links (One per category):\n")
    for category, subfolder in sample_categories.items():
        page_url = f"https://wiki.tapnex.tech/{category}/{subfolder}/"
        encoded_url = quote(page_url, safe='')
        test_url = f"https://search.google.com/test/rich-results?url={encoded_url}"
        print(f"{category}:")
        print(f"{test_url}\n")
    
    print("=" * 80)
    print("\n✨ Additional Testing Tools:")
    print("   • Schema.org Validator: https://validator.schema.org/")
    print("   • Google Search Console: https://search.google.com/search-console")
    print("   • Bing Webmaster Tools: https://www.bing.com/webmasters")
    print("\n" + "=" * 80)

if __name__ == '__main__':
    generate_test_urls()
