/**
 * Getting Started Page JavaScript
 * Adds interactive functionality and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeGettingStarted();
});

function initializeGettingStarted() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    // Initialize card animations
    initializeCardAnimations();
    
    // Initialize category filtering
    initializeCategoryFilter();
    
    // Initialize theme support
    initializeThemeSupport();
    
    // Initialize analytics tracking
    initializeAnalytics();
    
    // Initialize keyboard navigation
    initializeKeyboardNavigation();
}

/**
 * Initialize search functionality for topics
 */
function initializeSearch() {
    // Create search bar
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="topic-search" placeholder="Search topics..." autocomplete="off">
                <button type="button" class="search-btn" aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
                <div class="search-results" id="search-results"></div>
            </div>
        `;
        
        // Insert search container after hero content
        const heroContent = heroSection.querySelector('.hero-content');
        heroContent.appendChild(searchContainer);
        
        // Add search functionality
        const searchInput = document.getElementById('topic-search');
        const searchResults = document.getElementById('search-results');
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query, searchResults);
            }, 300);
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

/**
 * Perform search across all topics
 */
function performSearch(query, resultsContainer) {
    const allCards = document.querySelectorAll('.topic-card, .tool-card');
    const results = [];
    
    allCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';
        const category = card.getAttribute('data-category') || 'tool';
        
        if (title.includes(query) || description.includes(query)) {
            const link = card.querySelector('a')?.href || '#';
            results.push({
                title: card.querySelector('h3')?.textContent || '',
                description: card.querySelector('p')?.textContent || '',
                category: category,
                link: link
            });
        }
    });
    
    displaySearchResults(results, resultsContainer, query);
}

/**
 * Display search results
 */
function displaySearchResults(results, container, query) {
    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-result-item no-results">
                <p>No results found for "${query}"</p>
            </div>
        `;
    } else {
        container.innerHTML = results.slice(0, 8).map(result => `
            <a href="${result.link}" class="search-result-item">
                <div class="result-title">${highlightQuery(result.title, query)}</div>
                <div class="result-description">${highlightQuery(truncateText(result.description, 80), query)}</div>
                <div class="result-category">${result.category}</div>
            </a>
        `).join('');
        
        if (results.length > 8) {
            container.innerHTML += `
                <div class="search-result-item more-results">
                    <p>+${results.length - 8} more results</p>
                </div>
            `;
        }
    }
    
    container.style.display = 'block';
}

/**
 * Highlight search query in text
 */
function highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    const quickNavLinks = document.querySelectorAll('.quick-nav-card[href^="#"]');
    
    quickNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add temporary highlight
                targetSection.classList.add('highlight-section');
                setTimeout(() => {
                    targetSection.classList.remove('highlight-section');
                }, 2000);
            }
        });
    });
}

/**
 * Initialize card animations with intersection observer
 */
