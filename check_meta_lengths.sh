#!/bin/bash
find EVENT-MANAGEMENT MARKETING TECHNOLOGY -name "index.html" -type f | while read file; do
    desc=$(grep -oP 'name="description" content="\K[^"]+' "$file" 2>/dev/null)
    if [ -n "$desc" ]; then
        len=${#desc}
        if [ $len -lt 150 ] || [ $len -gt 160 ]; then
            echo "[$len] $file"
        fi
    fi
done
