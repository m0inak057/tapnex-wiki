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

    // ==================== BASE64 ENCODER/DECODER LOGIC ====================
    
    // Get references to DOM elements
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    /**
     * Encode the input text to Base64 using btoa()
     */
    encodeBtn.addEventListener('click', function() {
        const inputValue = textInput.value;
        
        if (!inputValue.trim()) {
            textOutput.value = '';
            return;
        }

        try {
            const encoded = btoa(inputValue);
            textOutput.value = encoded;
        } catch (error) {
            textOutput.value = 'Error: Unable to encode. The input may contain characters outside the Latin1 range.';
            console.error('Encoding error:', error);
        }
    });

    /**
     * Decode the input text from Base64 using atob()
     */
    decodeBtn.addEventListener('click', function() {
        const inputValue = textInput.value;
        
        if (!inputValue.trim()) {
            textOutput.value = '';
            return;
        }

        try {
            const decoded = atob(inputValue);
            textOutput.value = decoded;
        } catch (error) {
            textOutput.value = 'Error: Invalid Base64 string.';
            console.error('Decoding error:', error);
        }
    });

    /**
     * Copy the output to clipboard
     */
    copyBtn.addEventListener('click', function() {
        const outputValue = textOutput.value;
        
        if (!outputValue.trim()) {
            showFeedback(copyBtn, '⚠️ Nothing to copy');
            return;
        }

        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(outputValue)
                .then(() => {
                    showFeedback(copyBtn, '✓ Copied!');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    fallbackCopy(outputValue);
                });
        } else {
            // Fallback for older browsers
            fallbackCopy(outputValue);
        }
    });

    /**
     * Fallback copy method for older browsers
     */
    function fallbackCopy(text) {
        textOutput.select();
        textOutput.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            showFeedback(copyBtn, '✓ Copied!');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showFeedback(copyBtn, '✗ Copy failed');
        }
    }

    /**
     * Show temporary feedback on button
     */
    function showFeedback(button, message) {
        const originalHTML = button.innerHTML;
        button.innerHTML = message;
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 2000);
    }

    /**
     * Clear both input and output textareas
     */
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        textOutput.value = '';
        textInput.focus();
    });

    // Optional: Allow Enter key to encode (with Ctrl/Cmd)
    textInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            encodeBtn.click();
        }
    });

    // Optional: Auto-focus on input field
    textInput.focus();
});