function initializeCardAnimations() {
    if (!window.IntersectionObserver) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards
    const cards = document.querySelectorAll('.topic-card, .tool-card, .quick-nav-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

/**
 * Initialize category filtering
 */
function initializeCategoryFilter() {
    // Create filter buttons
    const quickNavSection = document.querySelector('.quick-nav-section');
    if (quickNavSection) {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">All Topics</button>
                <button class="filter-btn" data-filter="event">Event Management</button>
                <button class="filter-btn" data-filter="tech">Technology</button>
                <button class="filter-btn" data-filter="marketing">Marketing</button>
                <button class="filter-btn" data-filter="tool">Tools</button>
            </div>
        `;
        
        // Insert after section header
        const sectionHeader = quickNavSection.querySelector('.section-header');
        sectionHeader.appendChild(filterContainer);
        
        // Add filter functionality
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards
                filterCards(filter);
            });
        });
    }
}

/**
 * Filter cards based on category
 */
function filterCards(category) {
    const allSections = document.querySelectorAll('.topic-section');
    
    allSections.forEach(section => {
        if (category === 'all') {
            section.style.display = 'block';
        } else {
            const sectionId = section.getAttribute('id');
            if (sectionId === category || 
                (category === 'tech' && sectionId === 'technology') ||
                (category === 'event' && sectionId === 'event-management') ||
                (category === 'tool' && sectionId === 'tools')) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });
    
    // Smooth scroll to first visible section
    if (category !== 'all') {
        const targetSection = document.getElementById(
            category === 'tech' ? 'technology' :
            category === 'event' ? 'event-management' :
            category
        );
        
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}

/**
 * Initialize theme support
 */
function initializeThemeSupport() {
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                updateThemeColors();
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

/**
 * Update theme-specific colors and styles
 */
function updateThemeColors() {
    const theme = document.documentElement.getAttribute('data-theme');
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.style.setProperty('--hero-gradient', 'linear-gradient(135deg, #1e293b 0%, #334155 100%)');
    } else {
        root.style.setProperty('--hero-gradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    }
}

/**
 * Initialize analytics tracking
 */
function initializeAnalytics() {
    // Track topic card clicks
    const topicLinks = document.querySelectorAll('.topic-link, .tool-link');
    topicLinks.forEach(link => {
        link.addEventListener('click', function() {
            const topicTitle = this.closest('.topic-card, .tool-card')?.querySelector('h3')?.textContent;
            
            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'topic_click', {
                    'topic_name': topicTitle,
                    'page_location': window.location.href
                });
            }
            
            // Track with custom analytics
            trackEvent('topic_engagement', {
                topic: topicTitle,
                action: 'click',
                page: 'getting-started'
            });
        });
    });
    
    // Track quick navigation clicks
    const quickNavCards = document.querySelectorAll('.quick-nav-card');
    quickNavCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3')?.textContent;
            
            trackEvent('quick_navigation', {
                category: category,
                action: 'click',
                page: 'getting-started'
            });
        });
    });
}

/**
 * Custom event tracking function
 */
function trackEvent(eventName, properties) {
    // Store events locally for analytics
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push({
        event: eventName,
        properties: properties,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
        events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    let currentFocusIndex = -1;
    const focusableElements = document.querySelectorAll(
        '.quick-nav-card, .topic-link, .tool-link, .cta-button, .filter-btn'
    );
    
    document.addEventListener('keydown', function(e) {
        // Handle arrow key navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            if (e.key === 'ArrowDown') {
                currentFocusIndex = Math.min(currentFocusIndex + 1, focusableElements.length - 1);
            } else {
                currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
            }
            
            focusableElements[currentFocusIndex]?.focus();
        }
        
        // Handle Enter key
        if (e.key === 'Enter' && document.activeElement) {
            document.activeElement.click();
        }
        
        // Handle Escape key to close search
        if (e.key === 'Escape') {
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
            
            const searchInput = document.getElementById('topic-search');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.blur();
            }
        }
    });
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * Add performance monitoring
 */
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            trackEvent('page_performance', {
                load_time: loadTime,
                page: 'getting-started'
            });
        }, 0);
    });
    
    // Monitor scroll depth
    let maxScroll = 0;
    const scrollHandler = debounce(function() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track scroll milestones
            if (maxScroll >= 25 && maxScroll < 50) {
                trackEvent('scroll_depth', { depth: '25%', page: 'getting-started' });
            } else if (maxScroll >= 50 && maxScroll < 75) {
                trackEvent('scroll_depth', { depth: '50%', page: 'getting-started' });
            } else if (maxScroll >= 75 && maxScroll < 100) {
                trackEvent('scroll_depth', { depth: '75%', page: 'getting-started' });
            } else if (maxScroll >= 100) {
                trackEvent('scroll_depth', { depth: '100%', page: 'getting-started' });
            }
        }
    }, 250);
    
    window.addEventListener('scroll', scrollHandler);
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    initializePerformanceMonitoring();
});

// Add CSS for search and filter components
const additionalCSS = `
.search-container {
    margin-top: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
}

.search-box {
    position: relative;
}

#topic-search {
    width: 100%;
    padding: 1rem 3rem 1rem 1.5rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

#topic-search::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

#topic-search:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.2);
}

.search-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: color 0.2s ease;
}

.search-btn:hover {
    color: white;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    margin-top: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
}

.search-result-item {
    display: block;
    padding: 1rem 1.5rem;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.2s ease;
}

.search-result-item:hover {
    background-color: #f8fafc;
}

.search-result-item:last-child {
    border-bottom: none;
}

.result-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
}

.result-description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.result-category {
    font-size: 0.75rem;
    color: var(--sidebar-highlight);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
}

.no-results {
    text-align: center;
    color: var(--text-secondary);
    font-style: italic;
}

.more-results {
    text-align: center;
    color: var(--sidebar-highlight);
    font-weight: 500;
}

.filter-container {
    margin-top: 2rem;
}

.filter-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--border-color);
    background: var(--content-white);
    color: var(--text-primary);
    border-radius: 50px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.filter-btn:hover {
    border-color: var(--sidebar-highlight);
    color: var(--sidebar-highlight);
}

.filter-btn.active {
    background: var(--sidebar-highlight);
    border-color: var(--sidebar-highlight);
    color: white;
}

.highlight-section {
    background: rgba(59, 130, 246, 0.1);
    transition: background-color 0.3s ease;
}

.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

mark {
    background: #fef08a;
    color: #92400e;
    padding: 0.1em 0.2em;
    border-radius: 2px;
}

@media (max-width: 768px) {
    .search-container {
        margin-top: 1.5rem;
        padding: 0 1rem;
    }
    
    .filter-buttons {
        gap: 0.25rem;
    }
    
    .filter-btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);