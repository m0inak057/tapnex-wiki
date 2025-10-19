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
    const qrTextInput = document.getElementById('qr-text-input');
    const generateBtn = document.getElementById('generate-btn');
    const qrcodeDisplay = document.getElementById('qrcode-display');
    const downloadBtn = document.getElementById('download-btn');

    // QR Code instance
    let qrcode = null;

    // Function to generate QR code
    function generateQRCode() {
        const text = qrTextInput.value.trim();
        
        // Validate input
        if (text === '') {
            alert('Please enter some text or URL to generate a QR code');
            qrTextInput.focus();
            return;
        }

        // Clear previous QR code
        qrcodeDisplay.innerHTML = '';
        
        // Hide download button while generating
        downloadBtn.style.display = 'none';

        // Create new QR code
        qrcode = new QRCode(qrcodeDisplay, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Wait for the QR code image to be generated
        setTimeout(function() {
            const img = qrcodeDisplay.querySelector('img');
            
            if (img && img.src) {
                // Create a canvas with padding for download
                const canvas = document.createElement('canvas');
                const padding = 40; // 40px padding on all sides
                const canvasSize = 256 + (padding * 2);
                
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                
                const ctx = canvas.getContext('2d');
                
                // Fill background with white
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvasSize, canvasSize);
                
                // Draw the QR code with padding
                ctx.drawImage(img, padding, padding, 256, 256);
                
                // Convert canvas to data URL
                const paddedImageUrl = canvas.toDataURL('image/png');
                
                // Set the download link href to the padded image
                downloadBtn.href = paddedImageUrl;
                
                // Show the download button
                downloadBtn.style.display = 'inline-block';
            }
        }, 100);
    }

    // Event listeners
    generateBtn.addEventListener('click', generateQRCode);
    
    // Allow Enter key to generate QR code
    qrTextInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
});
