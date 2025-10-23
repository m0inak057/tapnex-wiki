// Load shared footer
function loadFooter() {
    fetch('/TOOLS/shared/footer.html')
        .then(response => response.text())
        .then(data => {
            // Find the footer placeholder or insert before closing body tag
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            } else {
                // If no placeholder, insert before the script tags at the end of body
                document.body.insertAdjacentHTML('beforeend', data);
            }
            
            // Highlight the active tool based on current page
            highlightActiveTool();
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Highlight the active tool in the footer
function highlightActiveTool() {
    const currentPath = window.location.pathname;
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const href = card.getAttribute('href');
        if (currentPath.includes(href.replace('../', '').replace('/index.html', ''))) {
            card.classList.add('active');
        }
    });
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
