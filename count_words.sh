#!/bin/bash
echo "=========================================="
echo "   CONTENT DEPTH ANALYSIS"
echo "=========================================="
echo ""
echo "Analyzing word count for all article pages..."
echo ""

echo "FILES UNDER 1500 WORDS (Need Enhancement):"
echo ""

find EVENT-MANAGEMENT MARKETING TECHNOLOGY -name "index.html" -type f | sort | while read file; do
    # Extract content between <article> tags and count words
    word_count=$(sed -n '/<article>/,/<\/article>/p' "$file" | \
                 sed 's/<[^>]*>//g' | \
                 sed 's/&[^;]*;//g' | \
                 tr -s '[:space:]' '\n' | \
                 grep -v '^$' | \
                 wc -l)
    
    page_name=$(basename $(dirname "$file"))
    
    if [ $word_count -lt 1500 ]; then
        printf "  ⚠️  [%4d words] %s\n" $word_count "$page_name"
    else
        printf "  ✓  [%4d words] %s\n" $word_count "$page_name"
    fi
done | sort -k2 -n

echo ""
echo "=========================================="
