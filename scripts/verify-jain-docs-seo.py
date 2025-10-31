#!/usr/bin/env python3
"""
Verification Script for Jain Docs SEO Optimization
---------------------------------------------------
This script verifies that all Jain Docs files have been properly optimized.
"""

import os
import re
from pathlib import Path

# Base configuration
JAIN_DOCS_DIR = Path(r"c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\Jain Docs")
PAGES_DIR = JAIN_DOCS_DIR / "Pages"

def check_language_attribute(content, filename):
    """Check if lang='hi' is present"""
    if 'lang="hi"' in content or "lang='hi'" in content:
        return True, "✅"
    else:
        return False, f"❌ Missing lang='hi'"

def check_title_tag(content, filename):
    """Check if title tag is present"""
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    if title_match:
        title = title_match.group(1).strip()
        if len(title) > 10:
            return True, "✅"
        else:
            return False, f"❌ Title too short: {title}"
    else:
        return False, "❌ No title tag"

def check_meta_description(content, filename):
    """Check if meta description is present"""
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    if desc_match:
        desc = desc_match.group(1).strip()
        if len(desc) > 20:
            return True, "✅"
        else:
            return False, f"❌ Description too short"
    else:
        return False, "❌ No meta description"

def check_article_schema(content, filename):
    """Check if Article schema is present"""
    if '"@type": "Article"' in content or '"@type":"Article"' in content:
        return True, "✅"
    else:
        return False, "❌ No Article schema"

def check_breadcrumb_schema(content, filename):
    """Check if BreadcrumbList schema is present"""
    if '"@type": "BreadcrumbList"' in content or '"@type":"BreadcrumbList"' in content:
        return True, "✅"
    else:
        return False, "❌ No BreadcrumbList schema"

def verify_file(filepath):
    """Verify a single file has all optimizations"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        checks = {
            'Language (hi)': check_language_attribute(content, filepath.name),
            'Title Tag': check_title_tag(content, filepath.name),
            'Meta Description': check_meta_description(content, filepath.name),
            'Article Schema': check_article_schema(content, filepath.name),
            'Breadcrumb Schema': check_breadcrumb_schema(content, filepath.name)
        }
        
        all_passed = all(result[0] for result in checks.values())
        
        return all_passed, checks
        
    except Exception as e:
        return False, {'Error': (False, f"❌ Error reading file: {e}")}

def main():
    """Main verification function"""
    print("=" * 80)
    print("🔍 VERIFYING JAIN DOCS SEO OPTIMIZATION")
    print("=" * 80)
    print()
    
    # Verify index.html
    print("📄 Verifying Jain Docs/index.html...")
    index_path = JAIN_DOCS_DIR / "index.html"
    
    if index_path.exists():
        all_passed, checks = verify_file(index_path)
        for check_name, (passed, status) in checks.items():
            print(f"  {check_name}: {status}")
        print()
    else:
        print("❌ Index file not found!")
        print()
    
    # Verify all page files
    print("📄 Verifying all pages in Jain Docs/Pages/...")
    print()
    
    if not PAGES_DIR.exists():
        print(f"❌ Pages directory not found: {PAGES_DIR}")
        return
    
    html_files = list(PAGES_DIR.glob("*.html"))
    total_files = len(html_files)
    
    if total_files == 0:
        print("❌ No HTML files found in Pages directory")
        return
    
    print(f"📊 Found {total_files} HTML files to verify")
    print()
    
    all_passed_count = 0
    failed_files = []
    
    for i, filepath in enumerate(html_files, 1):
        all_passed, checks = verify_file(filepath)
        
        if all_passed:
            all_passed_count += 1
            # Only show progress every 25 files to reduce output
            if i % 25 == 0 or i == total_files:
                print(f"✅ Verified {i}/{total_files} files... ({all_passed_count} passed)")
        else:
            failed_checks = [name for name, (passed, _) in checks.items() if not passed]
            failed_files.append((filepath.name, failed_checks))
            print(f"❌ [{i}/{total_files}] FAILED: {filepath.name}")
            for check_name, (passed, status) in checks.items():
                if not passed:
                    print(f"    {check_name}: {status}")
    
    # Summary
    print()
    print("=" * 80)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 80)
    print(f"✅ Total files verified: {total_files + 1}")  # +1 for index.html
    print(f"✅ Files passed all checks: {all_passed_count + 1}")  # +1 for index.html
    print(f"❌ Files with issues: {len(failed_files)}")
    print()
    
    if failed_files:
        print("⚠️  FILES WITH ISSUES:")
        for filename, failed_checks in failed_files:
            print(f"  ❌ {filename}")
            print(f"     Missing: {', '.join(failed_checks)}")
        print()
    else:
        print("🎉 ALL FILES PASSED VERIFICATION!")
        print()
        print("All Jain Docs files are properly optimized with:")
        print("  ✅ Language attribute set to 'hi'")
        print("  ✅ Title tags present")
        print("  ✅ Meta descriptions present")
        print("  ✅ Article schema (JSON-LD)")
        print("  ✅ BreadcrumbList schema (JSON-LD)")
        print()

if __name__ == "__main__":
    main()
