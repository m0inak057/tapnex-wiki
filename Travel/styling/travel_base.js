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
        }

        // Close sidebar on outside click
        document.addEventListener('click', (e) => {
            if (body.classList.contains('sidebar-open') &&
                sidebar && !sidebar.contains(e.target) &&
                menuToggle && !menuToggle.contains(e.target)) {
                body.classList.remove('sidebar-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close sidebar on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('sidebar-open')) {
                body.classList.remove('sidebar-open');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // --- Dark Mode Toggle ---
        const themeToggle = document.getElementById('theme-toggle');
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

        // --- TOC highlight (basic) ---
        const sections = document.querySelectorAll('article h2[id]');
        const tocLinks = document.querySelectorAll('#toc-list li');

        if (sections.length > 0 && tocLinks.length > 0) {
            const observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        tocLinks.forEach(link => {
                            link.classList.remove('active-toc');
                            const linkHref = link.querySelector('a')?.getAttribute('href');
                            if (linkHref === `#${id}`) link.classList.add('active-toc');
                        });
                    }
                });
            }, observerOptions);
            sections.forEach(s => observer.observe(s));
        }

    } catch (error) {
        console.error('Error initializing travel base scripts:', error);
    }
});
