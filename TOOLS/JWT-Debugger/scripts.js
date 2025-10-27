// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const theme = htmlElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Get DOM elements
    const jwtInput = document.getElementById('jwt-input');
    const headerOutput = document.getElementById('header-output');
    const payloadOutput = document.getElementById('payload-output');
    const statusBox = document.getElementById('status-box');

    // Function to decode Base64URL
    function base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        let padding = str.length % 4;
        if (padding) {
            str += '='.repeat(4 - padding);
        }
        return atob(str);
    }

    // Function to show error
    function showError(message) {
        statusBox.textContent = message;
        statusBox.style.display = 'block';
        headerOutput.textContent = '';
        payloadOutput.textContent = '';
    }

    // Function to hide error
    function hideError() {
        statusBox.style.display = 'none';
    }

    // Function to decode JWT
    function decodeJWT() {
        const token = jwtInput.value.trim();
        
        if (token === '') {
            hideError();
            headerOutput.textContent = '';
            payloadOutput.textContent = '';
            return;
        }
        
        const parts = token.split('.');
        
        if (parts.length !== 3) {
            showError("Invalid JWT: Must have 3 parts separated by dots.");
            return;
        }
        
        try {
            const header = JSON.parse(base64UrlDecode(parts[0]));
            const payload = JSON.parse(base64UrlDecode(parts[1]));
            
            headerOutput.textContent = JSON.stringify(header, null, 2);
            payloadOutput.textContent = JSON.stringify(payload, null, 2);
            
            hideError();
        } catch (e) {
            showError("Invalid JWT: Cannot decode token. " + e.message);
        }
    }

    // Event listener for input
    jwtInput.addEventListener('input', decodeJWT);
});