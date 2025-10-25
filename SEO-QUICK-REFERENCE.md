# 🎯 SEO Quick Reference Card - TapNex Wiki

## Essential SEO Checklist (Copy & Paste This!)

### Every Page MUST Have:

```html
<!-- 1. TITLE TAG (50-60 characters, keyword at start) -->
<title>Primary Keyword - Secondary Keyword | TapNex Wiki</title>

<!-- 2. META DESCRIPTION (150-160 characters, include CTA) -->
<meta name="description" content="Your compelling description with primary keyword. Learn how to [benefit]. Start today!">

<!-- 3. META KEYWORDS (10-15 relevant keywords) -->
<meta name="keywords" content="primary keyword, secondary keyword, related term, specific phrase">

<!-- 4. ROBOTS (allow indexing) -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">

<!-- 5. CANONICAL URL (avoid duplicate content) -->
<link rel="canonical" href="https://wiki.tapnex.tech/your-page">

<!-- 6. OPEN GRAPH (social sharing) -->
<meta property="og:title" content="Your Page Title">
<meta property="og:description" content="Your description">
<meta property="og:type" content="article">
<meta property="og:url" content="https://wiki.tapnex.tech/your-page">
<meta property="og:image" content="https://wiki.tapnex.tech/images/your-image.jpg">

<!-- 7. TWITTER CARD -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your Page Title">
<meta name="twitter:description" content="Your description">
<meta name="twitter:image" content="https://wiki.tapnex.tech/images/your-image.jpg">
```

### Content Structure:

```html
<!-- ONE H1 per page (include primary keyword) -->
<h1>Primary Keyword: Comprehensive Guide 2025</h1>

<!-- Multiple H2s (include secondary keywords) -->
<h2>What is [Topic]?</h2>
<h2>How to [Action]</h2>
<h2>Benefits of [Topic]</h2>
<h2>[Topic] Best Practices</h2>

<!-- H3s under H2s (related keywords) -->
<h3>Subtopic Details</h3>
<h3>Step-by-Step Process</h3>

<!-- Images with alt text (ALWAYS) -->
<img src="descriptive-name.jpg" alt="Keyword-rich description of image">

<!-- Internal links (3-5 per page) -->
<a href="/related-page">Descriptive Anchor Text</a>
```

---

## 📊 Keyword Optimization Formula

### Keyword Density:
- **Primary keyword:** 1-2% of total words
- **Secondary keywords:** 0.5-1% each
- **LSI keywords:** Sprinkle naturally throughout

### Calculation:
```
Keyword Density = (Keyword Count / Total Words) × 100

Example: 2000 words, keyword appears 20 times
(20 / 2000) × 100 = 1% ✅ PERFECT!
```

### Keyword Placement Priority:
1. ✅ Title tag (first 5 words)
2. ✅ H1 heading
3. ✅ First paragraph (first 100 words)
4. ✅ Meta description
5. ✅ H2/H3 subheadings
6. ✅ Image alt text
7. ✅ URL slug
8. ✅ Throughout content naturally

---

## 🎯 Target Keywords by Category

### Event Management:
**Primary:** event management, digital ticketing, volunteer management, event budgeting
**Long-tail:** how to manage volunteers for events, digital ticketing system for conferences, event budget planning template

### Technology:
**Primary:** NFC technology, web development, API integration, cloud computing
**Long-tail:** what is NFC and how does it work, web development best practices 2025, RESTful API tutorial

### Marketing:
**Primary:** social media marketing, content marketing, email campaigns, analytics
**Long-tail:** how to create social media strategy, content marketing roi calculator, email marketing automation tools

---

## ✏️ Content Writing Formula

### Introduction (First 100 words):
```
1. Answer the main question immediately
2. Include primary keyword in first sentence
3. Promise what reader will learn
4. Make it compelling
```

### Body (1500+ words):
```
1. Use short paragraphs (3-4 sentences)
2. Add subheadings every 200-300 words
3. Include bullet points and numbered lists
4. Add examples and case studies
5. Use tables for comparisons
6. Include statistics and data
7. Add internal links to related content
```

### Conclusion:
```
1. Summarize key points
2. Include call-to-action
3. Link to related resources
4. Encourage engagement
```

---

## 🔍 SEO Checker Command

Run this to check your pages:

```bash
# Check single file
bash scripts/seo-checker.sh index.html

# Check entire directory
bash scripts/seo-checker.sh TECHNOLOGY/

# Check all files
bash scripts/seo-checker.sh .
```

---

## 📈 Quick Wins (Do This Today!)

### 1. Update Title Tags
```html
<!-- ❌ Bad -->
<title>NFC Technology</title>

<!-- ✅ Good -->
<title>NFC Technology Guide: Complete Tutorial 2025 | TapNex Wiki</title>
```

