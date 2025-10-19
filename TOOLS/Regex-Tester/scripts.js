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
    const regexPattern = document.getElementById('regex-pattern');
    const regexFlags = document.getElementById('regex-flags');
    const testStringInput = document.getElementById('test-string-input');
    const regexError = document.getElementById('regex-error');
    const resultsOutput = document.getElementById('results-output');
    const matchCount = document.getElementById('match-count');
    const copyRegexBtn = document.getElementById('copy-regex-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Example data
    const examplePattern = '\\b[A-Z][a-z]+\\b';
    const exampleFlags = 'g';
    const exampleText = `The Quick Brown Fox Jumps Over The Lazy Dog.
JavaScript is a programming Language.
Regular Expressions are Powerful Tools for Text Processing.`;

    // Set example data
    regexPattern.value = examplePattern;
    regexFlags.value = exampleFlags;
    testStringInput.value = exampleText;

    // Main test function
    function runTest() {
        const pattern = regexPattern.value;
        const flags = regexFlags.value;
        const testString = testStringInput.value;

        // Clear previous error
        regexError.textContent = '';
        resultsOutput.classList.remove('no-matches');

        // If pattern is empty, show empty state
        if (!pattern) {
            resultsOutput.innerHTML = '';
            matchCount.textContent = '0 matches';
            return;
        }

        // Validate and create RegExp
        let regex;
        try {
            regex = new RegExp(pattern, flags);
        } catch (error) {
            // Display error message
            regexError.textContent = `Invalid RegEx: ${error.message}`;
            resultsOutput.innerHTML = '';
            matchCount.textContent = '0 matches';
            return;
        }

        // If test string is empty
        if (!testString) {
            resultsOutput.innerHTML = 'Enter some text to test...';
            matchCount.textContent = '0 matches';
            return;
        }

        // Find all matches
        const matches = testString.match(regex);
        const matchesFound = matches ? matches.length : 0;

        // Update match count
        matchCount.textContent = `${matchesFound} ${matchesFound === 1 ? 'match' : 'matches'}`;

        // If no matches found
        if (!matches || matches.length === 0) {
            resultsOutput.classList.add('no-matches');
            resultsOutput.innerHTML = '';
            return;
        }

        // Highlight matches in the test string
        let highlightedText = testString;
        
        // Use replace with a global regex to wrap all matches in <mark> tags
        highlightedText = highlightedText.replace(regex, function(match) {
            // Escape HTML to prevent XSS
            const escapedMatch = escapeHtml(match);
            return `<mark>${escapedMatch}</mark>`;
        });

        // Set the innerHTML with highlighted matches
        resultsOutput.innerHTML = highlightedText;
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add event listeners
    regexPattern.addEventListener('input', runTest);
    regexFlags.addEventListener('input', runTest);
    testStringInput.addEventListener('input', runTest);

    // Copy RegEx button
    copyRegexBtn.addEventListener('click', function() {
        const pattern = regexPattern.value;
        const flags = regexFlags.value;

        if (!pattern) {
            alert('No RegEx pattern to copy!');
            return;
        }

        const regexString = `/${pattern}/${flags}`;

        // Copy to clipboard
        navigator.clipboard.writeText(regexString).then(() => {
            const originalText = copyRegexBtn.textContent;
            copyRegexBtn.textContent = '✓ Copied!';
            copyRegexBtn.classList.add('copied');

            setTimeout(() => {
                copyRegexBtn.textContent = originalText;
                copyRegexBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = regexString;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                const originalText = copyRegexBtn.textContent;
                copyRegexBtn.textContent = '✓ Copied!';
                copyRegexBtn.classList.add('copied');

                setTimeout(() => {
                    copyRegexBtn.textContent = originalText;
                    copyRegexBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                alert('Failed to copy. Please try again.');
            }

            document.body.removeChild(textArea);
        });
    });

    // Clear all button
    clearAllBtn.addEventListener('click', function() {
        if (!regexPattern.value && !testStringInput.value) {
            return;
        }

        if (confirm('Clear all fields?')) {
            regexPattern.value = '';
            regexFlags.value = '';
            testStringInput.value = '';
            regexError.textContent = '';
            resultsOutput.innerHTML = '';
            resultsOutput.classList.remove('no-matches');
            matchCount.textContent = '0 matches';
            regexPattern.focus();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to run test (already runs automatically, but good for emphasis)
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            runTest();
        }

        // Escape to clear error
        if (e.key === 'Escape' && regexError.textContent) {
            regexError.textContent = '';
        }
    });

    // Auto-focus on pattern input
    regexPattern.focus();

    // Run initial test
    runTest();
});
