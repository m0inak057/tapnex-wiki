// SEO Enhancement Script for Google Search Console
// This script helps with various SEO improvements

document.addEventListener('DOMContentLoaded', function() {
    // 1. Add structured data for breadcrumbs if not present
    addBreadcrumbStructuredData();
    
    // 2. Ensure all images have alt text
    improveImageAccessibility();
    
    // 3. Add last modified date to pages
    addLastModifiedDate();
    
    // 4. Track page views for analytics
    trackPageView();
});

function addBreadcrumbStructuredData() {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part !== '');
    
    if (pathParts.length > 0) {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        };
        
        let url = "https://wiki.tapnex.tech";
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": url
        });
        
        pathParts.forEach((part, index) => {
            url += '/' + part;
            breadcrumbData.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                "item": url
            });
        });
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    }
}

function improveImageAccessibility() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
            // Generate alt text based on src or context
            const src = img.src;
            const filename = src.split('/').pop().split('.')[0];
            img.alt = filename.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        // Add loading="lazy" for better performance
        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
}

function addLastModifiedDate() {
    const lastModified = document.lastModified;
    if (lastModified) {
        const dateElement = document.createElement('meta');
        dateElement.name = 'last-modified';
        dateElement.content = lastModified;
        document.head.appendChild(dateElement);
    }
}

function trackPageView() {
    // Basic page view tracking
    const url = window.location.href;
    const title = document.title;
    
    // You can replace this with your analytics tracking
    console.log('Page view:', { url, title, timestamp: new Date().toISOString() });
    
    // If you have Google Analytics, add:
    // gtag('config', 'YOUR_GA_ID', {
    //     page_title: title,
    //     page_location: url
    // });
}

// Export for use in other scripts
window.SEOUtils = {
    addBreadcrumbStructuredData,
    improveImageAccessibility,
    addLastModifiedDate,
    trackPageView
};