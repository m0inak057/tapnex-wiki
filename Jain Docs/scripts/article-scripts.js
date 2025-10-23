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
        
        // Initialize theme - default to light for Jain Docs, unless user has explicitly saved a preference
        const savedTheme = localStorage.getItem('theme') || 'light';
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

        console.log('Page functionality initialized successfully');
        
        // === STAGGERING ANIMATIONS ===
        
        // Intersection Observer for scroll-triggered animations
        const createScrollObserver = () => {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        
                        // Animate list items in highlights
                        if (target.classList.contains('technology-highlight') || 
                            target.classList.contains('analytics-showcase')) {
                            const listItems = target.querySelectorAll('ul li');
                            listItems.forEach((item, index) => {
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                    item.style.transform = 'translateX(0)';
                                }, index * 100);
                            });
                        }
                        
                        // Animate showcase containers
                        if (target.classList.contains('technology-highlight') ||
                            target.classList.contains('analytics-showcase')) {
                            target.style.opacity = '1';
                            target.style.transform = 'translateY(0)';
                        }
                        
                        // Add animate class for general scroll animations
                        if (target.classList.contains('animate-on-scroll')) {
                            target.classList.add('animate');
                        }
                        
                        // Stop observing this element
                        observer.unobserve(target);
                    }
                });
            }, observerOptions);
            
            // Observe all elements that should animate
            const elementsToAnimate = document.querySelectorAll(`
                .technology-highlight,
                .analytics-showcase,
                .animate-on-scroll
            `);
            
            elementsToAnimate.forEach(element => {
                observer.observe(element);
            });
        };
        
        // Initialize scroll animations
        createScrollObserver();
        
        // Add smooth entrance animation for page load
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                mainContent.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 100);
        }
        
    } catch (error) {
        console.error('Error initializing page functionality:', error);
    }
});