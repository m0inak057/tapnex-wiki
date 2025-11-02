#!/usr/bin/env python3
"""
SAFE Ad Replacement Script - TEST VERSION
This script ONLY replaces ad blocks, NOT content.
Tests on ONE file first before batch processing.
"""

import re
import os

# New ad script to use
NEW_AD_SCRIPT = '''<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4315586112110103"
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
</script>'''

# Pattern to match ONLY the ad block (more specific)
# Matches from <script async to </script> (inclusive)
AD_PATTERN = re.compile(
    r'<script async src="https://pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js\?client=ca-pub-4315586112110103"[^>]*>.*?</script>\s*'
    r'(?:<!--.*?-->)?[^<]*'
    r'<ins class="adsbygoogle"[^>]*>.*?</ins>\s*'
    r'<script>\s*'
    r'\(adsbygoogle = window\.adsbygoogle \|\| \[\]\)\.push\(\{\}\);\s*'
    r'</script>',
    re.DOTALL
)

def test_single_file(file_path):
    """Test replacement on a single file and show before/after"""
    print(f"\n{'='*80}")
    print(f"TESTING: {file_path}")
    print(f"{'='*80}\n")
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False
    
    # Read original content
    with open(file_path, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    original_lines = len(original_content.split('\n'))
    
    # Find all ad matches
    matches = list(AD_PATTERN.finditer(original_content))
    
    if not matches:
        print(f"⚠️  No ad blocks found in file!")
        return False
    
    print(f"✓ Found {len(matches)} ad blocks to replace")
    print(f"✓ Original file: {original_lines} lines\n")
    
    # Show first match as example
    print("Example of ad block to be replaced:")
    print("-" * 80)
    first_match = matches[0].group(0)
    print(first_match[:200] + "..." if len(first_match) > 200 else first_match)
    print("-" * 80)
    print("\nWill be replaced with:")
    print("-" * 80)
    print(NEW_AD_SCRIPT)
    print("-" * 80)
    
    # Perform replacement
    new_content = AD_PATTERN.sub(NEW_AD_SCRIPT, original_content)
    new_lines = len(new_content.split('\n'))
    
    # Verify content is preserved
    # Check that important content markers are still present
    checks = [
        ('<body', 'Body tag'),
        ('</body>', 'Closing body tag'),
        ('<article', 'Article tag'),
        ('<footer', 'Footer tag'),
        ('sidebar', 'Sidebar navigation'),
    ]
    
    print(f"\n✓ New file will have: {new_lines} lines")
    print(f"✓ Line difference: {new_lines - original_lines} lines\n")
    
    print("Content integrity checks:")
    all_checks_passed = True
    for marker, description in checks:
        in_original = marker in original_content
        in_new = marker in new_content
        status = "✓" if (in_original == in_new) else "❌"
        print(f"  {status} {description}: {'Present' if in_new else 'Missing'}")
        if in_original != in_new:
            all_checks_passed = False
    
    if not all_checks_passed:
        print("\n❌ FAILED: Content integrity check failed!")
        return False
    
    print("\n✓ All integrity checks passed!")
    
    # Create backup
    backup_path = file_path + '.backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original_content)
    print(f"✓ Backup created: {backup_path}")
    
    # Save new content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n✅ SUCCESS! File updated: {file_path}")
    print(f"   - Replaced {len(matches)} ad blocks")
    print(f"   - Backup saved at: {backup_path}")
    print(f"   - Please verify the file manually before proceeding with all files!")
    
    return True

if __name__ == "__main__":
    # Test on ONE file first
    test_file = "Jain Docs/Pages/Acharya Shri 108 Samay Sagar Ji Maharaj.html"
    
    print("\n" + "="*80)
    print("SAFE AD REPLACEMENT - TEST MODE")
    print("="*80)
    print("\nThis script will:")
    print("1. Test on ONE file only")
    print("2. Create a backup (.backup)")
    print("3. Show before/after comparison")
    print("4. Verify content integrity")
    print("\n⚠️  PLEASE REVIEW THE RESULTS BEFORE RUNNING ON ALL FILES!")
    print("="*80)
    
    success = test_single_file(test_file)
    
    if success:
        print("\n" + "="*80)
        print("NEXT STEPS:")
        print("="*80)
        print("1. Open the test file and verify it looks correct")
        print("2. Check that all content is still there")
        print("3. Check that ads are updated")
        print("4. If everything looks good, I can create a script to run on all files")
        print("5. If something is wrong, restore from .backup file")
    else:
        print("\n❌ Test failed! Not safe to proceed.")
