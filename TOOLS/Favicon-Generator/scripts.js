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

    // --- Favicon Generator Logic ---
    const imageInput = document.getElementById('image-input');
    const resultsArea = document.getElementById('results-area');
    const previewGrid = document.getElementById('preview-grid');
    const downloadBtn = document.getElementById('download-btn');

    let uploadedImage = null;

    // Standard favicon sizes
    const previewSizes = [16, 32, 48, 180];
    const allSizes = [16, 32, 48, 180, 192, 512];

    // Helper function to resize image on canvas
    function resizeImage(image, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, size, size);
        
        return canvas;
    }

    // Handle image upload
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
            alert('Please select a valid PNG or JPG image.');
            return;
        }

        // Create a FileReader to load the image
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                uploadedImage = img;
                
                // Clear previous previews
                previewGrid.innerHTML = '';
                
                // Generate previews
                previewSizes.forEach(size => {
                    const canvas = resizeImage(img, size);
                    const dataUrl = canvas.toDataURL('image/png');
                    
                    // Create preview item
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    
                    const previewImg = document.createElement('img');
                    previewImg.src = dataUrl;
                    previewImg.width = size;
                    previewImg.height = size;
                    previewImg.alt = `Favicon ${size}x${size}`;
                    
                    const previewText = document.createElement('p');
                    previewText.textContent = `${size}×${size}px`;
                    
                    previewItem.appendChild(previewImg);
                    previewItem.appendChild(previewText);
                    previewGrid.appendChild(previewItem);
                });
                
                // Show results area
                resultsArea.style.display = 'block';
                resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });

    // Handle download button click
    downloadBtn.addEventListener('click', async function() {
        if (!uploadedImage) {
            alert('Please upload an image first.');
            return;
        }

        try {
            // Show loading state
            downloadBtn.textContent = 'Generating ZIP...';
            downloadBtn.disabled = true;

            // Create a new JSZip instance
            const zip = new JSZip();

            // Generate all favicon sizes
            const promises = allSizes.map(size => {
                return new Promise((resolve) => {
                    const canvas = resizeImage(uploadedImage, size);
                    
                    canvas.toBlob((blob) => {
                        // Determine filename
                        let fileName;
                        if (size === 180) {
                            fileName = 'apple-touch-icon.png';
                        } else {
                            fileName = `favicon-${size}x${size}.png`;
                        }
                        
                        // Add to zip
                        zip.file(fileName, blob);
                        resolve();
                    }, 'image/png');
                });
            });

            // Wait for all blobs to be created
            await Promise.all(promises);

            // Generate README file
            const readmeContent = `Favicon Package
===============

This package contains favicons in multiple sizes for your website.

Files included:
- favicon-16x16.png (Standard favicon)
- favicon-32x32.png (Standard favicon)
- favicon-48x48.png (Standard favicon)
- apple-touch-icon.png (180x180 - iOS devices)
- favicon-192x192.png (Android Chrome)
- favicon-512x512.png (High resolution)

How to use:
1. Upload all PNG files to your website's root directory
2. Add the following code to your HTML <head> section:

<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">

Generated by TapNex Favicon Generator
`;

            zip.file('README.txt', readmeContent);

            // Generate the zip file
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Create download link
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'favicons.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Reset button
            downloadBtn.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Favicon Package (.zip)
            `;
            downloadBtn.disabled = false;

        } catch (error) {
            console.error('Error generating favicon package:', error);
            alert('Error generating favicon package. Please try again.');
            
            // Reset button
            downloadBtn.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Favicon Package (.zip)
            `;
            downloadBtn.disabled = false;
        }
    });
});
