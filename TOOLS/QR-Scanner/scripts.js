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
    const startScanBtn = document.getElementById('start-scan-btn');
    const scanResult = document.getElementById('scan-result');
    const copyBtn = document.getElementById('copy-btn');

    let html5QrCode = null;

    // Function to start scanning
    startScanBtn.addEventListener('click', function() {
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                html5QrCode = null;
                startScanBtn.textContent = 'Start Camera Scan';
            }).catch(err => console.error(err));
            return;
        }

        html5QrCode = new Html5Qrcode("qr-reader");

        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            scanResult.value = decodedText;
            copyBtn.style.display = 'inline-block';
            html5QrCode.stop().then(() => {
                html5QrCode = null;
                startScanBtn.textContent = 'Start Camera Scan';
            }).catch(err => console.error(err));
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
            .then(() => {
                startScanBtn.textContent = 'Stop Scanning';
            })
            .catch(err => {
                console.error("Unable to start scanning", err);
                alert("Unable to start scanning. Please ensure camera permissions are granted.");
            });
    });

    // Function to copy result
    copyBtn.addEventListener('click', function() {
        const resultText = scanResult.value;
        if (resultText === '') {
            alert('Nothing to copy.');
            return;
        }

        navigator.clipboard.writeText(resultText).then(function() {
            alert('Result copied to clipboard!');
        }).catch(function(error) {
            alert('Failed to copy: ' + error.message);
        });
    });
});