#!/bin/bash
echo "=========================================="
echo "   H1 TAG AUDIT REPORT"
echo "=========================================="
echo ""
echo "Checking for multiple H1 tags per page..."
echo ""

total_files=0
files_with_multiple_h1=0

find EVENT-MANAGEMENT MARKETING TECHNOLOGY -name "index.html" -type f | sort | while read file; do
    h1_count=$(grep -i "<h1" "$file" | wc -l)
    total_files=$((total_files + 1))
    
    if [ $h1_count -gt 1 ]; then
        echo "⚠️  [$h1_count H1 tags] $file"
        grep -n -i "<h1" "$file" | head -5
        echo ""
        files_with_multiple_h1=$((files_with_multiple_h1 + 1))
    elif [ $h1_count -eq 1 ]; then
        echo "✓ [1 H1 tag] $(basename $(dirname $file))"
    else
        echo "❌ [0 H1 tags] $file"
    fi
done

echo ""
echo "=========================================="
echo "Checking homepage..."
h1_home=$(grep -i "<h1" "index.html" 2>/dev/null | wc -l)
if [ $h1_home -gt 1 ]; then
    echo "⚠️  Homepage has $h1_home H1 tags"
    grep -n -i "<h1" "index.html"
elif [ $h1_home -eq 1 ]; then
    echo "✓ Homepage has 1 H1 tag"
else
    echo "❌ Homepage has 0 H1 tags"
fi
echo "=========================================="
