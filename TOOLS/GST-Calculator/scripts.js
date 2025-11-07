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

    // --- GST Calculator Logic ---
    
    // Get references to DOM elements
    const addGstBtn = document.getElementById('add-gst-btn');
    const removeGstBtn = document.getElementById('remove-gst-btn');
    const resultsContainer = document.getElementById('results-container');

    // Add click event listeners
    addGstBtn.addEventListener('click', addGst);
    removeGstBtn.addEventListener('click', removeGst);

    function addGst() {
        const baseAmount = parseFloat(document.getElementById('amount').value);
        const rate = parseFloat(document.getElementById('gst-rate').value);

        if (isNaN(baseAmount) || isNaN(rate) || baseAmount <= 0 || rate < 0) {
            alert("Please enter valid positive numbers for amount and rate.");
            return;
        }

        const gstAmount = baseAmount * (rate / 100);
        const totalAmount = baseAmount + gstAmount;

        document.getElementById('base-amount-result').textContent = '₹' + baseAmount.toFixed(2);
        document.getElementById('gst-amount-result').textContent = '₹' + gstAmount.toFixed(2);
        document.getElementById('total-amount-result').textContent = '₹' + totalAmount.toFixed(2);

        resultsContainer.style.display = 'block';
    }

    function removeGst() {
        const totalAmount = parseFloat(document.getElementById('amount').value);
        const rate = parseFloat(document.getElementById('gst-rate').value);

        if (isNaN(totalAmount) || isNaN(rate) || totalAmount <= 0 || rate <= 0) {
            alert("Please enter valid positive numbers for amount and rate.");
            return;
        }

        const baseAmount = totalAmount / (1 + (rate / 100));
        const gstAmount = totalAmount - baseAmount;

        document.getElementById('base-amount-result').textContent = '₹' + baseAmount.toFixed(2);
        document.getElementById('gst-amount-result').textContent = '₹' + gstAmount.toFixed(2);
        document.getElementById('total-amount-result').textContent = '₹' + totalAmount.toFixed(2);

        resultsContainer.style.display = 'block';
    }
});