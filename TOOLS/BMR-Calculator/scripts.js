// BMR Calculator Script
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

    // BMR Calculator functionality
    const calculateBtn = document.getElementById('calculate-bmr');
    const resultsContainer = document.getElementById('results-container');
    const bmrResult = document.getElementById('bmr-result');
    const tdeeResult = document.getElementById('tdee-result');
    const statusMessage = document.getElementById('status-message');

    // Activity level multipliers
    const activityLevels = {
        sedentary: 1.2,
        lightly: 1.375,
        moderately: 1.55,
        very: 1.725,
        extremely: 1.9
    };

    calculateBtn.addEventListener('click', function() {
        const age = parseFloat(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const gender = document.querySelector('input[name="gender"]:checked');
        const activityLevel = document.getElementById('activity-level').value;

        // Input validation
        if (!age || !weight || !height || !gender) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }

        if (age < 1 || age > 120) {
            showStatus('Please enter a valid age (1-120 years).', 'error');
            return;
        }

        if (weight < 1 || weight > 500) {
            showStatus('Please enter a valid weight (1-500 kg).', 'error');
            return;
        }

        if (height < 50 || height > 250) {
            showStatus('Please enter a valid height (50-250 cm).', 'error');
            return;
        }

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender.value === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Calculate TDEE
        const tdee = bmr * activityLevels[activityLevel];

        // Display results
        bmrResult.textContent = Math.round(bmr);
        tdeeResult.textContent = Math.round(tdee);

        resultsContainer.style.display = 'block';
        showStatus('BMR calculated successfully!', 'success');

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
    const inputs = document.querySelectorAll('input, select');
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
                                <a href="/TOOLS/BMR-Calculator/" class="tool-card active">
                                    <div class="tool-icon">🔥</div>
                                    <div class="tool-name">BMR Calculator</div>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(footer);
            });
    }
});