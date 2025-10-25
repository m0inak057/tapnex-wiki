#!/bin/bash

# Script to optimize image alt text across all pages for better SEO
# This adds descriptive, keyword-rich alt text to logo images

echo "🖼️  Optimizing Image Alt Text for SEO..."
echo "========================================"

# Counter for updates
updated_count=0

# Function to update alt text in a file
update_alt_text() {
    local file="$1"
    local topic="$2"
    local alt_text_sidebar="$3"
    local alt_text_footer="$4"
    
    # Update sidebar logo
    if grep -q 'alt="Tapnex Logo" class="sidebar-logo-image"' "$file" 2>/dev/null; then
        sed -i 's|alt="Tapnex Logo" class="sidebar-logo-image"|alt="'"$alt_text_sidebar"'" class="sidebar-logo-image"|g' "$file"
        echo "  ✓ Updated sidebar logo: $file"
        ((updated_count++))
    fi
    
    # Update footer logo (multiple variations)
    if grep -q 'alt="Tapnex Logo" class="logo-image"' "$file" 2>/dev/null; then
        sed -i 's|alt="Tapnex Logo" class="logo-image"|alt="'"$alt_text_footer"'" class="logo-image"|g' "$file"
        echo "  ✓ Updated footer logo: $file"
        ((updated_count++))
    fi
    
    if grep -q 'alt="Tapnex Wiki Logo" class="logo-image"' "$file" 2>/dev/null; then
        sed -i 's|alt="Tapnex Wiki Logo" class="logo-image"|alt="'"$alt_text_footer"'" class="logo-image"|g' "$file"
        echo "  ✓ Updated footer logo: $file"
        ((updated_count++))
    fi
}

# Technology Pages
echo ""
echo "📱 Technology Section:"
update_alt_text "TECHNOLOGY/NFC/index.html" "NFC" \
    "TapNex Wiki - NFC Technology & Near Field Communication Guide" \
    "TapNex Wiki - NFC Event Ticketing & Contactless Payment Solutions"

update_alt_text "TECHNOLOGY/5G-Technology/index.html" "5G" \
    "TapNex Wiki - 5G Technology & Network Innovation Guide" \
    "TapNex Wiki - 5G Wireless Communication & IoT Connectivity"

update_alt_text "TECHNOLOGY/Agentic-AI/index.html" "Agentic AI" \
    "TapNex Wiki - Agentic AI & Autonomous Agents Guide" \
    "TapNex Wiki - AI Agent Systems & Machine Learning Automation"

update_alt_text "TECHNOLOGY/APIs/index.html" "APIs" \
    "TapNex Wiki - API Integration & RESTful Services Guide" \
    "TapNex Wiki - API Development, REST & GraphQL Solutions"

update_alt_text "TECHNOLOGY/Database-Management/index.html" "Database" \
    "TapNex Wiki - Database Management & SQL/NoSQL Guide" \
    "TapNex Wiki - Database Systems, PostgreSQL & MongoDB Solutions"

update_alt_text "TECHNOLOGY/Devops/index.html" "DevOps" \
    "TapNex Wiki - DevOps & CI/CD Automation Guide" \
    "TapNex Wiki - DevOps Tools, Jenkins, Docker & Kubernetes"

update_alt_text "TECHNOLOGY/Edge-Computing/index.html" "Edge Computing" \
    "TapNex Wiki - Edge Computing & IoT Processing Guide" \
    "TapNex Wiki - Edge Computing Architecture & 5G Integration"

update_alt_text "TECHNOLOGY/Generative-AI/index.html" "Generative AI" \
    "TapNex Wiki - Generative AI & Large Language Models Guide" \
    "TapNex Wiki - ChatGPT, LLMs & AI Content Generation"

update_alt_text "TECHNOLOGY/VR-Virtual-Reality/index.html" "VR" \
    "TapNex Wiki - VR Virtual Reality & Metaverse Guide" \
    "TapNex Wiki - VR Technology, Immersive Experiences & Gaming"

update_alt_text "TECHNOLOGY/Web-Development/index.html" "Web Dev" \
    "TapNex Wiki - Web Development & Full Stack Guide" \
    "TapNex Wiki - HTML, CSS, JavaScript & React Development"

update_alt_text "TECHNOLOGY/Quantun-Computing/index.html" "Quantum" \
    "TapNex Wiki - Quantum Computing & Qubits Guide" \
    "TapNex Wiki - Quantum Algorithms & Next-Gen Computing"

update_alt_text "TECHNOLOGY/Biotech-&-Engineered-Living-Therapeutics/index.html" "Biotech" \
    "TapNex Wiki - Biotech & Gene Editing Guide" \
    "TapNex Wiki - Biotechnology, CRISPR & Living Therapeutics"

update_alt_text "TECHNOLOGY/Collaborative-Sensing-&-Autonomous-Biochemical-Sensors/index.html" "Biochemical Sensors" \
    "TapNex Wiki - Biochemical Sensors & IoT Guide" \
    "TapNex Wiki - Autonomous Sensors, IoBT & Health Monitoring"

update_alt_text "TECHNOLOGY/Green-Nitrogen-Fixation-&-Advanced-Clean-Energy/index.html" "Green Energy" \
    "TapNex Wiki - Green Energy & Sustainable Agriculture Guide" \
    "TapNex Wiki - Clean Energy, Nitrogen Fixation & Sustainability"

update_alt_text "TECHNOLOGY/Synthetic-Media-&-Generative-Watermarking/index.html" "Synthetic Media" \
    "TapNex Wiki - Synthetic Media & AI Deepfakes Guide" \
    "TapNex Wiki - Deepfakes, AI-Generated Content & Watermarking"

