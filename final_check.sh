#!/bin/bash
echo "=== META DESCRIPTION OPTIMIZATION REPORT ==="
echo ""
total=0
optimized=0
echo "Files needing adjustment (outside 150-160 range):"
find EVENT-MANAGEMENT MARKETING TECHNOLOGY -name "index.html" -type f | while read file; do
    desc=$(grep -oP 'name="description" content="\K[^"]+' "$file" 2>/dev/null)
    if [ -n "$desc" ]; then
        len=${#desc}
        total=$((total + 1))
        if [ $len -ge 150 ] && [ $len -le 160 ]; then
            optimized=$((optimized + 1))
        else
            echo "[$len chars] $file"
        fi
    fi
done
echo ""
echo "Summary: Check complete for all HTML files"
