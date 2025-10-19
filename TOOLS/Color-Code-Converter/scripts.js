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

    // ==================== COLOR CODE CONVERTER LOGIC ====================
    
    // Get references to DOM elements
    const colorPreview = document.getElementById('color-preview');
    const hexInput = document.getElementById('hex-input');
    const rgbInput = document.getElementById('rgb-input');
    const hslInput = document.getElementById('hsl-input');

    // Set initial color
    const initialColor = '#ffffff';
    hexInput.value = initialColor;
    rgbInput.value = 'rgb(255, 255, 255)';
    hslInput.value = 'hsl(0, 0%, 100%)';
    colorPreview.style.background = initialColor;

    // ==================== HELPER FUNCTIONS ====================

    /**
     * Convert HEX to RGB
     * @param {string} hex - HEX color code (e.g., "#ffffff" or "fff")
     * @returns {object|null} - {r, g, b} or null if invalid
     */
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        if (hex.length !== 6) {
            return null;
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return null;
        }
        
        return { r, g, b };
    }

    /**
     * Convert RGB to HEX
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {string} - HEX color code
     */
    function rgbToHex(r, g, b) {
        const toHex = (num) => {
            const hex = Math.round(num).toString(16).padStart(2, '0');
            return hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    /**
     * Convert RGB to HSL
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {object} - {h, s, l}
     */
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
     * Convert HSL to RGB
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {object} - {r, g, b}
     */
    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * Validate HEX color code
     * @param {string} hex - HEX color code
     * @returns {boolean}
     */
    function isValidHex(hex) {
        return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    /**
     * Validate and parse RGB color code
     * @param {string} rgb - RGB color string
     * @returns {object|null} - {r, g, b} or null if invalid
     */
    function parseRgb(rgb) {
        // Match rgb(r, g, b) or just r, g, b
        const match = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i) ||
                      rgb.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);
        
        if (!match) {
            return null;
        }

        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);

        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            return null;
        }

        return { r, g, b };
    }

    /**
     * Validate and parse HSL color code
     * @param {string} hsl - HSL color string
     * @returns {object|null} - {h, s, l} or null if invalid
     */
    function parseHsl(hsl) {
        // Match hsl(h, s%, l%) or just h, s%, l%
        const match = hsl.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i) ||
                      hsl.match(/^(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%$/);
        
        if (!match) {
            return null;
        }

        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);

        if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
            return null;
        }

        return { h, s, l };
    }

    // ==================== EVENT HANDLERS ====================

    /**
     * Handle HEX input change
     */
    hexInput.addEventListener('input', function(e) {
        const hexValue = e.target.value.trim();
        
        if (!hexValue) {
            hexInput.classList.remove('invalid');
            return;
        }

        if (isValidHex(hexValue)) {
            hexInput.classList.remove('invalid');
            
            // Convert to RGB
            const rgb = hexToRgb(hexValue);
            if (rgb) {
                // Update RGB input
                rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                rgbInput.classList.remove('invalid');
                
                // Convert to HSL
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                hslInput.classList.remove('invalid');
                
                // Update color preview
                const normalizedHex = hexValue.startsWith('#') ? hexValue : '#' + hexValue;
                colorPreview.style.background = normalizedHex;
            }
        } else {
            hexInput.classList.add('invalid');
        }
    });

    /**
     * Handle RGB input change
     */
    rgbInput.addEventListener('input', function(e) {
        const rgbValue = e.target.value.trim();
        
        if (!rgbValue) {
            rgbInput.classList.remove('invalid');
            return;
        }

        const rgb = parseRgb(rgbValue);
        
        if (rgb) {
            rgbInput.classList.remove('invalid');
            
            // Convert to HEX
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            hexInput.value = hex;
            hexInput.classList.remove('invalid');
            
            // Convert to HSL
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            hslInput.classList.remove('invalid');
            
            // Update color preview
            colorPreview.style.background = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        } else {
            rgbInput.classList.add('invalid');
        }
    });

    /**
     * Handle HSL input change
     */
    hslInput.addEventListener('input', function(e) {
        const hslValue = e.target.value.trim();
        
        if (!hslValue) {
            hslInput.classList.remove('invalid');
            return;
        }

        const hsl = parseHsl(hslValue);
        
        if (hsl) {
            hslInput.classList.remove('invalid');
            
            // Convert to RGB
            const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            rgbInput.classList.remove('invalid');
            
            // Convert to HEX
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            hexInput.value = hex;
            hexInput.classList.remove('invalid');
            
            // Update color preview
            colorPreview.style.background = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        } else {
            hslInput.classList.add('invalid');
        }
    });
});
