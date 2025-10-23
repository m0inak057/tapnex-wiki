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

    // Text Reverser Logic
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');
    const reverseBtn = document.getElementById('reverse-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const inputCount = document.getElementById('input-count');
    const outputCount = document.getElementById('output-count');
    const reverseTypeRadios = document.querySelectorAll('input[name="reverse-type"]');

    // Update character count for input
    textInput.addEventListener('input', () => {
        inputCount.textContent = textInput.value.length;
    });

    // Reverse text function
    function reverseText() {
        const inputText = textInput.value;
        
        if (!inputText.trim()) {
            textOutput.value = '';
            outputCount.textContent = '0';
            return;
        }

        const reverseType = document.querySelector('input[name="reverse-type"]:checked').value;
        let reversedText = '';

        switch(reverseType) {
            case 'characters':
                // Reverse every character
                reversedText = inputText.split('').reverse().join('');
                break;
            
            case 'words':
                // Reverse word order
                reversedText = inputText.split(' ').reverse().join(' ');
                break;
            
            case 'lines':
                // Reverse line order
                reversedText = inputText.split('\n').reverse().join('\n');
                break;
            
            default:
                reversedText = inputText.split('').reverse().join('');
        }

        textOutput.value = reversedText;
        outputCount.textContent = reversedText.length;

        // Add animation effect
        textOutput.style.animation = 'none';
        setTimeout(() => {
            textOutput.style.animation = 'fadeIn 0.3s ease';
        }, 10);
    }

    // Reverse button click event
    reverseBtn.addEventListener('click', reverseText);

    // Copy output to clipboard
    copyBtn.addEventListener('click', () => {
        const outputText = textOutput.value;

        if (!outputText) {
            alert('Nothing to copy! Please reverse some text first.');
            return;
        }

        navigator.clipboard.writeText(outputText).then(() => {
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
                copyBtn.textContent = '📋 Copy Output';
            }, 2000);
        });
    });

    // Clear both text areas
    clearBtn.addEventListener('click', () => {
        if (textInput.value || textOutput.value) {
            if (confirm('Clear all text?')) {
                textInput.value = '';
                textOutput.value = '';
                inputCount.textContent = '0';
                outputCount.textContent = '0';
                textInput.focus();
            }
        }
    });

    // Auto-reverse when reverse type changes
    reverseTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (textInput.value) {
                reverseText();
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Enter key to reverse (when input is focused or Ctrl/Cmd+Enter anywhere)
        if (e.key === 'Enter' && (document.activeElement === textInput || e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            reverseText();
        }

        // Escape key to clear
        if (e.key === 'Escape') {
            e.preventDefault();
            textInput.value = '';
            textOutput.value = '';
            inputCount.textContent = '0';
            outputCount.textContent = '0';
            textInput.focus();
        }

        // Ctrl/Cmd + K to clear (alternative)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            clearBtn.click();
        }
    });

    // Add fadeIn animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-focus input on page load
    textInput.focus();

    // Add visual feedback for selected reverse type
    const optionLabels = document.querySelectorAll('.option-label');
    optionLabels.forEach(label => {
        label.addEventListener('click', () => {
            optionLabels.forEach(l => l.style.borderWidth = '2px');
            label.style.borderWidth = '3px';
        });
    });

    // Initialize selected option style
    const selectedOption = document.querySelector('input[name="reverse-type"]:checked').closest('.option-label');
    if (selectedOption) {
        selectedOption.style.borderWidth = '3px';
    }

    // Add smooth scroll to output after reversal
    reverseBtn.addEventListener('click', () => {
        setTimeout(() => {
            if (textOutput.value) {
                textOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    });

    // Double-click output to select all
    textOutput.addEventListener('dblclick', () => {
        textOutput.select();
    });

    // Show helpful tip on first visit
    if (!localStorage.getItem('textReverserVisited')) {
        setTimeout(() => {
            const showTips = confirm('Welcome to Text Reverser!\n\nKeyboard Shortcuts:\n• Enter - Reverse text\n• Escape - Clear all\n• Ctrl/Cmd+Enter - Reverse from anywhere\n\nWould you like to see this again?');
            
            if (!showTips) {
                localStorage.setItem('textReverserVisited', 'true');
            }
        }, 1000);
    }

    // Add placeholder examples that cycle
    const placeholders = [
        'Enter text to reverse...',
        'Try: Hello World',
        'Try: racecar (palindrome)',
        'Try multiple lines!',
        'Works with emojis too! 😀🎉'
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
        if (!textInput.value && document.activeElement !== textInput) {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            textInput.placeholder = placeholders[placeholderIndex];
        }
    }, 5000);

    // Add word count alongside character count
    function updateWordCount() {
        const text = textInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = textInput.value.length;
        
        inputCount.parentElement.innerHTML = `<span id="input-count">${chars}</span> characters · ${words} words`;
        inputCount = document.getElementById('input-count'); // Update reference
    }

    textInput.addEventListener('input', updateWordCount);

    // Add animation to reverse button on hover
    reverseBtn.addEventListener('mouseenter', () => {
        reverseBtn.style.transform = 'scale(1.02)';
    });

    reverseBtn.addEventListener('mouseleave', () => {
        reverseBtn.style.transform = 'scale(1)';
    });

    // Add ripple effect to buttons
    [reverseBtn, copyBtn, clearBtn].forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.width = ripple.style.height = '100px';
            ripple.style.left = e.clientX - this.offsetLeft - 50 + 'px';
            ripple.style.top = e.clientY - this.offsetTop - 50 + 'px';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});
