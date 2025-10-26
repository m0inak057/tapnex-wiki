// PNG to JPG Converter Script
class PNGToJPGConverter {
    constructor() {
        this.fileInput = document.getElementById('file-input');
        this.uploadArea = document.getElementById('upload-area');
        this.previewImg = document.getElementById('preview-img');
        this.previewSection = document.getElementById('preview-section');
        this.convertBtn = document.getElementById('convert-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.statusMessage = document.getElementById('status-message');
        this.downloadSection = document.getElementById('download-section');
        this.backgroundColor = document.getElementById('background-color');
        this.qualitySlider = document.getElementById('quality-slider');
        this.qualityValue = document.getElementById('quality-value');

        this.selectedFile = null;
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

        // Convert button
        this.convertBtn.addEventListener('click', () => this.convertImage());

        // Quality slider
        this.qualitySlider.addEventListener('input', () => this.updateQualityValue());

        // Background color change
        this.backgroundColor.addEventListener('input', () => {
            if (this.selectedFile) {
                this.updatePreview();
            }
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/') || !file.type.includes('png')) {
            this.showStatus('Please select a PNG image file.', 'error');
            return;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            this.showStatus('File size too large. Maximum 50MB allowed.', 'error');
            return;
        }

        this.selectedFile = file;
        this.showStatus('Image loaded successfully!', 'success');
        this.updatePreview();
        this.convertBtn.disabled = false;
        this.downloadSection.style.display = 'none';
    }

    updatePreview() {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImg.src = e.target.result;
            this.previewSection.style.display = 'block';
        };
        reader.readAsDataURL(this.selectedFile);
    }

    updateQualityValue() {
        this.qualityValue.textContent = this.qualitySlider.value;
    }

    async convertImage() {
        if (!this.selectedFile) {
            this.showStatus('Please select a PNG image first.', 'error');
            return;
        }

        try {
            this.showStatus('Converting image...', 'info');
            this.convertBtn.disabled = true;

            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = URL.createObjectURL(this.selectedFile);
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;

            // Fill background if PNG has transparency
            ctx.fillStyle = this.backgroundColor.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the image
            ctx.drawImage(img, 0, 0);

            // Convert to JPG
            const quality = parseInt(this.qualitySlider.value) / 100;
            canvas.toBlob((blob) => {
                if (blob) {
                    this.convertedBlob = blob;
                    this.showStatus('Conversion completed successfully!', 'success');
                    this.showDownload();
                } else {
                    this.showStatus('Conversion failed. Please try again.', 'error');
                }
                this.convertBtn.disabled = false;
            }, 'image/jpeg', quality);

            // Clean up
            URL.revokeObjectURL(img.src);

        } catch (error) {
            console.error('Conversion error:', error);
            this.showStatus('An error occurred during conversion. Please try again.', 'error');
            this.convertBtn.disabled = false;
        }
    }

    showDownload() {
        const originalName = this.selectedFile.name.replace(/\.[^/.]+$/, '');
        const downloadName = `${originalName}_converted.jpg`;

        this.downloadBtn.href = URL.createObjectURL(this.convertedBlob);
        this.downloadBtn.download = downloadName;
        this.downloadBtn.textContent = `Download ${downloadName}`;
        this.downloadSection.style.display = 'block';
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message';

        // Remove existing type classes
        this.statusMessage.classList.remove('success', 'error', 'info');

        // Add type class
        if (type) {
            this.statusMessage.classList.add(type);
        }
    }
}

// Theme management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
    }

    setupThemeToggle() {
        // Theme toggle button (if exists)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PNGToJPGConverter();
    new ThemeManager();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}