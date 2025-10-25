#!/bin/bash

# TapNex Wiki - Complete SEO Health Checker
# This script analyzes HTML files for comprehensive SEO best practices

echo "🔍 TapNex Wiki - SEO Health Checker"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check a single HTML file
check_file() {
    local file="$1"
    local filename=$(basename "$file")
    local score=0
    local max_score=15
    local issues=()
    
    echo ""
    echo -e "${BLUE}📄 Analyzing: $filename${NC}"
    echo "=========================================="
    
    # Check 1: Title tag exists and length (CRITICAL)
    if grep -q "<title>" "$file"; then
        title=$(grep -o "<title>[^<]*</title>" "$file" | head -1 | sed 's/<title>//;s/<\/title>//')
        title_length=${#title}
        
        if [ $title_length -ge 50 ] && [ $title_length -le 60 ]; then
            echo -e "${GREEN}✓${NC} Title: $title_length chars (PERFECT)"
            ((score+=2))
        elif [ $title_length -ge 30 ] && [ $title_length -le 70 ]; then
            echo -e "${YELLOW}⚠${NC} Title: $title_length chars (OK, optimal: 50-60)"
            ((score+=1))
            issues+=("Optimize title length to 50-60 characters")
        else
            echo -e "${RED}✗${NC} Title: $title_length chars (TOO SHORT/LONG)"
            issues+=("Title should be 50-60 characters")
        fi
        echo "   Title: $title"
    else
        echo -e "${RED}✗${NC} CRITICAL: Missing title tag"
        issues+=("Add title tag with primary keyword")
    fi
    
    # Check 2: Meta description (CRITICAL)
    if grep -q 'name="description"' "$file"; then
        desc=$(grep -o 'name="description" content="[^"]*"' "$file" | head -1 | sed 's/name="description" content="//;s/"$//')
        desc_length=${#desc}
        
        if [ $desc_length -ge 150 ] && [ $desc_length -le 160 ]; then
            echo -e "${GREEN}✓${NC} Meta Desc: $desc_length chars (PERFECT)"
            ((score+=2))
        elif [ $desc_length -ge 120 ] && [ $desc_length -le 170 ]; then
            echo -e "${YELLOW}⚠${NC} Meta Desc: $desc_length chars (OK, optimal: 150-160)"
            ((score+=1))
            issues+=("Optimize meta description to 150-160 characters")
        else
            echo -e "${RED}✗${NC} Meta Desc: $desc_length chars (POOR)"
            issues+=("Meta description should be 150-160 characters")
        fi
    else
        echo -e "${RED}✗${NC} CRITICAL: Missing meta description"
        issues+=("Add compelling meta description with CTA")
    fi
    
    # Check 3: Meta keywords
    if grep -q 'name="keywords"' "$file"; then
        echo -e "${GREEN}✓${NC} Meta keywords present"
        ((score++))
    else
        echo -e "${YELLOW}⚠${NC} Meta keywords missing (helpful for internal search)"
        issues+=("Add meta keywords tag")
    fi
    
    # Check 4: H1 tag (CRITICAL - should have exactly one)
    h1_count=$(grep -o "<h1[^>]*>" "$file" | wc -l)
    if [ $h1_count -eq 1 ]; then
        h1_text=$(grep -o "<h1[^>]*>[^<]*</h1>" "$file" | head -1 | sed 's/<[^>]*>//g')
        echo -e "${GREEN}✓${NC} H1: Found (exactly 1)"
        echo "   H1: $h1_text"
        ((score+=2))
    elif [ $h1_count -eq 0 ]; then
        echo -e "${RED}✗${NC} CRITICAL: No H1 tag"
        issues+=("Add ONE H1 tag with primary keyword")
    else
        echo -e "${RED}✗${NC} CRITICAL: Multiple H1 tags ($h1_count)"
        issues+=("Keep only ONE H1 tag per page")
    fi
    
    # Check 5: H2 tags (important for structure)
    h2_count=$(grep -o "<h2[^>]*>" "$file" | wc -l)
    if [ $h2_count -ge 3 ]; then
        echo -e "${GREEN}✓${NC} H2 tags: $h2_count (good structure)"
        ((score++))
    elif [ $h2_count -ge 1 ]; then
        echo -e "${YELLOW}⚠${NC} H2 tags: $h2_count (add more sections)"
        issues+=("Add more H2 headings for better content structure")
    else
        echo -e "${RED}✗${NC} No H2 tags"
        issues+=("Add H2 headings to structure your content")
    fi
    
    # Check 6: Canonical URL (important)
    if grep -q 'rel="canonical"' "$file"; then
        canonical=$(grep -o 'rel="canonical" href="[^"]*"' "$file" | head -1 | sed 's/rel="canonical" href="//;s/"$//')
        echo -e "${GREEN}✓${NC} Canonical URL: $canonical"
        ((score++))
    else
        echo -e "${YELLOW}⚠${NC} Missing canonical URL"
        issues+=("Add canonical URL to avoid duplicate content issues")
    fi
    
    # Check 7: Open Graph tags (social sharing)
    og_count=$(grep -c 'property="og:' "$file")
    if [ $og_count -ge 4 ]; then
        echo -e "${GREEN}✓${NC} Open Graph: $og_count tags (excellent)"
        ((score++))
    elif [ $og_count -ge 1 ]; then
        echo -e "${YELLOW}⚠${NC} Open Graph: $og_count tags (add more)"
        issues+=("Add more Open Graph tags (og:title, og:description, og:image, og:url)")
    else
        echo -e "${RED}✗${NC} No Open Graph tags"
        issues+=("Add Open Graph tags for social media sharing")
    fi
    
    # Check 8: Images with alt text
    img_count=$(grep -o "<img[^>]*>" "$file" | wc -l)
    img_with_alt=$(grep -o "<img[^>]*alt=" "$file" | wc -l)
    
    if [ $img_count -eq 0 ]; then
        echo -e "${YELLOW}⚠${NC} No images found"
    elif [ $img_count -eq $img_with_alt ]; then
        echo -e "${GREEN}✓${NC} Images: All $img_count have alt text"
        ((score++))
    else
        missing=$((img_count - img_with_alt))
        echo -e "${RED}✗${NC} Images: $missing/$img_count missing alt text"
        issues+=("Add alt text to all $missing images with keywords")
    fi
    
    # Check 9: Internal links
    internal_links=$(grep -o 'href="[^"]*"' "$file" | grep -v "http" | grep -v "mailto" | grep -v "#" | wc -l)
    if [ $internal_links -ge 5 ]; then
        echo -e "${GREEN}✓${NC} Internal links: $internal_links (excellent)"
        ((score++))
    elif [ $internal_links -ge 3 ]; then
        echo -e "${YELLOW}⚠${NC} Internal links: $internal_links (add more)"
        issues+=("Add more internal links to related pages (aim for 5+)")
    else
        echo -e "${RED}✗${NC} Internal links: $internal_links (too few)"
        issues+=("Add at least 5 internal links to related pages")
    fi
    
    # Check 10: Schema.org structured data
    if grep -q '@type' "$file" && grep -q 'application/ld+json' "$file"; then
        schema_count=$(grep -c '@type' "$file")
        echo -e "${GREEN}✓${NC} Structured data: $schema_count schemas"
        ((score++))
    else
        echo -e "${YELLOW}⚠${NC} Missing structured data"
        issues+=("Add Schema.org JSON-LD for better search results")
    fi
    
    # Check 11: Robots meta tag
    if grep -q 'name="robots"' "$file"; then
        robots=$(grep -o 'name="robots" content="[^"]*"' "$file" | head -1)
        if [[ $robots == *"noindex"* ]]; then
            echo -e "${RED}✗${NC} Robots: NOINDEX detected (page won't be indexed)"
            issues+=("Remove noindex if you want Google to index this page")
        else
            echo -e "${GREEN}✓${NC} Robots: Indexing allowed"
            ((score++))
        fi
    else
        echo -e "${GREEN}✓${NC} Robots: Default (indexing allowed)"
        ((score++))
    fi
    
    # Check 12: Word count (content length)
    word_count=$(grep -o "<body[^>]*>.*</body>" "$file" | sed 's/<[^>]*>//g' | wc -w)
    if [ $word_count -ge 1500 ]; then
        echo -e "${GREEN}✓${NC} Word count: $word_count (comprehensive)"
        ((score++))
    elif [ $word_count -ge 500 ]; then
        echo -e "${YELLOW}⚠${NC} Word count: $word_count (could be longer)"
        issues+=("Add more content (aim for 1500+ words for better ranking)")
    else
        echo -e "${RED}✗${NC} Word count: $word_count (too short)"
        issues+=("Content is too short. Add comprehensive content (1500+ words)")
    fi
    
    # Calculate percentage
    percentage=$((score * 100 / max_score))
    
    # Display results
    echo ""
    echo "=========================================="
    echo -e "Score: ${BLUE}$score/$max_score${NC} (${BLUE}$percentage%${NC})"
    
    if [ $percentage -ge 85 ]; then
        echo -e "Status: ${GREEN}EXCELLENT! 🎉${NC}"
    elif [ $percentage -ge 70 ]; then
        echo -e "Status: ${GREEN}GOOD ✓${NC}"
    elif [ $percentage -ge 50 ]; then
        echo -e "Status: ${YELLOW}NEEDS IMPROVEMENT ⚠${NC}"
    else
        echo -e "Status: ${RED}POOR - URGENT ACTION NEEDED ✗${NC}"
    fi
    
    # Display issues if any
    if [ ${#issues[@]} -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}📋 Action Items:${NC}"
        for i in "${!issues[@]}"; do
            echo "   $((i+1)). ${issues[$i]}"
        done
    fi
    
    return $score
}

# Main execution
total_score=0
total_files=0
excellent_count=0
good_count=0
poor_count=0

# Check if input is provided
if [ $# -eq 0 ]; then
    echo "Usage: bash seo-checker.sh [file.html or directory]"
    echo ""
    echo "Examples:"
    echo "  bash seo-checker.sh index.html"
    echo "  bash seo-checker.sh TECHNOLOGY/"
    echo "  bash seo-checker.sh ."
    exit 1
fi

# Process input
if [ -f "$1" ]; then
    # Single file
    check_file "$1"
    exit 0
elif [ -d "$1" ]; then
    # Directory - find all HTML files
    echo "Scanning directory: $1"
    echo ""
    
    # Find all HTML files
    while IFS= read -r -d '' file; do
        check_file "$file"
        file_score=$?
        total_score=$((total_score + file_score))
        ((total_files++))
        
        # Calculate percentage for this file
        file_percentage=$((file_score * 100 / 15))
        
        if [ $file_percentage -ge 85 ]; then
            ((excellent_count++))
        elif [ $file_percentage -ge 50 ]; then
            ((good_count++))
        else
            ((poor_count++))
        fi
        
    done < <(find "$1" -name "*.html" -type f -print0)
    
    # Overall summary
    if [ $total_files -gt 0 ]; then
        echo ""
        echo "========================================="
        echo -e "${BLUE}📊 OVERALL SUMMARY${NC}"
        echo "========================================="
        echo "Total files analyzed: $total_files"
        echo ""
        echo "Performance breakdown:"
        echo -e "  ${GREEN}Excellent (85%+):${NC} $excellent_count files"
        echo -e "  ${YELLOW}Good (50-84%):${NC} $good_count files"
        echo -e "  ${RED}Poor (<50%):${NC} $poor_count files"
        echo ""
        
        avg_score=$((total_score / total_files))
        avg_percentage=$((avg_score * 100 / 15))
        echo "Average score: $avg_score/15 ($avg_percentage%)"
        
        if [ $avg_percentage -ge 85 ]; then
            echo -e "Overall Status: ${GREEN}EXCELLENT! 🎉${NC}"
        elif [ $avg_percentage -ge 70 ]; then
            echo -e "Overall Status: ${GREEN}GOOD ✓${NC}"
        elif [ $avg_percentage -ge 50 ]; then
            echo -e "Overall Status: ${YELLOW}NEEDS IMPROVEMENT ⚠${NC}"
        else
            echo -e "Overall Status: ${RED}POOR - URGENT ACTION NEEDED${NC}"
        fi
        
        echo ""
        echo "💡 Next steps:"
        echo "   1. Read SEO-OPTIMIZATION-GUIDE.md for detailed strategies"
        echo "   2. Fix issues in poor-performing pages first"
        echo "   3. Update meta descriptions and titles"
        echo "   4. Add internal links and alt text to images"
        echo "   5. Rerun this checker to track improvements"
    else
        echo "No HTML files found in $1"
    fi
else
    echo "Error: $1 is not a valid file or directory"
    exit 1
fi

echo ""
echo "📚 For detailed SEO guidance, see: SEO-OPTIMIZATION-GUIDE.md"
