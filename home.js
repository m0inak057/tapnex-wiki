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

    // Add scroll indicators to dropdown menus with more than 6 items
    function initDropdownScrollIndicators() {
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        
        dropdownMenus.forEach(menu => {
            const itemCount = menu.querySelectorAll('li').length;
            
            // Add scroll indicator class if more than 6 items
            if (itemCount > 6) {
                menu.classList.add('has-scroll');
                
                // Update scroll indicator visibility based on scroll position
                menu.addEventListener('scroll', function() {
                    const atBottom = this.scrollHeight - this.scrollTop <= this.clientHeight + 5;
                    if (atBottom) {
                        this.classList.add('scrolled-to-bottom');
                    } else {
                        this.classList.remove('scrolled-to-bottom');
                    }
                });
            }
        });
    }

    // Initialize scroll indicators
    initDropdownScrollIndicators();

    // Handle URL hash fragments for dropdown navigation when arriving from other pages
    function handleHashNavigation() {
        const hash = window.location.hash;
        if (hash && hash.length > 1) {
            const targetId = hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && targetElement.classList.contains('dropdown')) {
                // Small delay to ensure DOM is fully ready
                setTimeout(() => {
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
                }, 100);
            }
        }
    }

    // Handle hash navigation on page load
    handleHashNavigation();

    // Handle hash navigation when hash changes (browser back/forward)
    window.addEventListener('hashchange', handleHashNavigation);

    // Search database with all available topics
    const searchDatabase = [
        // Event Management
        {
            title: "Digital Ticketing Systems",
            description: "Complete guide to digital ticketing platforms, QR codes, NFC, and modern event ticketing solutions",
            category: "Event Management",
            url: "EVENT-MANAGEMENT/ticketing-platform/index.html",
            keywords: ["ticketing", "digital tickets", "qr code", "nfc", "event management", "tickets", "ticket platform", "digital ticketing", "event tickets"]
        },
        {
            title: "Volunteer Management Systems",
            description: "Comprehensive guide to streamlining team coordination and volunteer management",
            category: "Event Management", 
            url: "EVENT-MANAGEMENT/volunteer-systems/index.html",
            keywords: ["volunteer", "volunteers", "team coordination", "volunteer management", "vms", "volunteer systems", "event volunteers", "volunteering"]
        },
        {
            title: "Event Budgeting",
            description: "Financial planning and budget management for successful events",
            category: "Event Management",
            url: "EVENT-MANAGEMENT/Event-budgeting/index.html",
            keywords: ["budget", "budgeting", "finance", "financial planning", "event budget", "cost management", "expenses", "event finance"]
        },
        {
            title: "Logistic Planning",
            description: "Comprehensive logistics and operational planning for events",
            category: "Event Management",
            url: "EVENT-MANAGEMENT/Logistic-Planning/index.html",
            keywords: ["logistics", "planning", "operations", "event logistics", "operational planning", "supply chain", "event operations"]
        },
        {
            title: "Event Management",
            description: "Overview of event management tools and strategies",
            category: "Event Management",
            url: "#event-management",
            keywords: ["event management", "events", "event planning", "event coordination", "event organization"]
        },
        
        // Technology
        {
            title: "5G Technology",
            description: "Fifth-generation cellular network technology and its applications",
            category: "Technology",
            url: "TECHNOLOGY/5G-Technology/index.html",
            keywords: ["5g", "5g technology", "network", "cellular", "wireless", "connectivity", "mobile network", "telecommunications"]
        },
        {
            title: "Agentic AI",
            description: "Autonomous AI agents and intelligent automation systems",
            category: "Technology",
            url: "TECHNOLOGY/Agentic-AI/index.html",
            keywords: ["agentic ai", "ai agents", "autonomous ai", "intelligent agents", "artificial intelligence", "automation", "ai systems"]
        },
        {
            title: "APIs",
            description: "Application Programming Interfaces and integration solutions",
            category: "Technology",
            url: "TECHNOLOGY/APIs/index.html",
            keywords: ["api", "apis", "rest api", "integration", "web services", "application programming interface", "endpoints", "web api"]
        },
        {
            title: "Biotech & Engineered Living Therapeutics",
            description: "Biotechnology and advanced living therapeutic solutions",
            category: "Technology",
            url: "TECHNOLOGY/Biotech-&-Engineered-Living-Therapeutics/index.html",
            keywords: ["biotech", "biotechnology", "therapeutics", "living therapeutics", "engineered biology", "bioscience", "medical tech"]
        },
        {
            title: "Collaborative Sensing & Autonomous Biochemical Sensors",
            description: "Advanced sensor networks and autonomous biochemical detection systems",
            category: "Technology",
            url: "TECHNOLOGY/Collaborative-Sensing-&-Autonomous-Biochemical-Sensors/index.html",
            keywords: ["sensors", "sensing", "biochemical", "autonomous sensors", "sensor networks", "detection systems", "iot sensors"]
        },
        {
            title: "Database Management",
            description: "Database systems, design, and management best practices",
            category: "Technology",
            url: "TECHNOLOGY/Database-Management/index.html",
            keywords: ["database", "db", "sql", "nosql", "database management", "data storage", "dbms", "data management"]
        },
        {
            title: "DevOps",
            description: "Development and operations practices for software delivery",
            category: "Technology",
            url: "TECHNOLOGY/Devops/index.html",
            keywords: ["devops", "ci cd", "continuous integration", "deployment", "automation", "infrastructure", "dev ops"]
        },
        {
            title: "Edge Computing",
            description: "Distributed computing paradigm bringing computation closer to data sources",
            category: "Technology",
            url: "TECHNOLOGY/Edge-Computing/index.html",
            keywords: ["edge computing", "edge", "distributed computing", "fog computing", "iot", "cloud edge"]
        },
        {
            title: "Generative AI",
            description: "AI systems that generate new content, text, images, and more",
            category: "Technology",
            url: "TECHNOLOGY/Generative-AI/index.html",
            keywords: ["generative ai", "genai", "chatgpt", "ai generation", "llm", "large language models", "image generation", "ai content"]
        },
        {
            title: "Green Nitrogen Fixation & Advanced Clean Energy",
            description: "Sustainable nitrogen fixation and clean energy technologies",
            category: "Technology",
            url: "TECHNOLOGY/Green-Nitrogen-Fixation-&-Advanced-Clean-Energy/index.html",
            keywords: ["green energy", "nitrogen fixation", "clean energy", "renewable energy", "sustainable energy", "green tech"]
        },
        {
            title: "NFC Technology",
            description: "Near Field Communication technology guide for events and ticketing",
            category: "Technology",
            url: "TECHNOLOGY/NFC/index.html",
            keywords: ["nfc", "near field communication", "contactless", "technology", "smart cards", "tap", "rfid"]
        },
        {
            title: "Quantum Computing",
            description: "Quantum computing principles, applications, and future potential",
            category: "Technology",
            url: "TECHNOLOGY/Quantun-Computing/index.html",
            keywords: ["quantum", "quantum computing", "qubits", "quantum mechanics", "quantum algorithms", "quantum tech"]
        },
        {
            title: "Synthetic Media & Generative Watermarking",
            description: "AI-generated media and digital watermarking technologies",
            category: "Technology",
            url: "TECHNOLOGY/Synthetic-Media-&-Generative-Watermarking/index.html",
            keywords: ["synthetic media", "deepfake", "watermarking", "digital watermark", "ai media", "generated media"]
        },
        {
            title: "VR Virtual Reality",
            description: "Virtual reality technology, applications, and immersive experiences",
            category: "Technology",
            url: "TECHNOLOGY/VR-Virtual-Reality/index.html",
            keywords: ["vr", "virtual reality", "immersive", "headset", "metaverse", "3d", "virtual world"]
        },
        {
            title: "Web Development",
            description: "Modern web development technologies, frameworks, and best practices",
            category: "Technology",
            url: "TECHNOLOGY/Web-Development/index.html",
            keywords: ["web development", "web dev", "frontend", "backend", "html", "css", "javascript", "web design", "programming"]
        },
        {
            title: "Technology Solutions",
            description: "Web development, APIs, databases, and technical solutions",
            category: "Technology",
            url: "#technology", 
            keywords: ["technology", "tech", "technical", "software", "it solutions"]
        },
        
        // Marketing - Core
        {
            title: "Social Media Strategy",
            description: "Complete guide to social media marketing, influencer campaigns, and digital event promotion",
            category: "Marketing",
            url: "MARKETING/social-media-strategy/index.html",
            keywords: ["social media", "marketing", "social media strategy", "influencer", "facebook", "instagram", "linkedin", "tiktok", "social campaigns", "digital marketing", "social"]
        },
        {
            title: "Content Marketing",
            description: "Complete expert guide to content marketing strategy, creation, distribution, analytics, and future trends",
            category: "Marketing",
            url: "MARKETING/content-marketing/index.html",
            keywords: ["content marketing", "content strategy", "inbound marketing", "brand publishing", "thought leadership", "seo", "digital marketing", "content creation", "marketing content", "content"]
        },
        {
            title: "Analytics & Insights",
            description: "Data-driven marketing analytics, metrics tracking, and actionable insights for campaigns",
            category: "Marketing",
            url: "MARKETING/analytics-&-insigths/index.html",
            keywords: ["analytics", "insights", "data", "metrics", "tracking", "kpi", "roi", "measurement", "analysis", "marketing analytics"]
        },
        {
            title: "Email Campaigns",
            description: "Email marketing strategies, automation, and campaign optimization",
            category: "Marketing",
            url: "MARKETING/email-campaigns/index.html",
            keywords: ["email", "email marketing", "campaigns", "newsletter", "email automation", "email strategy", "drip campaigns", "mailing"]
        },
        
        // Marketing - Advanced Content
        {
            title: "Short Form Video Content",
            description: "Creating engaging short-form videos for TikTok, Reels, and Shorts",
            category: "Marketing",
            url: "MARKETING/short-form-video-content/index.html",
            keywords: ["short form", "video", "tiktok", "reels", "shorts", "video content", "short video", "vertical video", "video marketing"]
        },
        {
            title: "Personalization & Data-Driven Content",
            description: "Leveraging data and AI to personalize content and improve engagement",
            category: "Marketing",
            url: "MARKETING/Personalization-&-Data-Driven-Content/index.html",
            keywords: ["personalization", "data driven", "ai", "targeting", "customization", "personalized content", "data", "audience segmentation"]
        },
        {
            title: "Compliance & Ethical Content Marketing",
            description: "Legal compliance, ethical practices, and responsible content marketing",
            category: "Marketing",
            url: "MARKETING/compliance-&-ethical-content-marketing/index.html",
            keywords: ["compliance", "ethics", "legal", "gdpr", "privacy", "ethical marketing", "responsible marketing", "regulations"]
        },
        {
            title: "AI-Powered Content Creation",
            description: "Using artificial intelligence for content creation and marketing automation",
            category: "Marketing",
            url: "MARKETING/AI-Powered-Content-Creation-&-Exhaustive-Marketing/index.html",
            keywords: ["ai", "artificial intelligence", "automation", "ai content", "machine learning", "chatgpt", "ai marketing", "content automation"]
        },
        {
            title: "Humanizing Content & Authentic Storytelling",
            description: "Creating authentic, human-centered content that resonates with audiences",
            category: "Marketing",
            url: "MARKETING/Humanizing-content-&-authentic-storytelling/index.html",
            keywords: ["storytelling", "authentic", "human", "brand story", "narrative", "humanizing", "authenticity", "emotional content"]
        },
        {
            title: "User Generated Content (UGC)",
            description: "Leveraging user-generated content for authentic marketing and engagement",
            category: "Marketing",
            url: "MARKETING/UGC/index.html",
            keywords: ["ugc", "user generated", "user content", "reviews", "testimonials", "community content", "social proof", "customer content"]
        },
        {
            title: "Content Format Innovations",
            description: "Exploring new content formats including interactive media and emerging technologies",
            category: "Marketing",
            url: "MARKETING/content-format-innovations/index.html",
            keywords: ["innovation", "content formats", "interactive", "new media", "emerging tech", "content innovation", "formats"]
        },
        {
            title: "Augmented Reality & Virtual Reality Marketing",
            description: "Immersive AR/VR experiences for innovative content marketing",
            category: "Marketing",
            url: "MARKETING/augmented-reality-&-virtual-reality-for-content-marketing/index.html",
            keywords: ["ar", "vr", "augmented reality", "virtual reality", "immersive", "metaverse", "3d", "xr", "mixed reality"]
        },
        {
            title: "Co-Marketing & Brand Partnership",
            description: "Strategic partnerships and collaborative marketing initiatives",
            category: "Marketing",
            url: "MARKETING/Co-Marketing-&-brand-partnership/index.html",
            keywords: ["partnership", "co-marketing", "collaboration", "brand partnership", "joint venture", "alliance", "strategic partnership"]
        },
        {
            title: "Newsletter & Community-Driven Growth",
            description: "Building engaged communities and growing through newsletter marketing",
            category: "Marketing",
            url: "MARKETING/newsletter-&-community-driven-growth/index.html",
            keywords: ["newsletter", "community", "growth", "community building", "engagement", "subscriber", "community driven", "audience building"]
        },
        {
            title: "Content Marketing Measurement & ROI Analytics",
            description: "Measuring content performance and calculating marketing ROI",
            category: "Marketing",
            url: "MARKETING/content-marketing-measurement-&-ROI-analytics/index.html",
            keywords: ["roi", "measurement", "analytics", "performance", "metrics", "content roi", "marketing measurement", "attribution"]
        },
        
        // Bhakti
        {
            title: "Hanuman Chalisa",
            description: "Complete Hanuman Chalisa with meaning and significance",
            category: "Bhakti",
            url: "bhakti/hanuman-chalisa.html",
            keywords: ["hanuman", "chalisa", "hanuman chalisa", "bhakti", "devotional", "prayer", "hindu", "lord hanuman"]
        },
        {
            title: "Bhakti",
            description: "Devotional content and spiritual resources",
            category: "Bhakti",
            url: "#bhakti",
            keywords: ["bhakti", "devotion", "spiritual", "devotional", "religious", "prayer"]
        },
        
        // Jain Docs
        {
            title: "Jain Docs",
            description: "Comprehensive Jain religious texts, prayers, and spiritual documentation",
            category: "Jain Docs",
            url: "Jain Docs/index.html",
            keywords: ["jain", "jainism", "jain docs", "tirthankar", "mahavir", "jain prayers", "jain mantras", "jain bhajan", "jain puja", "jain stuti", "navkar mantra", "bhaktamar stotra", "jain religion", "jain dharma"]
        },
        
        // Main Categories
        {
            title: "Marketing Strategies",
            description: "Social media, content marketing, and analytics insights",
            category: "Marketing",
            url: "#marketing",
            keywords: ["marketing", "strategy", "campaigns", "digital marketing", "marketing strategies"]
        },
        {
            title: "Tools",
            description: "Useful online tools and utilities",
            category: "Tools",
            url: "tools.html",
            keywords: ["tools", "utilities", "calculator", "converter", "generator", "online tools", "web tools"]
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

    // Modal functionality for Privacy and Terms
    const privacyBtn = document.getElementById('privacy-btn');
    const termsBtn = document.getElementById('terms-btn');
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    // Open Privacy modal
    if (privacyBtn && privacyModal) {
        privacyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Open Terms modal
    if (termsBtn && termsModal) {
        termsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modals
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    });

    // Close modal when clicking outside
    [privacyModal, termsModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function closeModal() {
        if (privacyModal) privacyModal.classList.remove('active');
        if (termsModal) termsModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});
