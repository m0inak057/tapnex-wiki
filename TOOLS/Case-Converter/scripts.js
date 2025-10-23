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

    // Get references to elements
    const textInput = document.getElementById('text-input');
    const upperBtn = document.getElementById('upper-btn');
    const lowerBtn = document.getElementById('lower-btn');
    const sentenceBtn = document.getElementById('sentence-btn');
    const titleBtn = document.getElementById('title-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');

    // Update character and word count
    function updateStats() {
        const text = textInput.value;
        const chars = text.length;
        const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
        
        charCount.textContent = `Characters: ${chars}`;
        wordCount.textContent = `Words: ${words}`;
    }

    // Listen for input changes
    textInput.addEventListener('input', updateStats);

    // UPPERCASE conversion
    upperBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim().length === 0) {
            alert('Please enter some text first!');
            return;
        }
        textInput.value = text.toUpperCase();
    });

    // lowercase conversion
    lowerBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim().length === 0) {
            alert('Please enter some text first!');
            return;
        }
        textInput.value = text.toLowerCase();
    });

    // Sentence case conversion
    sentenceBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim().length === 0) {
            alert('Please enter some text first!');
            return;
        }
        
        // Convert to lowercase first
        let sentenceCase = text.toLowerCase();
        
        // Capitalize first letter of the entire text
        sentenceCase = sentenceCase.charAt(0).toUpperCase() + sentenceCase.slice(1);
        
        // Capitalize first letter after sentence endings (., !, ?)
        sentenceCase = sentenceCase.replace(/([.!?]\s+)([a-z])/g, function(match, separator, letter) {
            return separator + letter.toUpperCase();
        });
        
        textInput.value = sentenceCase;
    });

    // Title Case (Proper Case) conversion
    titleBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim().length === 0) {
            alert('Please enter some text first!');
            return;
        }
        
        // Convert to lowercase first, then capitalize first letter of each word
        const titleCase = text.toLowerCase().replace(/\b\w/g, function(letter) {
            return letter.toUpperCase();
        });
        
        textInput.value = titleCase;
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        const text = textInput.value;
        
        if (text.trim().length === 0) {
            alert('No text to copy! Please enter some text first.');
            return;
        }
        
        // Copy to clipboard using modern API
        navigator.clipboard.writeText(text).then(() => {
            // Success feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            copyBtn.classList.add('copied');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            // Fallback for older browsers
            textInput.select();
            textInput.setSelectionRange(0, 99999); // For mobile devices
            
            try {
                document.execCommand('copy');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                alert('Failed to copy text. Please try selecting and copying manually.');
            }
        });
    });

    // Clear text
    clearBtn.addEventListener('click', function() {
        if (textInput.value.trim().length === 0) {
            return;
        }
        
        if (confirm('Are you sure you want to clear all text?')) {
            textInput.value = '';
            updateStats();
            textInput.focus();
        }
    });

    // Keyboard shortcuts
    textInput.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Shift + U for UPPERCASE
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'U') {
            e.preventDefault();
            upperBtn.click();
        }
        
        // Ctrl/Cmd + Shift + L for lowercase
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            lowerBtn.click();
        }
        
        // Ctrl/Cmd + Shift + S for Sentence case
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            sentenceBtn.click();
        }
        
        // Ctrl/Cmd + Shift + T for Title Case
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            titleBtn.click();
        }
    });

    // Auto-focus on textarea
    textInput.focus();
    
    // Initialize stats
    updateStats();
});
