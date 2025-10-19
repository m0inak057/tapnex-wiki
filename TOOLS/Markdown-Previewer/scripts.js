document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        
        // Save theme preference
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });

    // Get references to elements
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
    const copyHtmlBtn = document.getElementById('copy-html-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Example Markdown text
    const exampleMarkdown = `# Welcome to Markdown Previewer

## What is Markdown?

Markdown is a **lightweight markup language** that you can use to add formatting elements to plaintext text documents.

### Key Features

- Easy to learn and use
- Plain text format
- Converts to HTML
- *Widely supported*

### Text Formatting

You can make text **bold**, *italic*, or ~~strikethrough~~.

You can also use \`inline code\` for technical terms.

### Code Blocks

Here's a JavaScript code example:

\`\`\`javascript
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

### Lists

**Ordered List:**
1. First item
2. Second item
3. Third item

**Unordered List:**
- Apple
- Banana
- Orange

### Links and Images

[Visit TapNex](https://tapnex.com)

### Blockquotes

> "The best way to predict the future is to invent it."
> - Alan Kay

### Tables

| Feature | Status |
|---------|--------|
| Headers | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Links | ✅ |

---

## Try It Yourself!

Edit this text or write your own Markdown to see it rendered in real-time! 🚀`;

    // Set example Markdown on load
    markdownInput.value = exampleMarkdown;

    // Configure marked options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });

    // Update preview function
    function updatePreview() {
        const markdownText = markdownInput.value;
        
        if (markdownText.trim() === '') {
            htmlOutput.innerHTML = '';
            return;
        }
        
        try {
            // Parse Markdown to HTML using marked.js
            const htmlContent = marked.parse(markdownText);
            htmlOutput.innerHTML = htmlContent;
        } catch (error) {
            htmlOutput.innerHTML = `<p style="color: #ef4444;">Error parsing Markdown: ${error.message}</p>`;
        }
    }

    // Listen for input changes
    markdownInput.addEventListener('input', updatePreview);

    // Copy Markdown button
    copyMarkdownBtn.addEventListener('click', function() {
        const markdownText = markdownInput.value;
        
        if (markdownText.trim() === '') {
            alert('No Markdown to copy! Please write something first.');
            return;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(markdownText).then(() => {
            const originalText = copyMarkdownBtn.textContent;
            copyMarkdownBtn.textContent = '✓ Copied!';
            copyMarkdownBtn.classList.add('copied');
            
            setTimeout(() => {
                copyMarkdownBtn.textContent = originalText;
                copyMarkdownBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            // Fallback
            markdownInput.select();
            try {
                document.execCommand('copy');
                const originalText = copyMarkdownBtn.textContent;
                copyMarkdownBtn.textContent = '✓ Copied!';
                copyMarkdownBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyMarkdownBtn.textContent = originalText;
                    copyMarkdownBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                alert('Failed to copy. Please select and copy manually.');
            }
        });
    });

    // Copy HTML button
    copyHtmlBtn.addEventListener('click', function() {
        const htmlContent = htmlOutput.innerHTML;
        
        if (htmlContent.trim() === '') {
            alert('No HTML to copy! Please write some Markdown first.');
            return;
        }
        
        // Copy HTML to clipboard
        navigator.clipboard.writeText(htmlContent).then(() => {
            const originalText = copyHtmlBtn.textContent;
            copyHtmlBtn.textContent = '✓ Copied!';
            copyHtmlBtn.classList.add('copied');
            
            setTimeout(() => {
                copyHtmlBtn.textContent = originalText;
                copyHtmlBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            alert('Failed to copy HTML. Please try again.');
        });
    });

    // Clear button
    clearBtn.addEventListener('click', function() {
        if (markdownInput.value.trim() === '') {
            return;
        }
        
        if (confirm('Are you sure you want to clear the editor?')) {
            markdownInput.value = '';
            htmlOutput.innerHTML = '';
            markdownInput.focus();
        }
    });

    // Keyboard shortcuts
    markdownInput.addEventListener('keydown', function(e) {
        // Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const value = this.value;
            
            // Insert tab (2 spaces)
            this.value = value.substring(0, start) + '  ' + value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
        }
        
        // Ctrl/Cmd + B for bold
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            wrapSelection('**', '**');
        }
        
        // Ctrl/Cmd + I for italic
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            wrapSelection('*', '*');
        }
        
        // Ctrl/Cmd + K for inline code
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            wrapSelection('`', '`');
        }
    });

    // Helper function to wrap selected text
    function wrapSelection(before, after) {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const value = markdownInput.value;
        const selectedText = value.substring(start, end);
        
        if (selectedText) {
            const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
            markdownInput.value = newText;
            markdownInput.selectionStart = start + before.length;
            markdownInput.selectionEnd = end + before.length;
            updatePreview();
        }
    }

    // Initial preview render
    updatePreview();
    
    // Auto-focus on textarea
    markdownInput.focus();
});