# Marketing Pages
echo ""
echo "📊 Marketing Section:"
update_alt_text "MARKETING/social-media-strategy/index.html" "Social Media" \
    "TapNex Wiki - Social Media Strategy & Digital Marketing Guide" \
    "TapNex Wiki - Social Media Marketing, Instagram & TikTok Strategies"

update_alt_text "MARKETING/content-marketing/index.html" "Content Marketing" \
    "TapNex Wiki - Content Marketing & SEO Strategy Guide" \
    "TapNex Wiki - Content Creation, SEO & Digital Marketing"

update_alt_text "MARKETING/analytics-&-insigths/index.html" "Analytics" \
    "TapNex Wiki - Marketing Analytics & KPI Tracking Guide" \
    "TapNex Wiki - Data Analytics, Google Analytics & Business Intelligence"

update_alt_text "MARKETING/email-campaigns/index.html" "Email" \
    "TapNex Wiki - Email Marketing & Automation Guide" \
    "TapNex Wiki - Email Campaigns, Automation & Newsletter Marketing"

update_alt_text "MARKETING/short-form-video-content/index.html" "Video" \
    "TapNex Wiki - Short-Form Video Content & TikTok Guide" \
    "TapNex Wiki - TikTok, Instagram Reels & YouTube Shorts Marketing"

update_alt_text "MARKETING/Personalization-&-Data-Driven-Content/index.html" "Personalization" \
    "TapNex Wiki - Personalization & Data-Driven Marketing Guide" \
    "TapNex Wiki - Personalized Marketing, AI & Customer Segmentation"

update_alt_text "MARKETING/compliance-&-ethical-content-marketing/index.html" "Compliance" \
    "TapNex Wiki - Marketing Compliance & GDPR Guide" \
    "TapNex Wiki - Ethical Marketing, GDPR & Privacy Compliance"

update_alt_text "MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing/index.html" "AI Marketing" \
    "TapNex Wiki - AI Content Creation & ChatGPT Marketing Guide" \
    "TapNex Wiki - AI-Powered Marketing, ChatGPT & Content Automation"

update_alt_text "MARKETING/Humanizing-content-&-authentic-storytelling/index.html" "Storytelling" \
    "TapNex Wiki - Brand Storytelling & Authentic Content Guide" \
    "TapNex Wiki - Storytelling, Brand Authenticity & Customer Connection"

update_alt_text "MARKETING/newsletter-&-community-driven-growth/index.html" "Newsletter" \
    "TapNex Wiki - Newsletter Marketing & Community Growth Guide" \
    "TapNex Wiki - Email Newsletter, Community Building & Engagement"

update_alt_text "MARKETING/UGC/index.html" "UGC" \
    "TapNex Wiki - User-Generated Content & UGC Marketing Guide" \
    "TapNex Wiki - UGC Campaigns, Customer Content & Social Proof"

update_alt_text "MARKETING/content-format-innovations/index.html" "Content Formats" \
    "TapNex Wiki - Content Format Innovations & Interactive Media Guide" \
    "TapNex Wiki - Interactive Content, AR/VR & Multimedia Marketing"

update_alt_text "MARKETING/augmented-reality-&-virtual-reality-for-content-marketing/index.html" "AR/VR Marketing" \
    "TapNex Wiki - AR/VR Marketing & Immersive Content Guide" \
    "TapNex Wiki - Augmented Reality, Virtual Reality & 3D Marketing"

update_alt_text "MARKETING/Co-Marketing-&-brand-partnership/index.html" "Partnerships" \
    "TapNex Wiki - Co-Marketing & Brand Partnerships Guide" \
    "TapNex Wiki - Strategic Partnerships, Collaboration & Joint Ventures"

update_alt_text "MARKETING/content-marketing-measurement-&-ROI-analytics/index.html" "ROI" \
    "TapNex Wiki - Content ROI & Marketing Analytics Guide" \
    "TapNex Wiki - Marketing ROI, Attribution & Performance Measurement"

# Event Management Pages
echo ""
echo "🎪 Event Management Section:"
update_alt_text "EVENT-MANAGEMENT/Event-budgeting/index.html" "Budgeting" \
    "TapNex Wiki - Event Budgeting & Financial Planning Guide" \
    "TapNex Wiki - Event Finance, Budget Management & ROI Tracking"

update_alt_text "EVENT-MANAGEMENT/Logistic-Planning/index.html" "Logistics" \
    "TapNex Wiki - Event Logistics & Operations Planning Guide" \
    "TapNex Wiki - Event Logistics, Supply Chain & Risk Management"

update_alt_text "EVENT-MANAGEMENT/volunteer-systems/index.html" "Volunteers" \
    "TapNex Wiki - Volunteer Management Systems & VMS Guide" \
    "TapNex Wiki - Volunteer Coordination, VMS Software & Team Management"

update_alt_text "EVENT-MANAGEMENT/ticketing-platform/index.html" "Ticketing" \
    "TapNex Wiki - Digital Ticketing & Event Technology Guide" \
    "TapNex Wiki - QR Code Tickets, NFC, RFID & Online Ticketing Systems"

echo ""
echo "========================================"
echo "✅ Image Alt Text Optimization Complete!"
echo "📊 Total updates: $updated_count"
echo ""
echo "Alt text optimizations improve:"
echo "  • Image search ranking"
echo "  • Accessibility for screen readers"
echo "  • Context for search engines"
echo "  • Keyword relevance signals"
