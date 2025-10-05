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

    // Search form functionality (basic)
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchForm.querySelector('input').value.trim();
            if (query) {
                // For now, just redirect to the volunteer systems page if they search for it
                if (query.toLowerCase().includes('volunteer')) {
                    window.location.href = 'Volunteer Systems A Comprehensive Guide to Streamlining Team Coordination/index.html';
                } else {
                    alert('Search functionality coming soon! You searched for: "' + query + '"');
                }
            }
        });
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
