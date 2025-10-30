class ImageToWebPConverter {
    constructor() {
        this.fileInput = document.getElementById('file-input');
        this.uploadArea = document.getElementById('upload-area');
        this.previewImg = document.getElementById('preview-img');
        this.qualitySlider = document.getElementById('quality-slider');
        this.qualityValue = document.getElementById('quality-value');
        this.convertBtn = document.getElementById('convert-btn');
        this.statusMessage = document.getElementById('status-message');
        this.downloadSection = document.getElementById('download-section');
        this.downloadBtn = document.getElementById('download-btn');

        this.currentFile = null;
        this.convertedBlob = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateQualityValue();
    }

    setupEventListeners() {
        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Upload area click
        this.uploadArea.addEventListener('click', () => this.fileInput.click());

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Quality slider
        this.qualitySlider.addEventListener('input', () => this.updateQualityValue());

        // Convert button
        this.convertBtn.addEventListener('click', () => this.convertImage());

        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        // Validate file type
        if (!file.type.match('image/(jpeg|jpg|png)')) {
            this.showStatus('Please select a JPG or PNG image file.', 'error');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showStatus('File size must be less than 10MB.', 'error');
            return;
        }

        this.currentFile = file;
        this.previewImage(file);
        this.convertBtn.disabled = false;
        this.showStatus('Image loaded successfully. Adjust quality and click Convert.', 'success');
    }

    previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImg.src = e.target.result;
            this.previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    updateQualityValue() {
        this.qualityValue.textContent = this.qualitySlider.value;
    }

    async convertImage() {
        if (!this.currentFile) {
            this.showStatus('Please select an image first.', 'error');
            return;
        }

        try {
            this.convertBtn.disabled = true;
            this.showStatus('Converting image to WebP...', 'info');

            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = URL.createObjectURL(this.currentFile);
            });

            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image to canvas
            ctx.drawImage(img, 0, 0);

            // Convert to WebP
            const quality = parseFloat(this.qualitySlider.value);
            const webpDataUrl = canvas.toDataURL('image/webp', quality);

            // Convert data URL to blob
            this.convertedBlob = this.dataURLToBlob(webpDataUrl);

            // Create download link
            const originalName = this.currentFile.name.replace(/\.(jpg|jpeg|png)$/i, '');
            const downloadName = `${originalName}.webp`;

            this.downloadBtn.href = webpDataUrl;
            this.downloadBtn.download = downloadName;
            this.downloadBtn.textContent = `Download ${downloadName}`;

            this.downloadSection.style.display = 'block';
            this.showStatus(`Successfully converted to WebP! File size: ${this.formatFileSize(this.convertedBlob.size)}`, 'success');

            // Clean up
            URL.revokeObjectURL(img.src);

        } catch (error) {
            console.error('Conversion error:', error);
            this.showStatus('Error converting image. Please try again.', 'error');
        } finally {
            this.convertBtn.disabled = false;
        }
    }

    dataURLToBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    downloadImage() {
        // Track download (optional analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'webp_conversion_download', {
                event_category: 'tools',
                event_label: 'image_to_webp'
            });
        }
    }

    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message';

        // Remove existing type classes
        this.statusMessage.classList.remove('error', 'success', 'info');

        // Add new type class
        this.statusMessage.classList.add(type);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageToWebPConverter();
});

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save theme preference
    localStorage.setItem('theme', newTheme);

    // Update theme toggle button if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
});

// Mobile navigation toggle
function toggleMobileNav() {
    const dropdownNav = document.querySelector('.dropdown-nav');
    if (dropdownNav) {
        dropdownNav.classList.toggle('open');
    }
}