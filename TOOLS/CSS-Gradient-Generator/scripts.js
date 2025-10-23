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

    // CSS Gradient Generator Logic
    const gradientPreview = document.getElementById('gradient-preview');
    const color1Input = document.getElementById('color-1');
    const color2Input = document.getElementById('color-2');
    const color1Value = document.getElementById('color-1-value');
    const color2Value = document.getElementById('color-2-value');
    const angleSlider = document.getElementById('angle-slider');
    const angleValue = document.getElementById('angle-value');
    const cssOutput = document.getElementById('css-output');
    const copyBtn = document.getElementById('copy-btn');
    const copyFullBtn = document.getElementById('copy-full-btn');
    const swapColorsBtn = document.getElementById('swap-colors-btn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const presetCards = document.querySelectorAll('.preset-card');
    const gradientTypeRadios = document.querySelectorAll('input[name="gradient-type"]');

    // Initialize the gradient
    updateGradient();

    // Function to update the gradient
    function updateGradient() {
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const angle = angleSlider.value;
        const gradientType = document.querySelector('input[name="gradient-type"]:checked').value;

        // Update color hex displays
        color1Value.textContent = color1.toUpperCase();
        color2Value.textContent = color2.toUpperCase();

        // Update angle display
        angleValue.textContent = angle;

        // Generate gradient string
        let gradientString;
        if (gradientType === 'linear') {
            gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        } else {
            gradientString = `radial-gradient(circle, ${color1}, ${color2})`;
        }

        // Update preview
        gradientPreview.style.background = gradientString;

        // Update CSS output
        cssOutput.value = `background: ${gradientString};`;
    }

    // Event listeners for color inputs
    color1Input.addEventListener('input', updateGradient);
    color2Input.addEventListener('input', updateGradient);

    // Event listener for angle slider
    angleSlider.addEventListener('input', updateGradient);

    // Event listeners for gradient type
    gradientTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateGradient);
    });

    // Event listeners for angle preset buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const angle = button.getAttribute('data-angle');
            angleSlider.value = angle;
            updateGradient();
        });
    });

    // Swap colors functionality
    swapColorsBtn.addEventListener('click', () => {
        const temp = color1Input.value;
        color1Input.value = color2Input.value;
        color2Input.value = temp;
        updateGradient();

        // Add animation
        swapColorsBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapColorsBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });

    // Copy CSS functionality
    copyBtn.addEventListener('click', () => {
        const cssCode = cssOutput.value;
        
        navigator.clipboard.writeText(cssCode).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            copyBtn.classList.add('copied');

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            copyBtn.textContent = '✗ Failed';
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy CSS';
            }, 2000);
        });
    });

    // Copy CSS with vendor prefixes
    copyFullBtn.addEventListener('click', () => {
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const angle = angleSlider.value;
        const gradientType = document.querySelector('input[name="gradient-type"]:checked').value;

        let gradientString;
        if (gradientType === 'linear') {
            gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        } else {
            gradientString = `radial-gradient(circle, ${color1}, ${color2})`;
        }

        const cssCodeWithPrefixes = `/* Fallback for older browsers */
background: ${color1};
/* Chrome 10-25, Safari 5.1-6 */
background: -webkit-${gradientString};
/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: ${gradientString};`;

        navigator.clipboard.writeText(cssCodeWithPrefixes).then(() => {
            const originalText = copyFullBtn.textContent;
            copyFullBtn.textContent = '✓ Copied with Prefixes!';
            copyFullBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            copyFullBtn.style.color = 'white';
            copyFullBtn.style.border = 'none';

            setTimeout(() => {
                copyFullBtn.textContent = originalText;
                copyFullBtn.style.background = '';
                copyFullBtn.style.color = '';
                copyFullBtn.style.border = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });

    // Preset gradient cards
    presetCards.forEach(card => {
        card.addEventListener('click', () => {
            const color1 = card.getAttribute('data-color1');
            const color2 = card.getAttribute('data-color2');
            const angle = card.getAttribute('data-angle');

            color1Input.value = color1;
            color2Input.value = color2;
            angleSlider.value = angle;

            updateGradient();

            // Scroll to preview
            gradientPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add flash effect to preview
            gradientPreview.style.borderColor = '#3b82f6';
            setTimeout(() => {
                gradientPreview.style.borderColor = '';
            }, 500);
        });
    });

    // Random gradient generator (Easter egg - press 'R' key)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
            // Generate random colors
            const randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            const randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            const randomAngle = Math.floor(Math.random() * 361);

            color1Input.value = randomColor1;
            color2Input.value = randomColor2;
            angleSlider.value = randomAngle;

            updateGradient();
        }

        // Copy shortcut (Ctrl/Cmd + C)
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement !== cssOutput) {
            e.preventDefault();
            copyBtn.click();
        }
    });

    // Add smooth transition to swap button
    swapColorsBtn.style.transition = 'transform 0.3s ease';

    // Auto-select text in output when focused
    cssOutput.addEventListener('focus', () => {
        cssOutput.select();
    });

    // Add tooltip functionality for preset cards (show colors on hover)
    presetCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const color1 = card.getAttribute('data-color1');
            const color2 = card.getAttribute('data-color2');
            const angle = card.getAttribute('data-angle');
            card.title = `${color1} → ${color2} (${angle}°)`;
        });
    });

    // Keyboard shortcuts info (press '?' to show)
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            alert(`Keyboard Shortcuts:
            
R - Generate random gradient
Ctrl/Cmd + C - Copy CSS code
Arrow Up/Down - Adjust angle (when slider focused)
Tab - Navigate between controls`);
        }
    });

    // Enhanced angle slider - arrow key support when not focused
    document.addEventListener('keydown', (e) => {
        if (document.activeElement === document.body) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                angleSlider.value = Math.max(0, parseInt(angleSlider.value) - 5);
                updateGradient();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                angleSlider.value = Math.min(360, parseInt(angleSlider.value) + 5);
                updateGradient();
            }
        }
    });

    // Add visual feedback when copying
    function addCopyFeedback(element, originalText) {
        element.textContent = '✓ Copied!';
        element.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        element.style.color = 'white';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.background = '';
            element.style.color = '';
        }, 2000);
    }

    // Add click-to-copy for color hex values
    [color1Value, color2Value].forEach(element => {
        element.style.cursor = 'pointer';
        element.title = 'Click to copy';
        
        element.addEventListener('click', () => {
            const hexCode = element.textContent;
            navigator.clipboard.writeText(hexCode).then(() => {
                const originalText = element.textContent;
                element.textContent = '✓ Copied!';
                element.style.color = '#10b981';
                
                setTimeout(() => {
                    element.textContent = originalText;
                    element.style.color = '';
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    });

    // Animate preview on gradient change
    let animationTimeout;
    const originalUpdateGradient = updateGradient;
    updateGradient = function() {
        originalUpdateGradient();
        
        clearTimeout(animationTimeout);
        gradientPreview.style.transform = 'scale(0.98)';
        
        animationTimeout = setTimeout(() => {
            gradientPreview.style.transform = 'scale(1)';
        }, 100);
    };

    gradientPreview.style.transition = 'transform 0.2s ease, border-color 0.3s ease';

    // Initialize with smooth animation
    setTimeout(() => {
        gradientPreview.style.opacity = '1';
    }, 100);
});
