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
    const csvInput = document.getElementById('csv-input');
    const jsonOutput = document.getElementById('json-output');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const csvUpload = document.getElementById('csv-upload');
    const headerCheck = document.getElementById('header-check');

    // Function to handle file upload
    csvUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                csvInput.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Function to convert CSV to JSON
    function csvToJSON(csvText, hasHeader) {
        const lines = csvText.split('\n');
        const result = [];
        let headers = [];

        if (hasHeader && lines.length > 0) {
            const headerLine = lines.shift();
            headers = headerLine.split(',');
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') continue;

            const values = line.split(',');
            const obj = {};

            for (let j = 0; j < values.length; j++) {
                const key = hasHeader ? headers[j] : `col${j + 1}`;
                const value = values[j];
                obj[key] = value;
            }

            result.push(obj);
        }

        return JSON.stringify(result);
    }

    // Function to convert
    function convert() {
        const csvText = csvInput.value.trim();
        if (csvText === '') {
            alert('Please enter CSV data or upload a file.');
            return;
        }

        const hasHeader = headerCheck.checked;
        const jsonString = csvToJSON(csvText, hasHeader);
        const beautified = JSON.stringify(JSON.parse(jsonString), null, 2);
        jsonOutput.value = beautified;
    }

    // Function to copy JSON
    function copyJSON() {
        const jsonText = jsonOutput.value;
        if (jsonText === '') {
            alert('Nothing to copy. Please convert CSV first.');
            return;
        }

        navigator.clipboard.writeText(jsonText).then(function() {
            alert('JSON copied to clipboard!');
        }).catch(function(error) {
            alert('Failed to copy: ' + error.message);
        });
    }

    // Event listeners
    convertBtn.addEventListener('click', convert);
    copyBtn.addEventListener('click', copyJSON);
});