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

    // --- Percentage Calculator Logic ---
    
    // Get references to all inputs and results
    const percInput1 = document.getElementById('perc-input1');
    const valInput1 = document.getElementById('val-input1');
    const result1 = document.getElementById('result1');

    const valInput2a = document.getElementById('val-input2a');
    const valInput2b = document.getElementById('val-input2b');
    const result2 = document.getElementById('result2');

    const valInput3a = document.getElementById('val-input3a');
    const valInput3b = document.getElementById('val-input3b');
    const result3 = document.getElementById('result3');

    // Calculator 1: What is X% of Y?
    function calculatePercentOf() {
        const percentage = parseFloat(percInput1.value);
        const value = parseFloat(valInput1.value);

        if (isNaN(percentage) || isNaN(value)) {
            result1.value = '';
            return;
        }

        const result = (percentage / 100) * value;
        result1.value = result.toFixed(2);
    }

    // Calculator 2: X is what percent of Y?
    function calculateXisWhatPercentOfY() {
        const valueX = parseFloat(valInput2a.value);
        const valueY = parseFloat(valInput2b.value);

        if (isNaN(valueX) || isNaN(valueY)) {
            result2.value = '';
            return;
        }

        if (valueY === 0) {
            result2.value = 'Error';
            return;
        }

        const result = (valueX / valueY) * 100;
        result2.value = result.toFixed(2);
    }

    // Calculator 3: Percentage Increase/Decrease
    function calculatePercentageChange() {
        const initialValue = parseFloat(valInput3a.value);
        const finalValue = parseFloat(valInput3b.value);

        if (isNaN(initialValue) || isNaN(finalValue)) {
            result3.value = '';
            return;
        }

        if (initialValue === 0) {
            result3.value = 'Error';
            return;
        }

        const result = ((finalValue - initialValue) / initialValue) * 100;
        const formattedResult = result.toFixed(2);
        
        // Add + sign for positive changes
        if (result > 0) {
            result3.value = '+' + formattedResult;
        } else {
            result3.value = formattedResult;
        }
    }

    // Add event listeners for Calculator 1
    percInput1.addEventListener('input', calculatePercentOf);
    valInput1.addEventListener('input', calculatePercentOf);

    // Add event listeners for Calculator 2
    valInput2a.addEventListener('input', calculateXisWhatPercentOfY);
    valInput2b.addEventListener('input', calculateXisWhatPercentOfY);

    // Add event listeners for Calculator 3
    valInput3a.addEventListener('input', calculatePercentageChange);
    valInput3b.addEventListener('input', calculatePercentageChange);
});
