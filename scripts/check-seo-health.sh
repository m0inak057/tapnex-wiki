#!/bin/bash

# Google Search Console URL Submission Script
# This script helps submit URLs to Google for faster indexing

# Your website URLs - modify as needed
URLS=(
    "https://wiki.tapnex.tech/"
    "https://wiki.tapnex.tech/EVENT-MANAGEMENT/volunteer-systems/"
    "https://wiki.tapnex.tech/EVENT-MANAGEMENT/ticketing-platform/"
    "https://wiki.tapnex.tech/EVENT-MANAGEMENT/Event-budgeting/"
    "https://wiki.tapnex.tech/EVENT-MANAGEMENT/Logistic-Planning/"
    "https://wiki.tapnex.tech/MARKETING/social-media-strategy/"
    "https://wiki.tapnex.tech/MARKETING/content-marketing/"
    "https://wiki.tapnex.tech/TECHNOLOGY/Web-Development/"
    "https://wiki.tapnex.tech/TECHNOLOGY/APIs/"
    "https://wiki.tapnex.tech/tools.html"
)

echo "🔍 Checking URL accessibility and SEO health..."
echo "==============================================="

for url in "${URLS[@]}"; do
    echo "📄 Checking: $url"
    
    # Check HTTP status
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" -eq 200 ]; then
        echo "   ✅ Status: $status_code (OK)"
        
        # Check if robots meta tag allows indexing
        robots_meta=$(curl -s "$url" | grep -i "robots" | head -1)
        if [[ $robots_meta == *"noindex"* ]]; then
            echo "   ⚠️  Warning: Page has noindex directive"
        else
            echo "   ✅ Indexing: Allowed"
        fi
        
        # Check for canonical URL
        canonical=$(curl -s "$url" | grep -i "canonical" | head -1)
        if [ -n "$canonical" ]; then
            echo "   ✅ Canonical: Found"
        else
            echo "   ⚠️  Warning: No canonical URL found"
        fi
        
    else
        echo "   ❌ Status: $status_code (Error)"
    fi
    
    echo "   ---"
done

echo ""
echo "🌐 Sitemap Check"
echo "================"
echo "📄 Checking sitemap accessibility..."
sitemap_status=$(curl -s -o /dev/null -w "%{http_code}" "https://wiki.tapnex.tech/sitemap.xml")
if [ "$sitemap_status" -eq 200 ]; then
    echo "✅ Sitemap accessible (Status: $sitemap_status)"
else
    echo "❌ Sitemap not accessible (Status: $sitemap_status)"
fi

echo ""
echo "🤖 Robots.txt Check"
echo "==================="
robots_status=$(curl -s -o /dev/null -w "%{http_code}" "https://wiki.tapnex.tech/robots.txt")
if [ "$robots_status" -eq 200 ]; then
    echo "✅ Robots.txt accessible (Status: $robots_status)"
else
    echo "❌ Robots.txt not accessible (Status: $robots_status)"
fi

echo ""
echo "📋 Next Steps for Google Search Console:"
echo "========================================"
echo "1. Add your site to Google Search Console: https://search.google.com/search-console"
echo "2. Verify ownership using the meta tag method (add verification code to index.html)"
echo "3. Submit your sitemap: https://wiki.tapnex.tech/sitemap.xml"
echo "4. Use 'URL Inspection' tool to test individual URLs"
echo "5. Submit important URLs manually using 'Request Indexing'"
echo "6. Monitor the 'Coverage' report for indexing issues"
echo ""
echo "🔧 Manual URL Submission Commands (if needed):"
echo "You can use Google's URL Inspection tool to manually request indexing for:"
for url in "${URLS[@]}"; do
    echo "   - $url"
done