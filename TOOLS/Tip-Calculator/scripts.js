document.addEventListener('DOMContentLoaded', function() {
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

    // --- Tip Calculator Logic ---
    
    // Get references to DOM elements
    const billInput = document.getElementById('bill-amount');
    const tipSlider = document.getElementById('tip-percentage');
    const tipDisplay = document.getElementById('tip-percent-display');
    const peopleInput = document.getElementById('num-people');
    const resultsContainer = document.getElementById('results-container');

    // Add input event listeners
    billInput.addEventListener('input', calculateTip);
    tipSlider.addEventListener('input', function() {
        tipDisplay.textContent = tipSlider.value + '%';
        calculateTip();
    });
    peopleInput.addEventListener('input', calculateTip);

    function calculateTip() {
        const bill = parseFloat(billInput.value);
        const tipPercent = parseFloat(tipSlider.value);
        const numPeople = parseInt(peopleInput.value);

        // Validation
        if (isNaN(bill) || isNaN(tipPercent) || isNaN(numPeople) || bill <= 0 || numPeople < 1) {
            // Clear results or show subtle error
            document.getElementById('tip-amount-result').textContent = '₹0';
            document.getElementById('total-bill-result').textContent = '₹0';
            document.getElementById('total-per-person-result').textContent = '₹0';
            document.getElementById('per-person-box').style.display = 'none';
            resultsContainer.style.display = 'none';
            return;
        }

        // Calculation
        const tipAmount = bill * (tipPercent / 100);
        const totalBill = bill + tipAmount;
        const totalPerPerson = totalBill / numPeople;

        // Display Results
        document.getElementById('tip-amount-result').textContent = '₹' + tipAmount.toFixed(2);
        document.getElementById('total-bill-result').textContent = '₹' + totalBill.toFixed(2);
        document.getElementById('total-per-person-result').textContent = '₹' + totalPerPerson.toFixed(2);

        // Show/Hide Per Person
        document.getElementById('per-person-box').style.display = (numPeople > 1) ? 'flex' : 'none';

        // Show results container
        resultsContainer.style.display = 'block';
    }

    // Initial calculation on load
    calculateTip();
});