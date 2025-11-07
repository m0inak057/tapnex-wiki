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
    const csvOutput = document.getElementById('csv-output');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const jsonUpload = document.getElementById('json-upload');

    // Function to handle file upload
    jsonUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                jsonInput.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Function to convert JSON to CSV
    function jsonToCSV(jsonData) {
        if (!Array.isArray(jsonData)) {
            jsonData = [jsonData];
        }
        
        if (jsonData.length === 0) {
            return '';
        }
        
        const headers = Object.keys(jsonData[0]);
        let csv = headers.join(',') + '\n';
        
        jsonData.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Handle values that contain commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                    return '"' + value.replace(/"/g, '""') + '"';
                }
                return value;
            });
            csv += values.join(',') + '\n';
        });
        
        return csv;
    }

    // Function to convert
    function convert() {
        const jsonText = jsonInput.value.trim();
        if (jsonText === '') {
            alert('Please enter JSON data or upload a file.');
            return;
        }
        
        try {
            const data = JSON.parse(jsonText);
            const csvString = jsonToCSV(data);
            csvOutput.value = csvString;
        } catch (error) {
            alert('Invalid JSON: ' + error.message);
        }
    }

    // Function to copy CSV
    function copyCSV() {
        const csvText = csvOutput.value;
        if (csvText === '') {
            alert('Nothing to copy. Please convert JSON first.');
            return;
        }

        navigator.clipboard.writeText(csvText).then(function() {
            alert('CSV copied to clipboard!');
        }).catch(function(error) {
            alert('Failed to copy: ' + error.message);
        });
    }

    // Function to download CSV
    function downloadCSV() {
        const csvText = csvOutput.value;
        if (csvText === '') {
            alert('Nothing to download. Please convert JSON first.');
            return;
        }

        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'converted.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event listeners
    convertBtn.addEventListener('click', convert);
    copyBtn.addEventListener('click', copyCSV);
    downloadBtn.addEventListener('click', downloadCSV);
});