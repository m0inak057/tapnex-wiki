document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        
        // Save theme preference
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });

    // Length Conversion
    const lengthFrom = document.getElementById('lengthFrom');
    const lengthTo = document.getElementById('lengthTo');
    const lengthFromUnit = document.getElementById('lengthFromUnit');
    const lengthToUnit = document.getElementById('lengthToUnit');

    // Length conversion factors (to meters)
    const lengthUnits = {
        millimeters: 0.001,
        centimeters: 0.01,
        meters: 1,
        kilometers: 1000,
        inches: 0.0254,
        feet: 0.3048,
        yards: 0.9144,
        miles: 1609.34
    };

    function convertLength() {
        const value = parseFloat(lengthFrom.value);
        if (isNaN(value) || lengthFrom.value === '') {
            lengthTo.value = '';
            return;
        }
        
        const fromUnit = lengthFromUnit.value;
        const toUnit = lengthToUnit.value;
        
        // Convert to meters first, then to target unit
        const inMeters = value * lengthUnits[fromUnit];
        const result = inMeters / lengthUnits[toUnit];
        
        lengthTo.value = formatNumber(result);
    }

    lengthFrom.addEventListener('input', convertLength);
    lengthFromUnit.addEventListener('change', convertLength);
    lengthToUnit.addEventListener('change', convertLength);

    // Weight Conversion
    const weightFrom = document.getElementById('weightFrom');
    const weightTo = document.getElementById('weightTo');
    const weightFromUnit = document.getElementById('weightFromUnit');
    const weightToUnit = document.getElementById('weightToUnit');

    // Weight conversion factors (to kilograms)
    const weightUnits = {
        milligrams: 0.000001,
        grams: 0.001,
        kilograms: 1,
        'metric-tons': 1000,
        ounces: 0.0283495,
        pounds: 0.453592,
        tons: 907.185
    };

    function convertWeight() {
        const value = parseFloat(weightFrom.value);
        if (isNaN(value) || weightFrom.value === '') {
            weightTo.value = '';
            return;
        }
        
        const fromUnit = weightFromUnit.value;
        const toUnit = weightToUnit.value;
        
        // Convert to kilograms first, then to target unit
        const inKilograms = value * weightUnits[fromUnit];
        const result = inKilograms / weightUnits[toUnit];
        
        weightTo.value = formatNumber(result);
    }

    weightFrom.addEventListener('input', convertWeight);
    weightFromUnit.addEventListener('change', convertWeight);
    weightToUnit.addEventListener('change', convertWeight);

    // Temperature Conversion
    const tempFrom = document.getElementById('tempFrom');
    const tempTo = document.getElementById('tempTo');
    const tempFromUnit = document.getElementById('tempFromUnit');
    const tempToUnit = document.getElementById('tempToUnit');

    function convertTemperature() {
        const value = parseFloat(tempFrom.value);
        if (isNaN(value) || tempFrom.value === '') {
            tempTo.value = '';
            return;
        }
        
        const fromUnit = tempFromUnit.value;
        const toUnit = tempToUnit.value;
        
        let celsius;
        
        // Convert to Celsius first
        switch(fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target unit
        let result;
        switch(toUnit) {
            case 'celsius':
                result = celsius;
                break;
            case 'fahrenheit':
                result = (celsius * 9/5) + 32;
                break;
            case 'kelvin':
                result = celsius + 273.15;
                break;
        }
        
        tempTo.value = formatNumber(result);
    }

    tempFrom.addEventListener('input', convertTemperature);
    tempFromUnit.addEventListener('change', convertTemperature);
    tempToUnit.addEventListener('change', convertTemperature);

    // Helper function to format numbers
    function formatNumber(num) {
        if (num === '' || isNaN(num)) return '';
        
        // For very small numbers, use scientific notation
        if (Math.abs(num) < 0.001 && num !== 0) {
            return num.toExponential(3);
        }
        
        // For very large numbers
        if (Math.abs(num) > 1000000) {
            return num.toExponential(3);
        }
        
        // Round to 6 decimal places and remove trailing zeros
        return parseFloat(num.toFixed(6)).toString();
    }

    // Swap functions
    window.swapLength = function() {
        const tempValue = lengthFrom.value;
        const tempUnit = lengthFromUnit.value;
        
        lengthFrom.value = lengthTo.value;
        lengthFromUnit.value = lengthToUnit.value;
        lengthToUnit.value = tempUnit;
        
        convertLength();
    };

    window.swapWeight = function() {
        const tempValue = weightFrom.value;
        const tempUnit = weightFromUnit.value;
        
        weightFrom.value = weightTo.value;
        weightFromUnit.value = weightToUnit.value;
        weightToUnit.value = tempUnit;
        
        convertWeight();
    };

    window.swapTemperature = function() {
        const tempValue = tempFrom.value;
        const tempUnit = tempFromUnit.value;
        
        tempFrom.value = tempTo.value;
        tempFromUnit.value = tempToUnit.value;
        tempToUnit.value = tempUnit;
        
        convertTemperature();
    };

    // Auto-focus on first input
    lengthFrom.focus();
});
