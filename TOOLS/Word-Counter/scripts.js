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
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const clearBtn = document.getElementById('clear-btn');

    // Function to calculate statistics
    function calculateStats() {
        const text = textInput.value;
        
        // Character count (with spaces)
        const characters = text.length;
        charCount.textContent = characters;

        // Word count
        // Split by whitespace and filter out empty strings
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = text.trim().length === 0 ? 0 : words.length;

        // Sentence count
        // Split by sentence-ending punctuation (., !, ?)
        // Filter out empty strings and count
        const sentences = text
            .split(/[.!?]+/)
            .filter(sentence => sentence.trim().length > 0);
        sentenceCount.textContent = sentences.length;

        // Paragraph count
        // Split by double newlines or single newlines followed by whitespace
        // Filter out empty paragraphs
        const paragraphs = text
            .split(/\n\n+/)
            .filter(paragraph => paragraph.trim().length > 0);
        paragraphCount.textContent = text.trim().length === 0 ? 0 : paragraphs.length;
    }

    // Function to clear all text and reset counts
    function clearAll() {
        textInput.value = '';
        wordCount.textContent = '0';
        charCount.textContent = '0';
        sentenceCount.textContent = '0';
        paragraphCount.textContent = '0';
        textInput.focus();
    }

    // Event listeners
    textInput.addEventListener('input', calculateStats);
    clearBtn.addEventListener('click', clearAll);

    // Initialize counts on page load
    calculateStats();
});
