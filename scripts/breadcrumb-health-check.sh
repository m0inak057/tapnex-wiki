#!/bin/bash
# Quick health check for breadcrumb implementation

echo "======================================================================"
echo "🔍 BREADCRUMB IMPLEMENTATION HEALTH CHECK"
echo "======================================================================"
echo ""

# Count total HTML files in target folders
echo "📊 Scanning folders..."
echo ""

event_count=$(find ./EVENT-MANAGEMENT -name "index.html" -type f 2>/dev/null | wc -l)
marketing_count=$(find ./MARKETING -name "index.html" -type f 2>/dev/null | wc -l)
tech_count=$(find ./TECHNOLOGY -name "index.html" -type f 2>/dev/null | wc -l)
total_count=$((event_count + marketing_count + tech_count))

echo "EVENT-MANAGEMENT: $event_count files"
echo "MARKETING:        $marketing_count files"
echo "TECHNOLOGY:       $tech_count files"
echo "TOTAL:            $total_count files"
echo ""

# Count files with breadcrumb schema
echo "======================================================================"
echo "🔎 Checking for BreadcrumbList schema..."
echo "======================================================================"
echo ""

breadcrumb_count=$(grep -r "BreadcrumbList" ./EVENT-MANAGEMENT ./MARKETING ./TECHNOLOGY 2>/dev/null | grep -c "index.html")

echo "Files with breadcrumb schema: $breadcrumb_count"
echo ""

if [ "$breadcrumb_count" -eq "$total_count" ]; then
    echo "✅ SUCCESS: All $total_count files have breadcrumb schema!"
    coverage=100
else
    echo "⚠️  WARNING: Only $breadcrumb_count out of $total_count files have breadcrumb schema"
    coverage=$((breadcrumb_count * 100 / total_count))
fi

echo "Coverage: ${coverage}%"
echo ""

# Show sample breadcrumb paths
echo "======================================================================"
echo "📋 SAMPLE BREADCRUMB PATHS"
echo "======================================================================"
echo ""

# Extract a few sample breadcrumb names
echo "Checking sample files for breadcrumb structure..."
echo ""

sample_files=(
    "./TECHNOLOGY/NFC/index.html"
    "./MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing/index.html"
    "./EVENT-MANAGEMENT/Event-budgeting/index.html"
)

for file in "${sample_files[@]}"; do
    if [ -f "$file" ]; then
        category=$(echo "$file" | cut -d'/' -f2)
        subfolder=$(echo "$file" | cut -d'/' -f3)
        
        # Check if file has breadcrumb
        if grep -q "BreadcrumbList" "$file" 2>/dev/null; then
            echo "✅ $category/$subfolder"
            # Extract the breadcrumb names (simplified)
            grep -A 30 "BreadcrumbList" "$file" | grep '"name":' | head -3 | sed 's/.*"name": "\(.*\)",*/   → \1/'
        else
            echo "❌ $category/$subfolder - No breadcrumb found"
        fi
        echo ""
    fi
done

echo "======================================================================"
echo "📝 VALIDATION COMMANDS"
echo "======================================================================"
echo ""
echo "Run full validation:"
echo "  python scripts/verify-breadcrumb-schema.py"
echo ""
echo "Generate test URLs:"
echo "  python scripts/generate-test-urls.py"
echo ""
echo "======================================================================"

exit 0
