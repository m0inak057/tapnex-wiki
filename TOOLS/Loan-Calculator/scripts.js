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

    // --- Loan EMI Calculator Logic ---
    
    // Get references to DOM elements
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsContainer = document.getElementById('results-container');

    // Add click listener to calculate button
    calculateBtn.addEventListener('click', calculateEMI);

    function calculateEMI() {
        // Get values
        const principal = parseFloat(document.getElementById('loan-amount').value);
        const annualRate = parseFloat(document.getElementById('interest-rate').value);
        const years = parseFloat(document.getElementById('loan-term').value);

        // Validation
        if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate <= 0 || years <= 0) {
            alert("Please enter valid positive numbers for all fields.");
            return;
        }

        // Calculation
        const monthlyRate = (annualRate / 100) / 12;
        const numberOfPayments = years * 12;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalPayment = emi * numberOfPayments;
        const totalInterest = totalPayment - principal;

        // Display Results
        document.getElementById('monthly-emi-result').textContent = '₹' + emi.toFixed(2);
        document.getElementById('total-interest-result').textContent = '₹' + totalInterest.toFixed(2);
        document.getElementById('total-payment-result').textContent = '₹' + totalPayment.toFixed(2);

        // Show results container
        resultsContainer.style.display = 'block';
    }
});