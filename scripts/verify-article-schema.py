#!/usr/bin/env python3
"""
Script to verify Article schema implementation across all article pages
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple

BASE_DIR = Path(__file__).parent.parent
FOLDERS_TO_PROCESS = ['EVENT-MANAGEMENT', 'MARKETING', 'TECHNOLOGY']

# Required fields for Article schema
REQUIRED_FIELDS = [
    '@context',
    '@type',
    'headline',
    'image',
    'datePublished',
    'dateModified',
    'author',
    'publisher',
    'description',
    'mainEntityOfPage'
]

def extract_article_schema(html_content: str) -> dict:
    """Extract and parse the article schema from HTML"""
    # Find all script tags with type="application/ld+json"
    schema_pattern = r'<script type="application/ld\+json">(.*?)</script>'
    schemas = re.findall(schema_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    for schema_str in schemas:
        try:
            schema = json.loads(schema_str.strip())
            if schema.get('@type') in ['Article', 'TechArticle']:
                return schema
        except json.JSONDecodeError:
            continue
    
    return None

def validate_article_schema(schema: dict, file_path: Path, expected_type: str) -> Tuple[bool, List[str]]:
    """Validate the article schema structure"""
    errors = []
    warnings = []
    
    if not schema:
        errors.append("No Article/TechArticle schema found")
        return False, errors
    
    # Check @context
    if schema.get('@context') != 'https://schema.org':
        errors.append(f"Invalid @context: {schema.get('@context')}")
    
    # Check @type
    schema_type = schema.get('@type')
    if schema_type not in ['Article', 'TechArticle']:
        errors.append(f"Invalid @type: {schema_type}")
    elif schema_type != expected_type:
        warnings.append(f"Expected @type: {expected_type}, found: {schema_type}")
    
    # Check required fields
    for field in REQUIRED_FIELDS:
        if field not in schema:
            errors.append(f"Missing required field: {field}")
    
    # Validate headline
    headline = schema.get('headline', '')
    if headline:
        if len(headline) < 10:
            warnings.append(f"Headline too short: {len(headline)} chars")
        elif len(headline) > 110:
            warnings.append(f"Headline too long: {len(headline)} chars (recommended: 110 max)")
    
    # Validate image
    image = schema.get('image', '')
    if image and not image.startswith('https://'):
        errors.append(f"Image URL should use HTTPS: {image}")
    
    # Validate dates
    date_published = schema.get('datePublished', '')
    date_modified = schema.get('dateModified', '')
    
    if date_published and not re.match(r'\d{4}-\d{2}-\d{2}', date_published):
        errors.append(f"Invalid datePublished format: {date_published} (use YYYY-MM-DD)")
    
    if date_modified and not re.match(r'\d{4}-\d{2}-\d{2}', date_modified):
        errors.append(f"Invalid dateModified format: {date_modified} (use YYYY-MM-DD)")
    
    # Validate author
    author = schema.get('author', {})
    if author:
        if author.get('@type') != 'Organization':
            warnings.append(f"Author @type should be 'Organization', found: {author.get('@type')}")
        if not author.get('name'):
            errors.append("Author missing 'name' field")
    
    # Validate publisher
    publisher = schema.get('publisher', {})
    if publisher:
        if publisher.get('@type') != 'Organization':
            errors.append(f"Publisher @type should be 'Organization', found: {publisher.get('@type')}")
        if not publisher.get('name'):
            errors.append("Publisher missing 'name' field")
        
        logo = publisher.get('logo', {})
        if logo:
            if logo.get('@type') != 'ImageObject':
                errors.append(f"Publisher logo @type should be 'ImageObject'")
            if not logo.get('url'):
                errors.append("Publisher logo missing 'url' field")
    
    # Validate description
    description = schema.get('description', '')
    if description:
        if len(description) < 50:
            warnings.append(f"Description too short: {len(description)} chars")
        elif len(description) > 160:
            warnings.append(f"Description long: {len(description)} chars (recommended: 50-160)")
    
    # Validate mainEntityOfPage
    main_entity = schema.get('mainEntityOfPage', {})
    if main_entity:
        if main_entity.get('@type') != 'WebPage':
            errors.append(f"mainEntityOfPage @type should be 'WebPage'")
        page_id = main_entity.get('@id', '')
        if page_id and not page_id.startswith('https://wiki.tapnex.tech'):
            errors.append(f"mainEntityOfPage @id should be wiki.tapnex.tech URL")
    
    return len(errors) == 0, errors + [f"⚠️ {w}" for w in warnings]

def verify_file(file_path: Path, category: str, expected_type: str) -> Tuple[bool, dict, List[str]]:
    """Verify article schema in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        schema = extract_article_schema(content)
        is_valid, messages = validate_article_schema(schema, file_path, expected_type)
        
        return is_valid, schema, messages
        
    except Exception as e:
        return False, None, [f"Error reading file: {str(e)}"]

