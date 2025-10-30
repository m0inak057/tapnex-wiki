#!/usr/bin/env python3
"""
Script to verify breadcrumb schema implementation across all article pages
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple

BASE_DIR = Path(__file__).parent.parent
FOLDERS_TO_PROCESS = ['EVENT-MANAGEMENT', 'MARKETING', 'TECHNOLOGY']

def extract_breadcrumb_schema(html_content: str) -> dict:
    """Extract and parse the breadcrumb schema from HTML"""
    # Find all script tags with type="application/ld+json"
    schema_pattern = r'<script type="application/ld\+json">(.*?)</script>'
    schemas = re.findall(schema_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    for schema_str in schemas:
        try:
            schema = json.loads(schema_str.strip())
            if schema.get('@type') == 'BreadcrumbList':
                return schema
        except json.JSONDecodeError:
            continue
    
    return None

def validate_breadcrumb_schema(schema: dict, file_path: Path) -> Tuple[bool, List[str]]:
    """Validate the breadcrumb schema structure"""
    errors = []
    
    if not schema:
        errors.append("No BreadcrumbList schema found")
        return False, errors
    
    # Check required fields
    if schema.get('@context') != 'https://schema.org':
        errors.append(f"Invalid @context: {schema.get('@context')}")
    
    if schema.get('@type') != 'BreadcrumbList':
        errors.append(f"Invalid @type: {schema.get('@type')}")
    
    # Check itemListElement
    items = schema.get('itemListElement', [])
    if not items or len(items) < 3:
        errors.append(f"Expected at least 3 breadcrumb items, found {len(items)}")
        return False, errors
    
    # Validate each item
    for i, item in enumerate(items, 1):
        if item.get('@type') != 'ListItem':
            errors.append(f"Item {i}: Invalid @type")
        
        if item.get('position') != i:
            errors.append(f"Item {i}: Position mismatch (expected {i}, got {item.get('position')})")
        
        if not item.get('name'):
            errors.append(f"Item {i}: Missing name")
        
        if not item.get('item'):
            errors.append(f"Item {i}: Missing item URL")
        
        # Validate URL format
        item_url = item.get('item', '')
        if item_url and not item_url.startswith('https://wiki.tapnex.tech'):
            errors.append(f"Item {i}: Invalid URL domain: {item_url}")
    
    # Check breadcrumb hierarchy
    if items:
        if items[0].get('name') != 'TapNex Wiki Home':
            errors.append("First breadcrumb should be 'TapNex Wiki Home'")
        
        if items[0].get('item') != 'https://wiki.tapnex.tech/':
            errors.append(f"First breadcrumb URL should be 'https://wiki.tapnex.tech/', got {items[0].get('item')}")
    
    return len(errors) == 0, errors

def verify_file(file_path: Path, category: str) -> Tuple[bool, dict, List[str]]:
    """Verify breadcrumb schema in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        schema = extract_breadcrumb_schema(content)
        is_valid, errors = validate_breadcrumb_schema(schema, file_path)
        
        return is_valid, schema, errors
        
    except Exception as e:
        return False, None, [f"Error reading file: {str(e)}"]

def verify_folder(base_path: Path, category: str) -> Dict:
    """Verify all files in a category folder"""
    category_path = base_path / category
    results = {
        'category': category,
        'total': 0,
        'valid': 0,
        'invalid': 0,
        'files': []
    }
    
    if not category_path.exists():
        return results
    
    for subfolder in category_path.iterdir():
        if subfolder.is_dir():
            index_file = subfolder / 'index.html'
            if index_file.exists():
                results['total'] += 1
                is_valid, schema, errors = verify_file(index_file, category)
                
                file_result = {
                    'path': str(index_file.relative_to(base_path)),
                    'subfolder': subfolder.name,
                    'valid': is_valid,
                    'errors': errors
                }
                
                if schema and schema.get('itemListElement'):
                    items = schema['itemListElement']
                    file_result['breadcrumb'] = ' > '.join([item.get('name', '?') for item in items])
                
                results['files'].append(file_result)
                
                if is_valid:
                    results['valid'] += 1
                else:
                    results['invalid'] += 1
    
    return results

def print_report(all_results: List[Dict]):
    """Print a detailed verification report"""
    print("=" * 80)
    print("📊 BREADCRUMB SCHEMA VERIFICATION REPORT")
    print("=" * 80)
    
    total_all = sum(r['total'] for r in all_results)
    valid_all = sum(r['valid'] for r in all_results)
    invalid_all = sum(r['invalid'] for r in all_results)
    
    print(f"\n✨ Overall Summary: {valid_all}/{total_all} files have valid breadcrumb schema")
    
    if invalid_all > 0:
        print(f"⚠️  {invalid_all} files have issues that need attention")
    else:
        print("✅ All files passed validation!")
    
    for result in all_results:
        print(f"\n{'='*80}")
        print(f"📁 Category: {result['category']}")
        print(f"   Files: {result['total']} | Valid: {result['valid']} | Invalid: {result['invalid']}")
        print(f"{'='*80}")
        
        # Show valid files
        valid_files = [f for f in result['files'] if f['valid']]
        if valid_files:
            print(f"\n✅ Valid Files ({len(valid_files)}):")
            for file_info in valid_files:
                print(f"   • {file_info['subfolder']}")
                if 'breadcrumb' in file_info:
                    print(f"     {file_info['breadcrumb']}")
        
        # Show invalid files with errors
        invalid_files = [f for f in result['files'] if not f['valid']]
        if invalid_files:
            print(f"\n❌ Invalid Files ({len(invalid_files)}):")
            for file_info in invalid_files:
                print(f"   • {file_info['subfolder']}")
                print(f"     Path: {file_info['path']}")
                for error in file_info['errors']:
                    print(f"     - {error}")
    
    print("\n" + "=" * 80)
    print("📝 TESTING RECOMMENDATIONS")
    print("=" * 80)
    print("\n1. Test with Google's Rich Results Test:")
    print("   https://search.google.com/test/rich-results")
    print("\n2. Validate with Schema.org Validator:")
    print("   https://validator.schema.org/")
    print("\n3. Sample URLs to test:")
    
    # Show sample URLs from each category
    for result in all_results:
        if result['files']:
            sample_file = result['files'][0]
            category_lower = result['category'].lower()
            subfolder = sample_file['subfolder']
            print(f"   • https://wiki.tapnex.tech/{result['category']}/{subfolder}/")
    
    print("\n4. Monitor in Google Search Console:")
    print("   - Enhancements > Breadcrumb")
    print("   - Check for breadcrumb rich results appearance")
    
    print("\n" + "=" * 80)

def main():
    """Main verification function"""
    all_results = []
    
    for category in FOLDERS_TO_PROCESS:
        results = verify_folder(BASE_DIR, category)
        all_results.append(results)
    
    print_report(all_results)

if __name__ == '__main__':
    main()
