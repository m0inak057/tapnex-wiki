document.addEventListener('DOMContentLoaded', function() {
    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // DOM elements
    const passwordOutput = document.getElementById('password-output');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const generateButton = document.getElementById('generate-button');
    const copyButton = document.getElementById('copy-button');
    const themeToggle = document.getElementById('theme-toggle');

    // Update length display when slider moves
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
        updateSliderBackground(this);
    });

    // Update slider background color based on value
    function updateSliderBackground(slider) {
        const min = slider.min || 8;
        const max = slider.max || 32;
        const value = slider.value;
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #334155 ${percentage}%, #334155 100%)`;
    }

    // Initialize slider background
    updateSliderBackground(lengthSlider);

    // Generate password
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const useUppercase = uppercaseCheck.checked;
        const useLowercase = lowercaseCheck.checked;
        const useNumbers = numbersCheck.checked;
        const useSymbols = symbolsCheck.checked;

        // Validation: at least one character type must be selected
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            alert('Please select at least one character type!');
            return;
        }

        // Build character pool
        let charPool = '';
        const requiredChars = [];

        if (useUppercase) {
            charPool += uppercase;
            requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
        }
        if (useLowercase) {
            charPool += lowercase;
            requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
        }
        if (useNumbers) {
            charPool += numbers;
            requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
        }
        if (useSymbols) {
            charPool += symbols;
            requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }

        // Generate random password
        let password = '';
        const remainingLength = length - requiredChars.length;

        // Add random characters from pool
        for (let i = 0; i < remainingLength; i++) {
            password += charPool[Math.floor(Math.random() * charPool.length)];
        }

        // Add required characters
        password += requiredChars.join('');

        // Shuffle the password to randomize position of required characters
        password = shuffleString(password);

        // Display password
        passwordOutput.value = password;
    }

    // Shuffle string helper function
    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    // Copy to clipboard
    function copyToClipboard() {
        const password = passwordOutput.value;
        
        if (!password) {
            alert('Please generate a password first!');
            return;
        }

        navigator.clipboard.writeText(password).then(function() {
            // Visual feedback
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            copyButton.style.background = 'linear-gradient(145deg, #10b981, #059669)';
            
            setTimeout(function() {
                copyButton.textContent = originalText;
                copyButton.style.background = '';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy password. Please try again.');
        });
    }

    // Generate password on button click
    generateButton.addEventListener('click', generatePassword);

    // Copy password on button click
    copyButton.addEventListener('click', copyToClipboard);

    // Generate initial password on load
    generatePassword();

    // Theme toggle functionality
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function() {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
