#!/bin/bash

# Script to add internal links to pages for better SEO
# This creates a hub-spoke linking structure per SEO-OPTIMIZATION-GUIDE.md

echo "🔗 Adding Internal Links for SEO..."
echo "========================================"

# Technology Pages - Add internal links
echo ""
echo "📱 Adding links to Technology pages..."

# NFC page - Add links to related tech and event management
cat > /tmp/nfc_links.txt << 'EOF'
<p>Near Field Communication (NFC) is revolutionizing the event industry through contactless ticketing and payment solutions.</p>
EOF

# Add link after the first paragraph in NFC page explaining technology
sed -i '0,/<p>Near Field Communication (NFC) is revolutionizing/s|<p>Near Field Communication (NFC) is revolutionizing the event industry through contactless ticketing and payment solutions\.</p>|<p>Near Field Communication (NFC) is revolutionizing the event industry through contactless ticketing and payment solutions. Learn more about <a href="/EVENT-MANAGEMENT/ticketing-platform">digital ticketing platforms</a> and <a href="/TECHNOLOGY/5G-Technology">5G connectivity</a> that enhance NFC capabilities.</p>|' "TECHNOLOGY/NFC/index.html" 2>/dev/null && echo "  ✓ Added links to NFC page"

# 5G Technology - Link to Edge Computing and NFC
sed -i '0,/<p>5G technology represents/s|<p>5G technology represents the fifth generation|<p>5G technology represents the fifth generation of mobile networks, enabling faster speeds and lower latency. Explore how 5G enhances <a href="/TECHNOLOGY/Edge-Computing">edge computing</a> and <a href="/TECHNOLOGY/NFC">NFC technology</a> for event applications.|' "TECHNOLOGY/5G-Technology/index.html" 2>/dev/null && echo "  ✓ Added links to 5G Technology page"

# Agentic AI - Link to Generative AI
sed -i '0,/<p>Agentic AI/s|<p>Agentic AI represents autonomous|<p>Agentic AI represents autonomous intelligent systems that can make decisions. Learn about <a href="/TECHNOLOGY/Generative-AI">generative AI capabilities</a> and <a href="/MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing">AI-powered marketing</a> applications.|' "TECHNOLOGY/Agentic-AI/index.html" 2>/dev/null && echo "  ✓ Added links to Agentic AI page"

# APIs - Link to Web Development and Database
sed -i '0,/<p>Application Programming Interfaces/s|<p>Application Programming Interfaces (APIs)|<p>Application Programming Interfaces (APIs) enable software integration. Discover <a href="/TECHNOLOGY/Web-Development">web development</a> best practices and <a href="/TECHNOLOGY/Database-Management">database management</a> for API systems.|' "TECHNOLOGY/APIs/index.html" 2>/dev/null && echo "  ✓ Added links to APIs page"

# Database Management - Link to DevOps and APIs
sed -i '0,/<p>Database management/s|<p>Database management systems|<p>Database management systems are crucial for data storage. Learn about <a href="/TECHNOLOGY/Devops">DevOps practices</a> and <a href="/TECHNOLOGY/APIs">API integration</a> for databases.|' "TECHNOLOGY/Database-Management/index.html" 2>/dev/null && echo "  ✓ Added links to Database Management page"

# DevOps - Link to Web Development and Database
sed -i '0,/<p>DevOps combines/s|<p>DevOps combines development|<p>DevOps combines development and operations for faster delivery. Explore <a href="/TECHNOLOGY/Web-Development">web development</a> workflows and <a href="/TECHNOLOGY/Database-Management">database management</a> automation.|' "TECHNOLOGY/Devops/index.html" 2>/dev/null && echo "  ✓ Added links to DevOps page"