### 2. Improve Meta Descriptions
```html
<!-- ❌ Bad -->
<meta name="description" content="Learn about NFC">

<!-- ✅ Good -->
<meta name="description" content="Master NFC technology with our complete 2025 guide. Learn applications, security, and implementation for events. Free expert tutorials!">
```

### 3. Add Alt Text to Images
```html
<!-- ❌ Bad -->
<img src="img123.jpg">

<!-- ✅ Good -->
<img src="nfc-technology-diagram.jpg" alt="NFC technology communication process diagram showing data transfer">
```

### 4. Create Internal Links
```html
<!-- In every article, link to 3-5 related pages -->
<p>Learn more about <a href="/technology/nfc">NFC technology</a> and 
how it integrates with <a href="/event-management/ticketing">digital ticketing systems</a>.</p>
```

### 5. Add H2/H3 Headers
```html
<h1>NFC Technology: Complete Guide 2025</h1>

<h2>What is NFC Technology?</h2>
<p>Content here...</p>

<h2>How NFC Works</h2>
<h3>Technical Specifications</h3>
<p>Content here...</p>

<h2>NFC Applications</h2>
<h3>Mobile Payments</h3>
<h3>Access Control</h3>
<h3>Data Transfer</h3>
```

---

## 🎨 SEO-Friendly URL Structure

### ✅ Good URLs:
```
https://wiki.tapnex.tech/technology/nfc-guide
https://wiki.tapnex.tech/marketing/social-media-strategy
https://wiki.tapnex.tech/events/volunteer-management
```

### ❌ Bad URLs:
```
https://wiki.tapnex.tech/page123.html
https://wiki.tapnex.tech/tech/nfc_guide_2025.html
https://wiki.tapnex.tech/folder/subfolder/page.php?id=123
```

### Rules:
- Short and descriptive
- Include primary keyword
- Use hyphens (not underscores)
- Lowercase only
- No special characters
- No dynamic parameters

---

## 📊 Monthly SEO Tasks

### Week 1: Content Creation
- [ ] Write 2-4 new articles (1500+ words each)
- [ ] Include primary keywords naturally
- [ ] Add 5+ internal links per article
- [ ] Optimize all images with alt text

### Week 2: Content Optimization
- [ ] Update 2-3 old articles
- [ ] Improve title tags and meta descriptions
- [ ] Add more H2/H3 headings
- [ ] Increase word count to 1500+

### Week 3: Technical SEO
- [ ] Run SEO checker on all pages
- [ ] Fix broken links
- [ ] Update sitemap.xml
- [ ] Check page speed (should load in <3 seconds)

### Week 4: Analysis & Planning
- [ ] Review Google Search Console
- [ ] Check keyword rankings
- [ ] Analyze top-performing pages
- [ ] Plan next month's content

---

## 🎯 Success Metrics

### Track These Weekly:
| Metric | Target |
|--------|--------|
| Organic Traffic | +10% month-over-month |
| Avg. Position | Top 20 → Top 10 → Top 3 |
| Click-Through Rate | 5-10% |
| Bounce Rate | <60% |
| Time on Page | >2 minutes |

### Tools to Use (Free):
1. **Google Search Console** - Rankings, clicks, impressions
2. **Google Analytics** - Traffic, behavior, conversions
3. **PageSpeed Insights** - Loading speed
4. **Mobile-Friendly Test** - Mobile optimization

---

## 💡 Pro Tips

1. **Update Year in Content**
   - "Social Media Strategy 2025" ranks better than generic titles
   - Update annually to maintain freshness

2. **Answer Questions**
   - Use "What is...", "How to...", "Why does..."
   - Target featured snippets

3. **Add Statistics**
   - "73% of marketers say..." (with source)
   - Numbers attract clicks

4. **Create Comparison Tables**
   - "NFC vs RFID"
   - "Platform A vs Platform B"
   - Tables often appear in featured snippets

5. **Use Power Words**
   - Ultimate, Complete, Essential, Expert, Proven, Best
   - "Ultimate Guide", "Complete Tutorial", "Expert Tips"

---

## 🚀 Emergency SEO Checklist

### Page Not Ranking? Check:
- [ ] Title has primary keyword at start
- [ ] Meta description is compelling with CTA
- [ ] H1 contains primary keyword
- [ ] Content is 1500+ words
- [ ] Keyword density is 1-2%
- [ ] 5+ internal links present
- [ ] All images have alt text
- [ ] Page loads in <3 seconds
- [ ] Mobile-friendly
- [ ] No duplicate content
- [ ] Canonical URL set
- [ ] Sitemap updated
- [ ] No "noindex" meta tag

---

## 📚 Resources

- **Full Guide:** SEO-OPTIMIZATION-GUIDE.md
- **SEO Checker:** scripts/seo-checker.sh
- **Sitemaps:** sitemap.xml, sitemap-*.xml

---

## 🎓 Remember:

> **Write for humans, optimize for search engines!**

Good content + Proper optimization + Time = Top Rankings 🏆
