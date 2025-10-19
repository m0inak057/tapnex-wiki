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

    // --- Image Resizer Logic ---
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const aspectRatioLock = document.getElementById('aspect-ratio-lock');
    const downloadBtn = document.getElementById('download-btn');
    const settingsArea = document.getElementById('settings');
    const resultsArea = document.getElementById('results-area');
    const originalDimensions = document.getElementById('original-dimensions');
    const previewDimensions = document.getElementById('preview-dimensions');

    let uploadedImage = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let aspectRatio = 0;

    // Handle image upload
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.match('image.*')) {
            alert('Please select a valid image file.');
            return;
        }

        // Create a new Image object to get dimensions
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
        };

        img.onload = function() {
            // Store the original image
            uploadedImage = img;
            originalWidth = img.width;
            originalHeight = img.height;
            aspectRatio = originalWidth / originalHeight;

            // Update inputs with original dimensions
            widthInput.value = originalWidth;
            heightInput.value = originalHeight;

            // Display original dimensions
            originalDimensions.textContent = `Original Dimensions: ${originalWidth} × ${originalHeight} px`;

            // Display preview
            imagePreview.src = img.src;
            previewDimensions.textContent = `Current: ${originalWidth} × ${originalHeight} px`;

            // Show settings and results
            settingsArea.style.display = 'block';
            resultsArea.style.display = 'block';

            // Scroll to settings
            settingsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        reader.readAsDataURL(file);
    });

    // Handle width input change
    widthInput.addEventListener('input', function() {
        const width = parseInt(widthInput.value);
        
        if (aspectRatioLock.checked && width && uploadedImage) {
            const newHeight = Math.round(width / aspectRatio);
            heightInput.value = newHeight;
        }
        
        updatePreview();
    });

    // Handle height input change
    heightInput.addEventListener('input', function() {
        const height = parseInt(heightInput.value);
        
        if (aspectRatioLock.checked && height && uploadedImage) {
            const newWidth = Math.round(height * aspectRatio);
            widthInput.value = newWidth;
        }
        
        updatePreview();
    });

    // Handle aspect ratio lock toggle
    aspectRatioLock.addEventListener('change', function() {
        if (this.checked && uploadedImage) {
            // Recalculate based on current width
            const width = parseInt(widthInput.value);
            if (width) {
                const newHeight = Math.round(width / aspectRatio);
                heightInput.value = newHeight;
                updatePreview();
            }
        }
    });

    // Update preview with current dimensions
    function updatePreview() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        if (width && height) {
            previewDimensions.textContent = `Current: ${width} × ${height} px`;
        }
    }

    // Handle download button click
    downloadBtn.addEventListener('click', function() {
        if (!uploadedImage) {
            alert('Please upload an image first.');
            return;
        }

        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        if (!width || !height || width < 1 || height < 1) {
            alert('Please enter valid dimensions.');
            return;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        const ctx = canvas.getContext('2d');
        ctx.drawImage(uploadedImage, 0, 0, width, height);

        // Convert to blob and download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Get original filename and add suffix
            const originalName = imageInput.files[0].name;
            const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
            const extension = originalName.split('.').pop();
            
            a.download = `${nameWithoutExt}-resized-${width}x${height}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (imagePreview.src) {
            URL.revokeObjectURL(imagePreview.src);
        }
    });
});
