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
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const formatBtn = document.getElementById('format-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const statusMessage = document.getElementById('status-message');

    // Function to apply syntax highlighting to JSON string
    function syntaxHighlight(json) {
        // Replace special characters for HTML
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Apply syntax highlighting with regex
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    // It's a key
                    cls = 'json-key';
                } else {
                    // It's a string value
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    // Function to format and validate JSON
    function formatJSON() {
        const rawJSON = jsonInput.value.trim();
        
        // Clear previous status and output
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';
        jsonOutput.innerHTML = '';
        
        if (rawJSON === '') {
            statusMessage.className = 'status-message error';
            statusMessage.textContent = '⚠️ Please enter some JSON to format';
            return;
        }
        
        try {
            // Parse the JSON
            const parsed = JSON.parse(rawJSON);
            
            // Stringify with indentation
            const formatted = JSON.stringify(parsed, null, 4);
            
            // Apply syntax highlighting
            const highlighted = syntaxHighlight(formatted);
            
            // Display the formatted JSON
            jsonOutput.innerHTML = highlighted;
            
            // Show success message
            statusMessage.className = 'status-message success';
            statusMessage.textContent = '✓ Valid JSON - Successfully formatted';
            
        } catch (error) {
            // Show error message
            statusMessage.className = 'status-message error';
            statusMessage.textContent = '✗ Invalid JSON: ' + error.message;
            jsonOutput.textContent = '';
        }
    }

    // Function to copy formatted JSON to clipboard
    function copyJSON() {
        const textToCopy = jsonOutput.textContent;
        
        if (textToCopy === '' || textToCopy === 'Formatted JSON will appear here...') {
            statusMessage.className = 'status-message error';
            statusMessage.textContent = '⚠️ Nothing to copy. Please format JSON first.';
            return;
        }
        
        navigator.clipboard.writeText(textToCopy).then(function() {
            // Show success feedback
            const originalText = statusMessage.textContent;
            const originalClass = statusMessage.className;
            
            statusMessage.className = 'status-message success';
            statusMessage.textContent = '✓ Copied to clipboard!';
            
            // Restore original message after 2 seconds
            setTimeout(function() {
                statusMessage.className = originalClass;
                statusMessage.textContent = originalText;
            }, 2000);
        }).catch(function(error) {
            statusMessage.className = 'status-message error';
            statusMessage.textContent = '✗ Failed to copy: ' + error.message;
        });
    }

    // Function to clear all fields
    function clearAll() {
        jsonInput.value = '';
        jsonOutput.innerHTML = '';
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';
        jsonInput.focus();
    }

    // Event listeners
    formatBtn.addEventListener('click', formatJSON);
    copyBtn.addEventListener('click', copyJSON);
    clearBtn.addEventListener('click', clearAll);
    
    // Allow Ctrl/Cmd + Enter to format
    jsonInput.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            formatJSON();
        }
    });
});
