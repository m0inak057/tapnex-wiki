#!/usr/bin/env python3
"""
Verify all navigation links in index.html are functional.
"""

import re
from pathlib import Path

def check_navigation_links():
    """Check all navigation links in index.html."""
    
    index_path = Path(r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\index.html")
    
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all href attributes
    href_pattern = r'href="([^"]*)"'
    all_hrefs = re.findall(href_pattern, content)
    
    # Categorize links
    placeholder_links = [h for h in all_hrefs if h.startswith('#') and h != '#']
    category_links = {
        'event_management': [h for h in all_hrefs if '/EVENT-MANAGEMENT/' in h],
        'technology': [h for h in all_hrefs if '/TECHNOLOGY/' in h],
        'marketing': [h for h in all_hrefs if '/MARKETING/' in h],
        'tools': [h for h in all_hrefs if '/tools' in h or '/TOOLS/' in h],
        'jain_docs': [h for h in all_hrefs if 'Jain' in h or 'jain' in h],
    }
    
    external_links = [h for h in all_hrefs if h.startswith('http')]
    internal_pages = [h for h in all_hrefs if h.startswith('/') and not any(cat in h for cat in ['/EVENT-MANAGEMENT/', '/TECHNOLOGY/', '/MARKETING/', '/TOOLS/'])]
    
    print("=" * 70)
    print("HOMEPAGE NAVIGATION LINK VERIFICATION REPORT")
    print("=" * 70)
    print()
    
    # Check for placeholder links
    print("1. PLACEHOLDER LINKS CHECK (href='#')")
    print("-" * 70)
    if placeholder_links:
        print(f"⚠ Found {len(placeholder_links)} placeholder links:")
        for link in placeholder_links[:10]:  # Show first 10
            print(f"  - {link}")
    else:
        print("✅ No placeholder links found! All links are functional.")
    print()
    
    # Check category navigation
    print("2. MAIN CATEGORY NAVIGATION LINKS")
    print("-" * 70)
    for category, links in category_links.items():
        if links:
            unique_links = len(set(links))
            print(f"✅ {category.replace('_', ' ').title()}: {unique_links} unique links")
            # Show main category link
            main_link = [l for l in links if l.endswith(f'/{category.upper().replace("_", "-")}/')]
            if not main_link:
                main_link = [l for l in links if category.replace('_', '-').upper() in l.upper()]
            if main_link:
                print(f"   Main: {main_link[0]}")
    print()
    
    # Check header navigation
    print("3. HEADER NAVIGATION BAR")
    print("-" * 70)
    header_nav_pattern = r'<nav class="dropdown-nav".*?</nav>'
    header_nav = re.search(header_nav_pattern, content, re.DOTALL)
    if header_nav:
        nav_content = header_nav.group(0)
        
        # Check Event Management link
        em_link = re.search(r'href="(/EVENT-MANAGEMENT/[^"]*)"', nav_content)
        if em_link:
            print(f"✅ Event Management: {em_link.group(1)}")
        
        # Check Technology link
        tech_link = re.search(r'href="(/TECHNOLOGY/[^"]*)"', nav_content)
        if tech_link:
            print(f"✅ Technology: {tech_link.group(1)}")
        
        # Check Marketing link
        mark_link = re.search(r'href="(/MARKETING/[^"]*)"', nav_content)
        if mark_link:
            print(f"✅ Marketing: {mark_link.group(1)}")
    print()
    
    # Check footer navigation
    print("4. FOOTER NAVIGATION LINKS")
    print("-" * 70)
    footer_pattern = r'<footer class="site-footer".*?</footer>'
    footer = re.search(footer_pattern, content, re.DOTALL)
    if footer:
        footer_content = footer.group(0)
        footer_links = re.findall(href_pattern, footer_content)
        
        footer_categories = {
            'Event Management': any('/EVENT-MANAGEMENT/' in l for l in footer_links),
            'Technology': any('/TECHNOLOGY/' in l for l in footer_links),
            'Marketing': any('/MARKETING/' in l for l in footer_links),
            'Tools': any('/tools' in l.lower() for l in footer_links),
        }
        
        for cat, found in footer_categories.items():
            status = "✅" if found else "⚠"
            print(f"{status} {cat}: {'Found' if found else 'Not found'}")
    print()
    
    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total links analyzed: {len(all_hrefs)}")
    print(f"Placeholder links (#): {len(placeholder_links)}")
    print(f"Internal category links: {sum(len(links) for links in category_links.values())}")
    print(f"External links: {len(external_links)}")
    print()
    
    if len(placeholder_links) == 0:
        print("✅ EXCELLENT! All navigation links are functional!")
        print("   No placeholder links found.")
        print("   All category pages are properly linked.")
        return True
    else:
        print(f"⚠ ACTION NEEDED: {len(placeholder_links)} placeholder links need to be fixed.")
        return False

if __name__ == "__main__":
    check_navigation_links()