# Edge Computing - Link to 5G and IoT
sed -i '0,/<p>Edge computing/s|<p>Edge computing brings|<p>Edge computing brings data processing closer to devices. Discover how <a href="/TECHNOLOGY/5G-Technology">5G technology</a> and <a href="/TECHNOLOGY/NFC">NFC applications</a> leverage edge computing.|' "TECHNOLOGY/Edge-Computing/index.html" 2>/dev/null && echo "  ✓ Added links to Edge Computing page"

# Generative AI - Link to Agentic AI and Content Marketing
sed -i '0,/<p>Generative AI/s|<p>Generative AI uses|<p>Generative AI uses machine learning for content creation. Explore <a href="/TECHNOLOGY/Agentic-AI">agentic AI systems</a> and <a href="/MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing">AI content marketing</a> strategies.|' "TECHNOLOGY/Generative-AI/index.html" 2>/dev/null && echo "  ✓ Added links to Generative AI page"

# VR - Link to AR/VR Marketing
sed -i '0,/<p>Virtual Reality/s|<p>Virtual Reality (VR)|<p>Virtual Reality (VR) creates immersive digital experiences. Learn about <a href="/MARKETING/augmented-reality-&-virtual-reality-for-content-marketing">AR/VR marketing</a> and <a href="/TECHNOLOGY/Generative-AI">AI-generated VR content</a>.|' "TECHNOLOGY/VR-Virtual-Reality/index.html" 2>/dev/null && echo "  ✓ Added links to VR page"

# Web Development - Link to APIs and DevOps
sed -i '0,/<p>Web development/s|<p>Web development encompasses|<p>Web development encompasses frontend and backend technologies. Discover <a href="/TECHNOLOGY/APIs">API integration</a> and <a href="/TECHNOLOGY/Devops">DevOps deployment</a> practices.|' "TECHNOLOGY/Web-Development/index.html" 2>/dev/null && echo "  ✓ Added links to Web Development page"

# Marketing Pages - Add internal links
echo ""
echo "📊 Adding links to Marketing pages..."

# Social Media Strategy - Link to content marketing
sed -i '0,/<p>Social media strategy/s|<p>Social media strategy is essential|<p>Social media strategy is essential for digital marketing success. Explore <a href="/MARKETING/content-marketing">content marketing</a> and <a href="/MARKETING/short-form-video-content">short-form video</a> strategies.|' "MARKETING/social-media-strategy/index.html" 2>/dev/null && echo "  ✓ Added links to Social Media Strategy page"

# Content Marketing - Link to SEO and Analytics
sed -i '0,/<p>Content marketing/s|<p>Content marketing focuses|<p>Content marketing focuses on creating valuable content. Learn about <a href="/MARKETING/analytics-&-insigths">marketing analytics</a> and <a href="/MARKETING/content-marketing-measurement-&-ROI-analytics">ROI measurement</a>.|' "MARKETING/content-marketing/index.html" 2>/dev/null && echo "  ✓ Added links to Content Marketing page"

# Analytics - Link to Content ROI
sed -i '0,/<p>Marketing analytics/s|<p>Marketing analytics provides|<p>Marketing analytics provides data-driven insights. Explore <a href="/MARKETING/content-marketing-measurement-&-ROI-analytics">content ROI analytics</a> and <a href="/MARKETING/Personalization-&-Data-Driven-Content">data-driven personalization</a>.|' "MARKETING/analytics-&-insigths/index.html" 2>/dev/null && echo "  ✓ Added links to Analytics page"

# Email Campaigns - Link to Newsletter and Automation
sed -i '0,/<p>Email marketing/s|<p>Email marketing remains|<p>Email marketing remains a powerful channel. Discover <a href="/MARKETING/newsletter-&-community-driven-growth">newsletter strategies</a> and <a href="/MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing">AI automation</a>.|' "MARKETING/email-campaigns/index.html" 2>/dev/null && echo "  ✓ Added links to Email Campaigns page"

