#!/usr/bin/env python3
"""
SAFE Ad Removal Script
This script ONLY removes ad blocks, keeping all content intact.
"""

import re
import os
import glob

# Pattern to match ad blocks - more specific to avoid matching content
AD_BLOCK_PATTERN = re.compile(
    r'<!-- AdSense.*?-->\s*'
    r'<div class="ad-container[^>]*>.*?'
    r'<script async src="https://pagead2\.googlesyndication\.com.*?</script>\s*'
    r'<ins class="adsbygoogle".*?</ins>\s*'
    r'<script>.*?\(adsbygoogle = window\.adsbygoogle.*?</script>\s*'
    r'</div>',
    re.DOTALL | re.MULTILINE
)

def remove_ads_from_file(file_path, create_backup=True):
    """Remove ad blocks from a single file"""
    
    try:
        if not os.path.exists(file_path):
            return False, f"File not found: {file_path}"
        
        # Read original content
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
    except Exception as e:
        return False, f"Error reading file: {str(e)}"
    
    original_size = len(original_content)
    
    # Count ad blocks
    ad_matches = list(AD_BLOCK_PATTERN.finditer(original_content))
    ad_count = len(ad_matches)
    
    if ad_count == 0:
        return True, f"No ad blocks found"
    
    # Create backup if requested
    if create_backup:
        backup_path = file_path + '.backup'
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
    
    # Remove ad blocks
    new_content = AD_BLOCK_PATTERN.sub('', original_content)
    new_size = len(new_content)
    
    # Verify important content markers still exist
    checks = [
        ('<body', 'Body tag'),
        ('</body>', 'Closing body tag'),
        ('<article', 'Article tag'),
        ('<footer', 'Footer tag'),
    ]
    
    for marker, description in checks:
        if (marker in original_content) and (marker not in new_content):
            return False, f"ERROR: {description} removed! Not safe."
    
    # Write cleaned content
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    except Exception as e:
        return False, f"Error writing file: {str(e)}"
    
    removed_size = original_size - new_size
    return True, f"Removed {ad_count} ad blocks ({removed_size} bytes)"

def test_single_file(file_path):
    """Test on one file and show results"""
    print(f"\n{'='*80}")
    print(f"TESTING: {file_path}")
    print(f"{'='*80}\n")
    
    success, message = remove_ads_from_file(file_path, create_backup=True)
    
    if success:
        print(f"✅ SUCCESS: {message}")
        print(f"✅ Backup created: {file_path}.backup")
        print(f"\n⚠️  Please manually verify the file looks correct!")
    else:
        print(f"❌ FAILED: {message}")
    
    return success

def process_all_jain_docs():
    """Remove ads from all Jain Docs files"""
    jain_docs_pattern = "Jain Docs/Pages/*.html"
    files = glob.glob(jain_docs_pattern)
    
    print(f"\n{'='*80}")
    print(f"Processing {len(files)} Jain Docs files")
    print(f"{'='*80}\n")
    
    success_count = 0
    failure_count = 0
    no_ads_count = 0
    
    for i, file_path in enumerate(files, 1):
        filename = os.path.basename(file_path)
        print(f"[{i}/{len(files)}] {filename[:50]}...", end=' ')
        
        success, message = remove_ads_from_file(file_path, create_backup=False)
        
        if success:
            if "No ad blocks" in message:
                print(f"⊘ {message}")
                no_ads_count += 1
            else:
                print(f"✓ {message}")
                success_count += 1
        else:
            print(f"✗ {message}")
            failure_count += 1
    
    print(f"\n{'='*80}")
    print(f"SUMMARY:")
    print(f"{'='*80}")
    print(f"✅ Successfully processed: {success_count} files")
    print(f"⊘  No ads found: {no_ads_count} files")
    print(f"❌ Failed: {failure_count} files")
    print(f"{'='*80}\n")
    
    return failure_count == 0

if __name__ == "__main__":
    import sys
    
    print("\n" + "="*80)
    print("SAFE AD REMOVAL SCRIPT")
    print("="*80)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--all":
        print("\n⚠️  PROCESSING ALL JAIN DOCS FILES")
        print("="*80)
        
        response = input("\nAre you sure you want to remove ads from ALL Jain Docs files? (yes/no): ")
        if response.lower() != 'yes':
            print("❌ Cancelled by user")
            sys.exit(0)
        
        process_all_jain_docs()
    else:
        print("\nTEST MODE - Processing ONE file only")
        print("="*80)
        test_file = "Jain Docs/Pages/Acharya Shri 108 Samay Sagar Ji Maharaj.html"
        
        success = test_single_file(test_file)
        
        if success:
            print("\n" + "="*80)
            print("NEXT STEPS:")
            print("="*80)
            print("1. Open the test file and verify it looks correct")
            print("2. Check that all content is still there")
            print("3. Check that ads are gone")
            print("4. If everything looks good, run:")
            print("   python scripts/remove-ads-safe.py --all")
            print("5. If something is wrong:")
            print("   mv 'Jain Docs/Pages/Acharya Shri 108 Samay Sagar Ji Maharaj.html.backup' \\")
            print("      'Jain Docs/Pages/Acharya Shri 108 Samay Sagar Ji Maharaj.html'")
