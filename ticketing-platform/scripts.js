document.addEventListener('DOMContentLoaded', function() {
    try {
        // --- Mobile Menu Toggle ---
        const menuToggle = document.getElementById('menu-toggle');
        const body = document.body;
        const sidebar = document.querySelector('.sidebar');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const isOpen = body.classList.toggle('sidebar-open');
                menuToggle.setAttribute('aria-expanded', isOpen);
            });
        } else {
            console.warn('Menu toggle button not found');
        }

        // Close sidebar when clicking outside (on overlay)
        document.addEventListener('click', (e) => {
            if (body.classList.contains('sidebar-open') && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                body.classList.remove('sidebar-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('sidebar-open')) {
                body.classList.remove('sidebar-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // --- Dark Mode Toggle ---
        const themeToggle = document.getElementById('theme-toggle');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Initialize theme based on localStorage or system preference
        const savedTheme = localStorage.getItem('theme') || (prefersDarkMode ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }

        // --- Sidebar Submenu Toggle ---
        const navToggles = document.querySelectorAll('.nav-toggle');
        navToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const parentLi = toggle.parentElement;
                const isOpen = parentLi.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });
        });

        // --- Search Functionality ---
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const query = e.target.value.toLowerCase().trim();
                const navLinks = document.querySelectorAll('.sidebar-nav a');
                
                navLinks.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    const listItem = link.closest('li');
                    
                    if (query === '' || text.includes(query)) {
                        listItem.style.display = 'block';
                        // Show parent menu if submenu item matches
                        const parentSubmenu = listItem.closest('.submenu');
                        if (parentSubmenu) {
                            const parentLi = parentSubmenu.closest('li');
                            parentLi.style.display = 'block';
                            if (query !== '') {
                                parentLi.classList.add('open');
                            }
                        }
                    } else {
                        listItem.style.display = 'none';
                    }
                });
                
                // Hide empty parent menus
                if (query !== '') {
                    const parentMenus = document.querySelectorAll('.sidebar-nav > ul > li');
                    parentMenus.forEach(menu => {
                        const submenu = menu.querySelector('.submenu');
                        if (submenu) {
                            const visibleItems = submenu.querySelectorAll('li[style*="block"], li:not([style])');
                            if (visibleItems.length === 0) {
                                menu.style.display = 'none';
                            }
                        }
                    });
                }
            });

            // Clear search on escape key
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                    searchInput.blur();
                }
            });
        }

        // --- Active TOC Highlighting on Scroll ---
        const sections = document.querySelectorAll('article h2');
        const tocLinks = document.querySelectorAll('#toc-list li');

        if (sections.length === 0) {
            console.warn('No sections found for TOC highlighting');
        }

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    tocLinks.forEach(link => {
                        link.classList.remove('active-toc');
                        const linkHref = link.querySelector('a')?.getAttribute('href');
                        if (linkHref === `#${id}`) {
                            link.classList.add('active-toc');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // --- Keyboard Navigation ---
        document.addEventListener('keydown', function(e) {
            // Alt + M to toggle mobile menu
            if (e.altKey && e.key === 'm' && menuToggle) {
                e.preventDefault();
                menuToggle.click();
            }
            
            // Alt + T to toggle theme
            if (e.altKey && e.key === 't' && themeToggle) {
                e.preventDefault();
                themeToggle.click();
            }
            
            // Alt + S to focus search
            if (e.altKey && e.key === 's' && searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // --- Link Tracking (Optional Analytics) ---
        document.addEventListener('click', function(e) {
            if (e.target.matches('a[href^="#"]')) {
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Smooth scroll to element
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Optional: Track link clicks for analytics
                    console.log(`Navigated to section: ${targetId}`);
                }
            }
        });

        // --- Enhanced Features for Ticketing Platform ---
        
        // Add hover effects for stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-2px) scale(1.0)';
            });
        });

        // Add animated counter effect for statistics
        const animateCounters = () => {
            const counters = document.querySelectorAll('.stat-card h3');
            
            counters.forEach(counter => {
                const target = counter.textContent;
                const numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
                
                if (!isNaN(numericTarget) && numericTarget > 0) {
                    let current = 0;
                    const increment = numericTarget / 100;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericTarget) {
                            current = numericTarget;
                            clearInterval(timer);
                        }
                        
                        // Format the number based on original text
                        if (target.includes('M+')) {
                            counter.textContent = Math.floor(current) + 'M+';
                        } else if (target.includes('%')) {
                            counter.textContent = Math.floor(current) + '%';
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 20);
                }
            });
        };

        // Trigger counter animation when stats come into view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.disconnect(); // Only animate once
                }
            });
        });

        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            statsObserver.observe(statsGrid);
        }

        // --- Modal functionality for Privacy and Terms ---
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

        console.log('Ticketing platform page functionality initialized successfully');
        
    } catch (error) {
        console.error('Error initializing page functionality:', error);
    }
});