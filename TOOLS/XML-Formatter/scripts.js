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
    const xmlInput = document.getElementById('xml-input');
    const formatBtn = document.getElementById('format-btn');
    const minifyBtn = document.getElementById('minify-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const statusBox = document.getElementById('status-box');

    // Function to show status
    function showStatus(message, type) {
        statusBox.textContent = message;
        statusBox.className = type === 'success' ? 'status-success' : 'status-error';
        statusBox.style.display = 'block';
    }

    // Function to hide status
    function hideStatus() {
        statusBox.style.display = 'none';
    }

    // Function to format XML
    function formatXML() {
        const xmlText = xmlInput.value.trim();
        if (xmlText === '') {
            showStatus('Please enter some XML to format.', 'error');
            return;
        }

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlText, "application/xml");
            const errorNode = doc.querySelector("parsererror");
            
            if (errorNode) {
                showStatus("Invalid XML: " + errorNode.textContent, 'error');
                return;
            }

            // Pretty print using XMLSerializer with indentation
            const serializer = new XMLSerializer();
            const formatted = serializer.serializeToString(doc);
            
            // Simple indentation (basic approach)
            const indented = formatXMLString(formatted);
            
            xmlInput.value = indented;
            showStatus("XML formatted successfully!", 'success');
        } catch (error) {
            showStatus("Error formatting XML: " + error.message, 'error');
        }
    }

    // Simple XML indentation function
    function formatXMLString(xml) {
        let formatted = '';
        let indent = '';
        const tab = '  '; // 2 spaces
        
        xml.split(/>\s*</).forEach(function(node) {
            if (node.match(/^\/\w/)) {
                // closing tag
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/)) {
                // opening tag
                indent += tab;
            }
        });
        
        return formatted.substring(1, formatted.length - 3);
    }

    // Function to minify XML
    function minifyXML() {
        const xmlText = xmlInput.value.trim();
        if (xmlText === '') {
            showStatus('Please enter some XML to minify.', 'error');
            return;
        }

        try {
            const minified = xmlText.replace(/>\s*</g, '><').replace(/^\s+|\s+$/g, '');
            xmlInput.value = minified;
            showStatus("XML minified successfully!", 'success');
        } catch (error) {
            showStatus("Error minifying XML: " + error.message, 'error');
        }
    }

    // Function to copy XML
    function copyXML() {
        const xmlText = xmlInput.value;
        if (xmlText === '') {
            showStatus('Nothing to copy. Please format or minify XML first.', 'error');
            return;
        }

        navigator.clipboard.writeText(xmlText).then(function() {
            showStatus('XML copied to clipboard!', 'success');
        }).catch(function(error) {
            showStatus('Failed to copy: ' + error.message, 'error');
        });
    }

    // Function to clear
    function clearXML() {
        xmlInput.value = '';
        hideStatus();
    }

    // Event listeners
    formatBtn.addEventListener('click', formatXML);
    minifyBtn.addEventListener('click', minifyXML);
    copyBtn.addEventListener('click', copyXML);
    clearBtn.addEventListener('click', clearXML);
});