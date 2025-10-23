// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Color Palette Generator Logic
    const generateBtn = document.getElementById('generate-btn');
    const exportCssBtn = document.getElementById('export-css-btn');
    const savePaletteBtn = document.getElementById('save-palette-btn');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const savedPalettesContainer = document.getElementById('saved-palettes-container');
    const savedPalettesList = document.getElementById('saved-palettes-list');

    let currentPalette = [];

    // Generate palette on button click
    generateBtn.addEventListener('click', generatePalette);

    // Generate palette on page load
    generatePalette();

    // Generate a harmonious color palette
    function generatePalette() {
        // Generate random base hue (0-360)
        const baseHue = Math.floor(Math.random() * 360);
        
        // Generate saturation and lightness for variety
        const baseSaturation = 60 + Math.random() * 30; // 60-90%
        const baseLightness = 50 + Math.random() * 20; // 50-70%

        currentPalette = [];

        // Create 5 colors with analogous/complementary harmony
        colorSwatches.forEach((swatch, index) => {
            let hue, saturation, lightness;

            // Create harmonious color scheme
            switch(index) {
                case 0:
                    // Base color
                    hue = baseHue;
                    saturation = baseSaturation;
                    lightness = baseLightness;
                    break;
                case 1:
                    // Analogous color (30 degrees shift)
                    hue = (baseHue + 30) % 360;
                    saturation = baseSaturation - 10;
                    lightness = baseLightness - 10;
                    break;
                case 2:
                    // Complementary color (180 degrees)
                    hue = (baseHue + 180) % 360;
                    saturation = baseSaturation - 5;
                    lightness = baseLightness;
                    break;
                case 3:
                    // Triadic color (120 degrees)
                    hue = (baseHue + 120) % 360;
                    saturation = baseSaturation - 15;
                    lightness = baseLightness + 10;
                    break;
                case 4:
                    // Analogous color (-30 degrees shift)
                    hue = (baseHue - 30 + 360) % 360;
                    saturation = baseSaturation;
                    lightness = baseLightness - 15;
                    break;
            }

            // Convert HSL to HEX
            const hexColor = hslToHex(hue, saturation, lightness);
            currentPalette.push(hexColor);

            // Update the swatch
            const colorBox = swatch.querySelector('.color-box');
            const colorCode = swatch.querySelector('.color-code');
            
            colorBox.style.backgroundColor = hexColor;
            colorCode.textContent = hexColor;
        });

        // Add animation
        colorSwatches.forEach((swatch, index) => {
            swatch.style.animation = 'none';
            setTimeout(() => {
                swatch.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            }, 10);
        });
    }

    // Convert HSL to HEX
    function hslToHex(h, s, l) {
        // Normalize values
        s = s / 100;
        l = l / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        // Convert to 0-255 range
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        // Convert to HEX
        const toHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    // Copy color code to clipboard
    colorSwatches.forEach((swatch, index) => {
        const colorCode = swatch.querySelector('.color-code');
        
        colorCode.addEventListener('click', () => {
            const hexCode = colorCode.textContent;
            const originalText = hexCode;

            navigator.clipboard.writeText(hexCode).then(() => {
                // Visual feedback
                colorCode.textContent = '✓ Copied!';
                colorCode.classList.add('copied');

                setTimeout(() => {
                    colorCode.textContent = originalText;
                    colorCode.classList.remove('copied');
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                colorCode.textContent = '✗ Failed';
                setTimeout(() => {
                    colorCode.textContent = originalText;
                }, 1000);
            });
        });
    });

    // Export palette as CSS
    exportCssBtn.addEventListener('click', () => {
        const cssCode = `:root {\n${currentPalette.map((color, index) => 
            `  --color-${index + 1}: ${color};`
        ).join('\n')}\n}`;

        navigator.clipboard.writeText(cssCode).then(() => {
            const originalText = exportCssBtn.textContent;
            exportCssBtn.textContent = '✓ CSS Copied!';
            exportCssBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            exportCssBtn.style.color = 'white';
            exportCssBtn.style.border = 'none';

            setTimeout(() => {
                exportCssBtn.textContent = originalText;
                exportCssBtn.style.background = '';
                exportCssBtn.style.color = '';
                exportCssBtn.style.border = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy CSS:', err);
        });
    });

    // Save palette
    savePaletteBtn.addEventListener('click', () => {
        if (currentPalette.length === 0) return;

        // Get saved palettes from localStorage
        let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        
        // Add current palette
        savedPalettes.unshift({
            colors: [...currentPalette],
            timestamp: Date.now()
        });

        // Limit to 20 saved palettes
        if (savedPalettes.length > 20) {
            savedPalettes = savedPalettes.slice(0, 20);
        }

        // Save to localStorage
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));

        // Update UI
        displaySavedPalettes();

        // Visual feedback
        const originalText = savePaletteBtn.textContent;
        savePaletteBtn.textContent = '✓ Saved!';
        savePaletteBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        savePaletteBtn.style.color = 'white';
        savePaletteBtn.style.border = 'none';

        setTimeout(() => {
            savePaletteBtn.textContent = originalText;
            savePaletteBtn.style.background = '';
            savePaletteBtn.style.color = '';
            savePaletteBtn.style.border = '';
        }, 1500);
    });

    // Display saved palettes
    function displaySavedPalettes() {
        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        
        if (savedPalettes.length === 0) {
            savedPalettesContainer.style.display = 'none';
            return;
        }

        savedPalettesContainer.style.display = 'block';
        savedPalettesList.innerHTML = '';

        savedPalettes.forEach((palette, index) => {
            const paletteDiv = document.createElement('div');
            paletteDiv.className = 'saved-palette';
            
            const colorsDiv = document.createElement('div');
            colorsDiv.className = 'saved-palette-colors';
            
            palette.colors.forEach(color => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'saved-palette-color';
                colorDiv.style.backgroundColor = color;
                colorDiv.title = color;
                colorsDiv.appendChild(colorDiv);
            });

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'saved-palette-actions';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'saved-palette-btn';
            loadBtn.textContent = 'Load';
            loadBtn.onclick = () => loadPalette(palette.colors);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'saved-palette-btn delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deletePalette(index);

            actionsDiv.appendChild(loadBtn);
            actionsDiv.appendChild(deleteBtn);

            paletteDiv.appendChild(colorsDiv);
            paletteDiv.appendChild(actionsDiv);
            savedPalettesList.appendChild(paletteDiv);
        });
    }

    // Load saved palette
    function loadPalette(colors) {
        currentPalette = colors;
        colorSwatches.forEach((swatch, index) => {
            const colorBox = swatch.querySelector('.color-box');
            const colorCode = swatch.querySelector('.color-code');
            
            colorBox.style.backgroundColor = colors[index];
            colorCode.textContent = colors[index];
        });

        // Scroll to palette
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Delete saved palette
    function deletePalette(index) {
        if (!confirm('Are you sure you want to delete this palette?')) return;

        let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        savedPalettes.splice(index, 1);
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
        displaySavedPalettes();
    }

    // Display saved palettes on load
    displaySavedPalettes();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Spacebar to generate
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            generatePalette();
        }

        // Number keys 1-5 to copy corresponding color
        if (e.key >= '1' && e.key <= '5') {
            const index = parseInt(e.key) - 1;
            const colorCode = colorSwatches[index].querySelector('.color-code');
            colorCode.click();
        }

        // E key to export CSS
        if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
            exportCssBtn.click();
        }

        // S key to save palette
        if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            savePaletteBtn.click();
        }
    });

    // Add fadeInUp animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});
