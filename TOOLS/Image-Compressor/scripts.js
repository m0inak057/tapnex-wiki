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

    // --- Image Compressor Logic ---
    const imageInput = document.getElementById('image-input');
    const originalImage = document.getElementById('original-image');
    const compressedImage = document.getElementById('compressed-image');
    const originalSize = document.getElementById('original-size');
    const compressedSize = document.getElementById('compressed-size');
    const reductionPercent = document.getElementById('reduction-percent');
    const downloadBtn = document.getElementById('download-btn');
    const resultsArea = document.getElementById('results-area');
    const statusMessage = document.getElementById('status-message');

    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    // Helper function to show status message
    function showStatus(message, type = 'loading') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message active ${type}`;
    }

    // Helper function to hide status message
    function hideStatus() {
        statusMessage.className = 'status-message';
    }

    // Handle image upload
    imageInput.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            showStatus('Please select a valid JPEG or PNG image.', 'error');
            return;
        }

        try {
            // Show loading message
            showStatus('Compressing your image...', 'loading');
            resultsArea.style.display = 'none';

            // Display original image
            const originalUrl = URL.createObjectURL(file);
            originalImage.src = originalUrl;
            originalSize.textContent = `Original Size: ${formatFileSize(file.size)}`;

            // Compression options
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: file.type
            };

            // Compress the image
            const compressedFile = await imageCompression(file, options);

            // Display compressed image
            const compressedUrl = URL.createObjectURL(compressedFile);
            compressedImage.src = compressedUrl;
            compressedSize.textContent = `Compressed Size: ${formatFileSize(compressedFile.size)}`;

            // Calculate reduction percentage
            const reduction = ((file.size - compressedFile.size) / file.size * 100).toFixed(2);
            reductionPercent.textContent = `🎉 Size reduced by ${reduction}%`;

            // Set download link
            downloadBtn.href = compressedUrl;
            
            // Determine file extension
            const fileExtension = file.type === 'image/png' ? '.png' : '.jpg';
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            downloadBtn.download = `${fileName}-compressed${fileExtension}`;

            // Show results
            resultsArea.style.display = 'block';
            showStatus('Compression complete!', 'success');
            
            // Hide status after 3 seconds
            setTimeout(() => {
                hideStatus();
            }, 3000);

        } catch (error) {
            console.error('Error compressing image:', error);
            showStatus('Error compressing image. Please try again.', 'error');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                hideStatus();
            }, 5000);
        }
    });

    // Clean up URLs when leaving the page
    window.addEventListener('beforeunload', () => {
        if (originalImage.src) {
            URL.revokeObjectURL(originalImage.src);
        }
        if (compressedImage.src) {
            URL.revokeObjectURL(compressedImage.src);
        }
    });
});
