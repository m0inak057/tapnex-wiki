document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const dropdownNav = document.querySelector('.dropdown-nav');

    // Mobile nav toggle - now controls the dropdown navigation
    if (mobileToggle && dropdownNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = dropdownNav.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !dropdownNav.contains(e.target)) {
                dropdownNav.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile nav on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                dropdownNav.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Set dark theme permanently (no toggle functionality)
    document.documentElement.setAttribute('data-theme', 'dark');

    // Search database with all available topics
    const searchDatabase = [
        {
            title: "Digital Ticketing Systems",
            description: "Complete guide to digital ticketing platforms, QR codes, NFC, and modern event ticketing solutions",
            category: "Event Management",
            url: "ticketing-platform/index.html",
            keywords: ["ticketing", "digital tickets", "qr code", "nfc", "event management", "tickets", "ticket platform", "digital ticketing"]
        },
        {
            title: "Volunteer Management Systems",
            description: "Comprehensive guide to streamlining team coordination and volunteer management",
            category: "Event Management", 
            url: "volunteer-systems/index.html",
            keywords: ["volunteer", "volunteers", "team coordination", "volunteer management", "vms", "volunteer systems", "event volunteers"]
        },
        {
            title: "Event Management",
            description: "Overview of event management tools and strategies",
            category: "Event Management",
            url: "#event-management",
            keywords: ["event management", "events", "event planning", "event coordination"]
        },
        {
            title: "Technology Solutions",
            description: "Web development, APIs, databases, and technical solutions",
            category: "Technology",
            url: "#technology", 
            keywords: ["technology", "web development", "api", "database", "devops", "technical"]
        },
        {
            title: "Marketing Strategies",
            description: "Social media, content marketing, and analytics insights",
            category: "Marketing",
            url: "#marketing",
            keywords: ["marketing", "social media", "content", "analytics", "campaigns", "email marketing"]
        }
    ];

    // Search form functionality with autocomplete
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    let currentHighlight = -1;

    if (searchForm && searchInput && searchSuggestions) {
        // Handle input events for real-time search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            currentHighlight = -1;
            
            if (query.length < 2) {
                hideSuggestions();
                return;
            }
            
            const results = searchDatabase.filter(item => 
                item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
            
            showSuggestions(results, query);
        });

        // Handle keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const suggestions = searchSuggestions.querySelectorAll('.search-suggestion');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentHighlight = Math.min(currentHighlight + 1, suggestions.length - 1);
                updateHighlight(suggestions);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentHighlight = Math.max(currentHighlight - 1, -1);
                updateHighlight(suggestions);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentHighlight >= 0 && suggestions[currentHighlight]) {
                    const url = suggestions[currentHighlight].dataset.url;
                    navigateToResult(url);
                } else {
                    // Default search behavior
                    handleSearch(searchInput.value.trim());
                }
            } else if (e.key === 'Escape') {
                hideSuggestions();
                searchInput.blur();
            }
        });

        // Handle form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                handleSearch(query);
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target)) {
                hideSuggestions();
            }
        });
    }

    function showSuggestions(results, query) {
        if (results.length === 0) {
            searchSuggestions.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            searchSuggestions.innerHTML = results.map((result, index) => `
                <div class="search-suggestion" data-url="${result.url}" data-index="${index}">
                    <svg class="search-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <div class="search-suggestion-content">
                        <div class="search-suggestion-category">${result.category}</div>
                        <div class="search-suggestion-title">${highlightMatch(result.title, query)}</div>
                        <div class="search-suggestion-description">${highlightMatch(result.description, query)}</div>
                    </div>
                </div>
            `).join('');
            
            // Add click handlers to suggestions
            searchSuggestions.querySelectorAll('.search-suggestion').forEach(suggestion => {
                suggestion.addEventListener('click', () => {
                    const url = suggestion.dataset.url;
                    navigateToResult(url);
                });
                
                suggestion.addEventListener('mouseenter', () => {
                    currentHighlight = parseInt(suggestion.dataset.index);
                    updateHighlight(searchSuggestions.querySelectorAll('.search-suggestion'));
                });
            });
        }
        
        searchSuggestions.classList.add('show');
        searchSuggestions.setAttribute('aria-hidden', 'false');
    }

    function hideSuggestions() {
        searchSuggestions.classList.remove('show');
        searchSuggestions.setAttribute('aria-hidden', 'true');
        currentHighlight = -1;
    }

    function updateHighlight(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('highlighted', index === currentHighlight);
        });
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    function navigateToResult(url) {
        hideSuggestions();
        if (url.startsWith('#')) {
            // Handle internal navigation to dropdown sections
            const targetId = url.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && targetElement.classList.contains('dropdown')) {
                // Scroll to the dropdown navigation area
                const dropdownNav = document.querySelector('.dropdown-nav');
                if (dropdownNav) {
                    dropdownNav.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Wait for scroll to complete, then open the dropdown
                    setTimeout(() => {
                        // Close all other dropdowns first
                        document.querySelectorAll('.dropdown').forEach(dropdown => {
                            if (dropdown !== targetElement) {
                                dropdown.classList.remove('open');
                                dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                            }
                        });
                        
                        // Open the target dropdown
                        targetElement.classList.add('open');
                        targetElement.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
                    }, 500);
                }
            }
        } else {
            // Navigate to external page
            window.location.href = url;
        }
    }

    function handleSearch(query) {
        // Find the best match based on query
        const normalizedQuery = query.toLowerCase();
        const exactMatch = searchDatabase.find(item => 
            item.keywords.some(keyword => keyword.toLowerCase() === normalizedQuery) ||
            item.title.toLowerCase() === normalizedQuery
        );
        
        if (exactMatch) {
            navigateToResult(exactMatch.url);
        } else {
            // Find partial matches
            const partialMatch = searchDatabase.find(item => 
                item.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery)) ||
                item.title.toLowerCase().includes(normalizedQuery)
            );
            
            if (partialMatch) {
                navigateToResult(partialMatch.url);
            } else {
                alert('No results found for: "' + query + '". Try searching for topics like "ticketing", "volunteer systems", or "event management".');
            }
        }
        
        hideSuggestions();
    }

    // Newsletter form functionality
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simple email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    alert('Thank you for subscribing with email: ' + email);
                    emailInput.value = '';
                } else {
                    alert('Please enter a valid email address.');
                }
            }
        });
    }

    // Dropdown navigation functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        // Prevent default link behavior for dropdown toggles
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.closest('.dropdown');
            const isOpen = dropdown.classList.contains('open');
            
            // On mobile, allow multiple dropdowns to be open
            if (window.innerWidth <= 768) {
                dropdown.classList.toggle('open');
                toggle.setAttribute('aria-expanded', !isOpen);
            } else {
                // On desktop, close other dropdowns
                document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('open');
                        otherDropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('open');
                toggle.setAttribute('aria-expanded', !isOpen);
            }
        });
    });

    // Close dropdowns when clicking outside (desktop only)
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768 && !e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('open');
                dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Handle keyboard navigation for accessibility
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                dropdown.classList.toggle('open');
                toggle.setAttribute('aria-expanded', dropdown.classList.contains('open'));
            } else if (e.key === 'Escape') {
                const dropdown = toggle.closest('.dropdown');
                dropdown.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Handle placeholder links (prevent navigation for non-functional links)
    document.querySelectorAll('.dropdown-menu a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Optional: Show a message that the page is coming soon
            console.log('Page coming soon:', link.textContent);
        });
    });

    // Handle footer navigation links to dropdown sections
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && targetElement.classList.contains('dropdown')) {
                e.preventDefault();
                
                // Scroll to the dropdown navigation area
                const dropdownNav = document.querySelector('.dropdown-nav');
                if (dropdownNav) {
                    dropdownNav.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Wait for scroll to complete, then open the dropdown
                    setTimeout(() => {
                        // Close all other dropdowns first
                        document.querySelectorAll('.dropdown').forEach(dropdown => {
                            if (dropdown !== targetElement) {
                                dropdown.classList.remove('open');
                                dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                            }
                        });
                        
                        // Open the target dropdown
                        targetElement.classList.add('open');
                        targetElement.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
                        
                        // On mobile, also open the navigation menu if it's closed
                        if (window.innerWidth <= 768 && !dropdownNav.classList.contains('open')) {
                            dropdownNav.classList.add('open');
                            if (mobileToggle) {
                                mobileToggle.setAttribute('aria-expanded', 'true');
                            }
                        }
                    }, 500);
                }
            }
        });
    });
});