def verify_folder(base_path: Path, category: str) -> Dict:
    """Verify all files in a category folder"""
    category_path = base_path / category
    
    # Determine expected schema type
    expected_type = 'TechArticle' if category == 'TECHNOLOGY' else 'Article'
    
    results = {
        'category': category,
        'expected_type': expected_type,
        'total': 0,
        'valid': 0,
        'invalid': 0,
        'files': []
    }
    
    if not category_path.exists():
        return results
    
    for subfolder in sorted(category_path.iterdir()):
        if subfolder.is_dir():
            index_file = subfolder / 'index.html'
            if index_file.exists():
                results['total'] += 1
                is_valid, schema, messages = verify_file(index_file, category, expected_type)
                
                file_result = {
                    'path': str(index_file.relative_to(base_path)),
                    'subfolder': subfolder.name,
                    'valid': is_valid,
                    'messages': messages
                }
                
                if schema:
                    file_result['headline'] = schema.get('headline', 'N/A')
                    file_result['type'] = schema.get('@type', 'N/A')
                
                results['files'].append(file_result)
                
                if is_valid:
                    results['valid'] += 1
                else:
                    results['invalid'] += 1
    
    return results

def print_report(all_results: List[Dict]):
    """Print a detailed verification report"""
    print("=" * 80)
    print("📊 ARTICLE SCHEMA VERIFICATION REPORT")
    print("=" * 80)
    
    total_all = sum(r['total'] for r in all_results)
    valid_all = sum(r['valid'] for r in all_results)
    invalid_all = sum(r['invalid'] for r in all_results)
    
    print(f"\n✨ Overall Summary: {valid_all}/{total_all} files have valid Article schema")
    
    if invalid_all > 0:
        print(f"⚠️  {invalid_all} files have issues that need attention")
    else:
        print("✅ All files passed validation!")
    
    for result in all_results:
        print(f"\n{'='*80}")
        print(f"📁 Category: {result['category']} (Expected: {result['expected_type']})")
        print(f"   Files: {result['total']} | Valid: {result['valid']} | Issues: {result['invalid']}")
        print(f"{'='*80}")
        
        # Show valid files
        valid_files = [f for f in result['files'] if f['valid'] and not any('⚠️' in m for m in f.get('messages', []))]
        if valid_files:
            print(f"\n✅ Valid Files ({len(valid_files)}):")
            for file_info in valid_files:
                print(f"   • {file_info['subfolder']} ({file_info.get('type', 'N/A')})")
                if 'headline' in file_info:
                    headline = file_info['headline']
                    if len(headline) > 60:
                        headline = headline[:60] + '...'
                    print(f"     {headline}")
        
        # Show files with warnings
        warning_files = [f for f in result['files'] if f['valid'] and any('⚠️' in m for m in f.get('messages', []))]
        if warning_files:
            print(f"\n⚠️  Valid with Warnings ({len(warning_files)}):")
            for file_info in warning_files:
                print(f"   • {file_info['subfolder']}")
                for msg in file_info['messages']:
                    if '⚠️' in msg:
                        print(f"     {msg}")
        
        # Show invalid files with errors
        invalid_files = [f for f in result['files'] if not f['valid']]
        if invalid_files:
            print(f"\n❌ Invalid Files ({len(invalid_files)}):")
            for file_info in invalid_files:
                print(f"   • {file_info['subfolder']}")
                print(f"     Path: {file_info['path']}")
                for msg in file_info['messages']:
                    if '⚠️' not in msg:
                        print(f"     - {msg}")
    
    print("\n" + "=" * 80)
    print("📝 TESTING RECOMMENDATIONS")
    print("=" * 80)
    print("\n1. Test with Google's Rich Results Test:")
    print("   https://search.google.com/test/rich-results")
    print("\n2. Validate with Schema.org Validator:")
    print("   https://validator.schema.org/")
    print("\n3. Check Google Search Console:")
    print("   • Enhancements > Articles")
    print("   • Monitor for rich results eligibility")
    print("\n4. Article Schema Benefits:")
    print("   • Enhanced article appearance in search")
    print("   • Potential Top Stories carousel eligibility")
    print("   • Better content categorization by Google")
    print("   • Improved snippet generation")
    
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
