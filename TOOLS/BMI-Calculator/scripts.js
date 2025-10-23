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

    // --- BMI Calculator Logic ---
    
    // Get references to DOM elements
    const metricRadio = document.getElementById('metric');
    const imperialRadio = document.getElementById('imperial');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsContainer = document.getElementById('results-container');
    const bmiValue = document.getElementById('bmi-value');
    const bmiStatus = document.getElementById('bmi-status');

    // Metric inputs
    const weightKg = document.getElementById('weight-kg');
    const heightCm = document.getElementById('height-cm');

    // Imperial inputs
    const weightLbs = document.getElementById('weight-lbs');
    const heightFt = document.getElementById('height-ft');
    const heightIn = document.getElementById('height-in');

    // Toggle between metric and imperial
    metricRadio.addEventListener('change', function() {
        if (this.checked) {
            metricInputs.style.display = 'block';
            imperialInputs.style.display = 'none';
            resultsContainer.style.display = 'none';
        }
    });

    imperialRadio.addEventListener('change', function() {
        if (this.checked) {
            metricInputs.style.display = 'none';
            imperialInputs.style.display = 'block';
            resultsContainer.style.display = 'none';
        }
    });

    // Calculate BMI
    calculateBtn.addEventListener('click', function() {
        let bmi = 0;
        let isValid = false;

        if (metricRadio.checked) {
            // Metric calculation
            const weight = parseFloat(weightKg.value);
            const height = parseFloat(heightCm.value);

            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                alert('Please enter valid weight and height values.');
                return;
            }

            // Convert height from cm to meters
            const heightInMeters = height / 100;
            
            // Calculate BMI: weight (kg) / (height (m))^2
            bmi = weight / (heightInMeters * heightInMeters);
            isValid = true;

        } else {
            // Imperial calculation
            const weight = parseFloat(weightLbs.value);
            const feet = parseFloat(heightFt.value) || 0;
            const inches = parseFloat(heightIn.value) || 0;

            if (isNaN(weight) || weight <= 0 || (feet === 0 && inches === 0)) {
                alert('Please enter valid weight and height values.');
                return;
            }

            // Convert height to total inches
            const totalInches = (feet * 12) + inches;

            if (totalInches <= 0) {
                alert('Please enter a valid height.');
                return;
            }

            // Calculate BMI: 703 * weight (lbs) / (height (in))^2
            bmi = 703 * weight / (totalInches * totalInches);
            isValid = true;
        }

        if (isValid) {
            // Display BMI value
            bmiValue.textContent = bmi.toFixed(1);

            // Determine weight status and color
            let status = '';
            let statusClass = '';

            if (bmi < 18.5) {
                status = 'Underweight';
                statusClass = 'underweight';
            } else if (bmi >= 18.5 && bmi < 25) {
                status = 'Normal weight';
                statusClass = 'normal';
            } else if (bmi >= 25 && bmi < 30) {
                status = 'Overweight';
                statusClass = 'overweight';
            } else {
                status = 'Obesity';
                statusClass = 'obese';
            }

            // Update status
            bmiStatus.textContent = status;
            bmiStatus.className = `bmi-status ${statusClass}`;

            // Show results
            resultsContainer.style.display = 'block';
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    // Allow Enter key to calculate
    const allInputs = [weightKg, heightCm, weightLbs, heightFt, heightIn];
    allInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBtn.click();
            }
        });
    });
});
