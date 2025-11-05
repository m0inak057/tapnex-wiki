#!/usr/bin/env python3
"""
FAQ Schema Verification Script
===============================
Validates FAQPage schema implementation across all pages that should have FAQ structured data.
Checks for proper JSON-LD format, required fields, and content quality.

Author: TAPNEX SEO Team
Date: 2025
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple

# ANSI color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
CYAN = '\033[96m'
BOLD = '\033[1m'
RESET = '\033[0m'

# Base directory
BASE_DIR = Path(r"C:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX")

# Pages that should have FAQ schema (4 existing + 9 newly added in Task 6)
EXPECTED_FAQ_PAGES = {
    # Existing FAQ pages (before Task 6)
    "TECHNOLOGY/NFC/index.html": "NFC Technology",
    "TECHNOLOGY/Generative-AI/index.html": "Generative AI",
    "MARKETING/social-media-strategy/index.html": "Social Media Strategy",
    "EVENT-MANAGEMENT/ticketing-platform/index.html": "Ticketing Platform",
    
    # Newly added in Task 6 - EVENT-MANAGEMENT (3)
    "EVENT-MANAGEMENT/Event-budgeting/index.html": "Event Budgeting",
    "EVENT-MANAGEMENT/volunteer-systems/index.html": "Volunteer Systems",
    "EVENT-MANAGEMENT/Logistic-Planning/index.html": "Logistics Planning",
    
    # Newly added in Task 6 - MARKETING (3)
    "MARKETING/content-marketing/index.html": "Content Marketing",
    "MARKETING/email-campaigns/index.html": "Email Campaigns",
    "MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing/index.html": "AI-Powered Content",
    
    # Newly added in Task 6 - TECHNOLOGY (3)
    "TECHNOLOGY/5G-Technology/index.html": "5G Technology",
    "TECHNOLOGY/APIs/index.html": "APIs",
    "TECHNOLOGY/Web-Development/index.html": "Web Development",
}

class FAQSchemaValidator:
    """Validates FAQ schema implementations in HTML files."""
    
    def __init__(self):
        self.results = {
            'valid': [],
            'invalid': [],
            'missing': [],
            'warnings': []
        }
    
    def extract_faq_schema(self, html_content: str) -> Tuple[bool, Dict | None, List[str]]:
        """
        Extract and parse FAQ schema from HTML content.
        
        Returns:
            Tuple of (found, schema_dict, issues)
        """
        issues = []
        
        # Find FAQ schema script tag
        faq_pattern = r'<script type="application/ld\+json">\s*({[^<]*"@type"\s*:\s*"FAQPage"[^<]*})\s*</script>'
        matches = re.finditer(faq_pattern, html_content, re.DOTALL)
        
        faq_schemas = list(matches)
        
        if not faq_schemas:
            return False, None, ["FAQ schema not found"]
        
        if len(faq_schemas) > 1:
            issues.append(f"Multiple FAQ schemas found ({len(faq_schemas)})")
        
        # Parse the first FAQ schema
        try:
            schema_text = faq_schemas[0].group(1)
            # Clean up the JSON
            schema_text = re.sub(r'\s+', ' ', schema_text)
            schema = json.loads(schema_text)
            
            return True, schema, issues
            
        except json.JSONDecodeError as e:
            issues.append(f"Invalid JSON: {str(e)}")
            return True, None, issues
    
    def validate_faq_structure(self, schema: Dict, page_title: str) -> List[str]:
        """
        Validate the structure and content of FAQ schema.
        
        Returns:
            List of validation issues (empty if valid)
        """
        issues = []
        
        # Check required fields
        if '@context' not in schema:
            issues.append("Missing @context")
        elif schema['@context'] != 'https://schema.org':
            issues.append(f"Invalid @context: {schema['@context']}")
        
        if '@type' not in schema:
            issues.append("Missing @type")
        elif schema['@type'] != 'FAQPage':
            issues.append(f"Invalid @type: {schema['@type']}")
        
        if 'mainEntity' not in schema:
            issues.append("Missing mainEntity array")
            return issues
        
        # Validate questions
        questions = schema['mainEntity']
        
        if not isinstance(questions, list):
            issues.append("mainEntity must be an array")
            return issues
        
        if len(questions) == 0:
            issues.append("No questions found in FAQ")
            return issues
        
        if len(questions) < 3:
            issues.append(f"Only {len(questions)} questions (recommend 5+)")
        
        # Validate each question
        for i, question in enumerate(questions, 1):
            q_issues = []
            
            if '@type' not in question or question['@type'] != 'Question':
                q_issues.append("Missing or invalid @type")
            
            if 'name' not in question:
                q_issues.append("Missing question text")
            else:
                q_text = question['name']
                if len(q_text) < 10:
                    q_issues.append(f"Question too short: {len(q_text)} chars")
                if not q_text.endswith('?'):
                    q_issues.append("Question should end with '?'")
            
            if 'acceptedAnswer' not in question:
                q_issues.append("Missing acceptedAnswer")
            else:
                answer = question['acceptedAnswer']
                
                if '@type' not in answer or answer['@type'] != 'Answer':
                    q_issues.append("Invalid answer @type")
                
                if 'text' not in answer:
                    q_issues.append("Missing answer text")
                else:
                    a_text = answer['text']
                    if len(a_text) < 50:
                        q_issues.append(f"Answer too short: {len(a_text)} chars")
                    elif len(a_text) > 1000:
                        q_issues.append(f"Answer very long: {len(a_text)} chars (may be truncated in SERPs)")
            
            if q_issues:
                issues.append(f"Question {i}: {', '.join(q_issues)}")
        
        return issues
    
    def validate_file(self, file_path: Path, page_title: str) -> Dict:
        """
        Validate FAQ schema in a single HTML file.
        
        Returns:
            Dict with validation results
        """
        result = {
            'file': str(file_path.relative_to(BASE_DIR)),
            'title': page_title,
            'status': 'unknown',
            'issues': [],
            'question_count': 0
        }
        
        if not file_path.exists():
            result['status'] = 'missing'
            result['issues'].append('File not found')
            return result
        
        # Read file content
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
        except Exception as e:
            result['status'] = 'error'
            result['issues'].append(f'Failed to read file: {str(e)}')
            return result
        
        # Extract FAQ schema
        found, schema, extract_issues = self.extract_faq_schema(html_content)
        
        if not found:
            result['status'] = 'missing'
            result['issues'].extend(extract_issues)
            return result
        
        if schema is None:
            result['status'] = 'invalid'
            result['issues'].extend(extract_issues)
            return result
        
        # Validate schema structure
        validation_issues = self.validate_faq_structure(schema, page_title)
        
        # Count questions
        if 'mainEntity' in schema and isinstance(schema['mainEntity'], list):
            result['question_count'] = len(schema['mainEntity'])
        
        # Determine status
        if validation_issues:
            result['status'] = 'warning' if not any('Missing' in issue or 'Invalid' in issue for issue in validation_issues) else 'invalid'
            result['issues'].extend(validation_issues)
        else:
            result['status'] = 'valid'
        
        # Add extraction issues as warnings
        if extract_issues:
            result['issues'].extend([f"Warning: {issue}" for issue in extract_issues])
        
        return result
    
    def validate_all(self) -> Dict:
        """
        Validate all expected FAQ pages.
        
        Returns:
            Dict with summary statistics
        """
        print(f"\n{BOLD}{CYAN}{'='*70}{RESET}")
        print(f"{BOLD}{CYAN}FAQ Schema Validation Report{RESET}")
        print(f"{BOLD}{CYAN}{'='*70}{RESET}\n")
        
        total = len(EXPECTED_FAQ_PAGES)
        
        for rel_path, page_title in EXPECTED_FAQ_PAGES.items():
            file_path = BASE_DIR / rel_path
            result = self.validate_file(file_path, page_title)
            
            # Categorize result
            if result['status'] == 'valid':
                self.results['valid'].append(result)
            elif result['status'] == 'missing':
                self.results['missing'].append(result)
            elif result['status'] == 'warning':
                self.results['warnings'].append(result)
            else:
                self.results['invalid'].append(result)
        
        # Print results
        self._print_results()
        
        # Return summary
        return {
            'total': total,
            'valid': len(self.results['valid']),
            'warnings': len(self.results['warnings']),
            'invalid': len(self.results['invalid']),
            'missing': len(self.results['missing'])
        }
    
    def _print_results(self):
        """Print formatted validation results."""
        
        # Valid pages
        if self.results['valid']:
            print(f"{BOLD}{GREEN}✓ Valid FAQ Schemas ({len(self.results['valid'])}){RESET}")
            print(f"{GREEN}{'─'*70}{RESET}")
            for result in self.results['valid']:
                q_count = result['question_count']
                print(f"{GREEN}  ✓ {result['title']}{RESET}")
                print(f"    File: {result['file']}")
                print(f"    Questions: {q_count}")
                print()
        
        # Pages with warnings
        if self.results['warnings']:
            print(f"{BOLD}{YELLOW}⚠ Pages with Warnings ({len(self.results['warnings'])}){RESET}")
            print(f"{YELLOW}{'─'*70}{RESET}")
            for result in self.results['warnings']:
                q_count = result['question_count']
                print(f"{YELLOW}  ⚠ {result['title']}{RESET}")
                print(f"    File: {result['file']}")
                print(f"    Questions: {q_count}")
                print(f"    Issues:")
                for issue in result['issues']:
                    print(f"      • {issue}")
                print()
        
        # Invalid pages
        if self.results['invalid']:
            print(f"{BOLD}{RED}✗ Invalid FAQ Schemas ({len(self.results['invalid'])}){RESET}")
            print(f"{RED}{'─'*70}{RESET}")
            for result in self.results['invalid']:
                print(f"{RED}  ✗ {result['title']}{RESET}")
                print(f"    File: {result['file']}")
                print(f"    Issues:")
                for issue in result['issues']:
                    print(f"      • {issue}")
                print()
        
        # Missing pages
        if self.results['missing']:
            print(f"{BOLD}{RED}✗ Missing FAQ Schemas ({len(self.results['missing'])}){RESET}")
            print(f"{RED}{'─'*70}{RESET}")
            for result in self.results['missing']:
                print(f"{RED}  ✗ {result['title']}{RESET}")
                print(f"    File: {result['file']}")
                print(f"    Issues:")
                for issue in result['issues']:
                    print(f"      • {issue}")
                print()
        
        # Summary
        total = len(EXPECTED_FAQ_PAGES)
        valid = len(self.results['valid'])
        warnings = len(self.results['warnings'])
        invalid = len(self.results['invalid'])
        missing = len(self.results['missing'])
        
        print(f"{BOLD}{CYAN}{'='*70}{RESET}")
        print(f"{BOLD}{CYAN}Summary{RESET}")
        print(f"{CYAN}{'─'*70}{RESET}")
        print(f"  Total pages checked: {total}")
        print(f"  {GREEN}✓ Valid: {valid}{RESET}")
        print(f"  {YELLOW}⚠ Warnings: {warnings}{RESET}")
        print(f"  {RED}✗ Invalid: {invalid}{RESET}")
        print(f"  {RED}✗ Missing: {missing}{RESET}")
        
        success_rate = ((valid + warnings) / total * 100) if total > 0 else 0
        print(f"\n  {BOLD}Success Rate: {success_rate:.1f}%{RESET}")
        
        # Calculate total questions
        total_questions = sum(r['question_count'] for r in self.results['valid']) + \
                         sum(r['question_count'] for r in self.results['warnings'])
        print(f"  {BOLD}Total FAQ Questions: {total_questions}{RESET}")
        
        print(f"{BOLD}{CYAN}{'='*70}{RESET}\n")
        
        # Overall status
        if invalid + missing == 0:
            if warnings == 0:
                print(f"{BOLD}{GREEN}🎉 All FAQ schemas are valid!{RESET}")
            else:
                print(f"{BOLD}{YELLOW}⚠ All FAQ schemas present but some have warnings{RESET}")
        else:
            print(f"{BOLD}{RED}❌ Some FAQ schemas are missing or invalid{RESET}")
        
        print()

def main():
    """Main execution function."""
    validator = FAQSchemaValidator()
    summary = validator.validate_all()
    
    # Exit with appropriate code
    if summary['invalid'] + summary['missing'] > 0:
        exit(1)
    elif summary['warnings'] > 0:
        exit(0)  # Warnings are acceptable
    else:
        exit(0)

if __name__ == '__main__':
    main()
