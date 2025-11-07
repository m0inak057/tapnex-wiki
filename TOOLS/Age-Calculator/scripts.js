// Age Calculator Script
document.addEventListener('DOMContentLoaded', function() {
    // Theme management
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('calc-date').value = today;

    // Age Calculator functionality
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsContainer = document.getElementById('results-container');
    const ageResult = document.getElementById('age-result');
    const statusMessage = document.getElementById('status-message');

    calculateBtn.addEventListener('click', function() {
        const dobString = document.getElementById('dob').value;
        const calcDateString = document.getElementById('calc-date').value;

        // Input validation
        if (!dobString || !calcDateString) {
            showStatus('Please select both dates.', 'error');
            return;
        }

        const dob = new Date(dobString);
        const calcDate = new Date(calcDateString);

        if (dob > calcDate) {
            showStatus('Date of Birth cannot be after the calculation date.', 'error');
            return;
        }

        // Calculate age
        let years = calcDate.getFullYear() - dob.getFullYear();
        let months = calcDate.getMonth() - dob.getMonth();
        let days = calcDate.getDate() - dob.getDate();

        // Handle negative days (borrow from month)
        if (days < 0) {
            months--;
            // Get the number of days in the previous month
            days += new Date(calcDate.getFullYear(), calcDate.getMonth(), 0).getDate();
        }

        // Handle negative months (borrow from year)
        if (months < 0) {
            years--;
            months += 12;
        }

        // Display result
        ageResult.textContent = `${years} years, ${months} months, ${days} days`;

        resultsContainer.style.display = 'block';
        showStatus('Age calculated successfully!', 'success');

        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        // Hide status after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }

    // Clear results when inputs change
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            resultsContainer.style.display = 'none';
            statusMessage.style.display = 'none';
        });
    });

    // Load footer
    loadFooter();

    function loadFooter() {
        fetch('/scripts/footer.js')
            .then(response => response.text())
            .then(script => {
                const scriptElement = document.createElement('script');
                scriptElement.textContent = script;
                document.body.appendChild(scriptElement);
            })
            .catch(error => {
                console.warn('Footer script not found, using fallback');
                // Fallback footer if script fails to load
                const footer = document.createElement('footer');
                footer.innerHTML = `
                    <div class="tools-footer">
                        <div class="tools-nav">
                            <h4>Explore More Tools</h4>
                            <div class="tools-grid">
                                <a href="/TOOLS/CSV-to-JSON/" class="tool-card">
                                    <div class="tool-icon">📊</div>
                                    <div class="tool-name">CSV to JSON</div>
                                </a>
                                <a href="/TOOLS/JSON-to-CSV/" class="tool-card">
                                    <div class="tool-icon">📋</div>
                                    <div class="tool-name">JSON to CSV</div>
                                </a>
                                <a href="/TOOLS/QR-Scanner/" class="tool-card">
                                    <div class="tool-icon">📱</div>
                                    <div class="tool-name">QR Scanner</div>
                                </a>
                                <a href="/TOOLS/XML-Formatter/" class="tool-card">
                                    <div class="tool-icon">📄</div>
                                    <div class="tool-name">XML Formatter</div>
                                </a>
                                <a href="/TOOLS/JWT-Debugger/" class="tool-card">
                                    <div class="tool-icon">🔐</div>
                                    <div class="tool-name">JWT Debugger</div>
                                </a>
                                <a href="/TOOLS/BMI-Calculator/" class="tool-card">
                                    <div class="tool-icon">⚖️</div>
                                    <div class="tool-name">BMI Calculator</div>
                                </a>
                                <a href="/TOOLS/Percentage-Calculator/" class="tool-card">
                                    <div class="tool-icon">📈</div>
                                    <div class="tool-name">Percentage Calculator</div>
                                </a>
                                <a href="/TOOLS/Loan-Calculator/" class="tool-card">
                                    <div class="tool-icon">💰</div>
                                    <div class="tool-name">Loan Calculator</div>
                                </a>
                                <a href="/TOOLS/Tip-Calculator/" class="tool-card">
                                    <div class="tool-icon">🧾</div>
                                    <div class="tool-name">Tip Calculator</div>
                                </a>
                                <a href="/TOOLS/GST-Calculator/" class="tool-card">
                                    <div class="tool-icon">💼</div>
                                    <div class="tool-name">GST Calculator</div>
                                </a>
                                <a href="/TOOLS/BMR-Calculator/" class="tool-card">
                                    <div class="tool-icon">🔥</div>
                                    <div class="tool-name">BMR Calculator</div>
                                </a>
                                <a href="/TOOLS/Calorie-Calculator/" class="tool-card">
                                    <div class="tool-icon">🍎</div>
                                    <div class="tool-name">Calorie Calculator</div>
                                </a>
                                <a href="/TOOLS/Age-Calculator/" class="tool-card active">
                                    <div class="tool-icon">📅</div>
                                    <div class="tool-name">Age Calculator</div>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(footer);
            });
    }
});