# Short-Form Video - Link to Social Media and UGC
sed -i '0,/<p>Short-form video/s|<p>Short-form video content|<p>Short-form video content dominates social media. Learn about <a href="/MARKETING/social-media-strategy">social media strategies</a> and <a href="/MARKETING/UGC">user-generated content</a>.|' "MARKETING/short-form-video-content/index.html" 2>/dev/null && echo "  ✓ Added links to Short-Form Video page"

# AI Content Creation - Link to Generative AI and Content Marketing
sed -i '0,/<p>AI-powered content/s|<p>AI-powered content creation|<p>AI-powered content creation transforms marketing. Explore <a href="/TECHNOLOGY/Generative-AI">generative AI technology</a> and <a href="/MARKETING/content-marketing">content marketing strategies</a>.|' "MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing/index.html" 2>/dev/null && echo "  ✓ Added links to AI Content Creation page"

# AR/VR Marketing - Link to VR Technology and Content Formats
sed -i '0,/<p>Augmented and virtual reality/s|<p>Augmented and virtual reality marketing|<p>Augmented and virtual reality marketing creates immersive experiences. Discover <a href="/TECHNOLOGY/VR-Virtual-Reality">VR technology</a> and <a href="/MARKETING/content-format-innovations">content format innovations</a>.|' "MARKETING/augmented-reality-&-virtual-reality-for-content-marketing/index.html" 2>/dev/null && echo "  ✓ Added links to AR/VR Marketing page"

# Event Management Pages - Add internal links
echo ""
echo "🎪 Adding links to Event Management pages..."

# Event Budgeting - Link to Logistics and Analytics
sed -i '0,/<p>Event budgeting/s|<p>Event budgeting is crucial|<p>Event budgeting is crucial for successful events. Learn about <a href="/EVENT-MANAGEMENT/Logistic-Planning">logistics planning</a> and <a href="/MARKETING/content-marketing-measurement-&-ROI-analytics">ROI analytics</a>.|' "EVENT-MANAGEMENT/Event-budgeting/index.html" 2>/dev/null && echo "  ✓ Added links to Event Budgeting page"

# Logistics Planning - Link to Budgeting and Volunteers
sed -i '0,/<p>Logistic planning/s|<p>Logistic planning ensures|<p>Logistic planning ensures smooth event operations. Explore <a href="/EVENT-MANAGEMENT/Event-budgeting">event budgeting</a> and <a href="/EVENT-MANAGEMENT/volunteer-systems">volunteer management</a>.|' "EVENT-MANAGEMENT/Logistic-Planning/index.html" 2>/dev/null && echo "  ✓ Added links to Logistics Planning page"

# Volunteer Systems - Link to Logistics and Event Management
sed -i '0,/<p>Volunteer management/s|<p>Volunteer management systems|<p>Volunteer management systems streamline coordination. Discover <a href="/EVENT-MANAGEMENT/Logistic-Planning">logistics planning</a> and <a href="/EVENT-MANAGEMENT/ticketing-platform">ticketing integration</a>.|' "EVENT-MANAGEMENT/volunteer-systems/index.html" 2>/dev/null && echo "  ✓ Added links to Volunteer Systems page"

# Digital Ticketing - Link to NFC and Event Budgeting
sed -i '0,/<p>Digital ticketing/s|<p>Digital ticketing systems|<p>Digital ticketing systems transform event access. Learn about <a href="/TECHNOLOGY/NFC">NFC technology</a> and <a href="/EVENT-MANAGEMENT/Event-budgeting">ticket revenue management</a>.|' "EVENT-MANAGEMENT/ticketing-platform/index.html" 2>/dev/null && echo "  ✓ Added links to Digital Ticketing page"

echo ""
echo "========================================"
echo "✅ Internal Linking Complete!"
echo ""
echo "Internal links improve:"
echo "  • Page authority distribution"
echo "  • User navigation experience"
echo "  • Search engine crawlability"
echo "  • Topic relevance signals"
echo "  • Time on site metrics"
