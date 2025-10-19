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

    // Lorem Ipsum Generator
    const paragraphCountInput = document.getElementById('paragraph-count');
    const generateBtn = document.getElementById('generate-btn');
    const loremIpsumOutput = document.getElementById('lorem-ipsum-output');
    const copyBtn = document.getElementById('copy-btn');

    // Lorem Ipsum sentences array
    const loremSentences = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Curabitur pretium tincidunt lacus.",
        "Nulla gravida orci a odio.",
        "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
        "Integer in mauris eu nibh euismod gravida.",
        "Duis ac tellus et risus vulputate vehicula.",
        "Donec lobortis risus a elit.",
        "Etiam tempor elit vitae augue.",
        "Integer nec odio praesent libero.",
        "Sed cursus ante dapibus diam.",
        "Sed nisi nulla quis sem at nibh elementum imperdiet.",
        "Duis sagittis ipsum praesent mauris.",
        "Fusce nec tellus sed augue semper porta.",
        "Mauris massa vestibulum lacinia arcu eget nulla.",
        "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
        "Curabitur sodales ligula in libero sed dignissim lacinia nunc.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Proin pharetra nonummy pede mauris in erat.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
        "Aliquam porttitor mauris sit amet orci aenean dignissim pellentesque felis.",
        "Morbi in sem quis dui placerat ornare pellentesque odio.",
        "Praesent dapibus neque id cursus faucibus tortor neque egestas augue eu vulputate magna eros eu erat.",
        "Aliquam erat volutpat nam dui mi tincidunt quis accumsan porttitor facilisis luctus metus.",
        "Phasellus ultrices nulla quis nibh quisque a lectus.",
        "Donec consectetuer ligula vulputate sem tristique cursus.",
        "Nam nulla quam gravida non commodo a sodales sit amet nisi.",
        "Suspendisse potenti nullam ac tortor vitae purus faucibus ornare.",
        "Praesent vestibulum molestie lacus aenean nonummy hendrerit mauris.",
        "Phasellus porta fusce suscipit varius mi.",
        "Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus.",
        "Nulla dui fusce feugiat malesuada odio morbi nunc odio gravida at cursus nec luctus a lorem.",
        "Maecenas tristique orci ac sem dapibus ultrices in lectus.",
        "Phasellus viverra nulla ut metus varius laoreet.",
        "Quisque rutrum aenean imperdiet etiam ultricies nisi vel augue.",
        "Vivamus consectetuer hendrerit lacus cras non dolor.",
        "Vivamus in erat ut urna cursus vestibulum.",
        "Fusce commodo aliquam arcu nam commodo suscipit quam.",
        "Nunc ullamcorper velit in arcu ultricies malesuada.",
        "Donec venenatis vulputate lorem morbi nec metus.",
        "Suspendisse enim turpis dictum sed iaculis a condimentum nec nisi.",
        "Praesent nonummy mi in odio nunc interdum lacus sit amet orci.",
        "Vestibulum rutrum mi nec elementum vehicula eros quam gravida nisl.",
        "Sed dignissim lacinia nunc curabitur tortor pellentesque nibh.",
        "Aenean quam in scelerisque sem at dolor maecenas mattis.",
        "Sed convallis tristique sem fusce ultricies tellus sed lectus."
    ];

    // Generate Lorem Ipsum paragraphs
    function generateLoremIpsum(paragraphCount) {
        const paragraphs = [];
        
        for (let i = 0; i < paragraphCount; i++) {
            // Random number of sentences per paragraph (between 3 and 7)
            const sentenceCount = Math.floor(Math.random() * 5) + 3;
            const paragraph = [];
            
            for (let j = 0; j < sentenceCount; j++) {
                // Get random sentence
                const randomIndex = Math.floor(Math.random() * loremSentences.length);
                paragraph.push(loremSentences[randomIndex]);
            }
            
            paragraphs.push(paragraph.join(' '));
        }
        
        return paragraphs;
    }

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        const paragraphCount = parseInt(paragraphCountInput.value);
        
        // Validate input
        if (isNaN(paragraphCount) || paragraphCount < 1 || paragraphCount > 50) {
            alert('Please enter a number between 1 and 50');
            return;
        }
        
        // Clear previous output
        loremIpsumOutput.innerHTML = '';
        
        // Generate paragraphs
        const paragraphs = generateLoremIpsum(paragraphCount);
        
        // Create and append paragraph elements
        paragraphs.forEach(paragraphText => {
            const p = document.createElement('p');
            p.textContent = paragraphText;
            loremIpsumOutput.appendChild(p);
        });
        
        // Show copy button
        copyBtn.style.display = 'flex';
        copyBtn.textContent = '📋 Copy to Clipboard';
        copyBtn.classList.remove('copied');
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        const textToCopy = loremIpsumOutput.innerText;
        
        if (!textToCopy) {
            alert('No text to copy! Generate some Lorem Ipsum first.');
            return;
        }
        
        // Copy to clipboard using modern API
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Success feedback
            copyBtn.textContent = '✓ Copied!';
            copyBtn.classList.add('copied');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy to Clipboard';
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                copyBtn.textContent = '✓ Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy to Clipboard';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                alert('Failed to copy text. Please try selecting and copying manually.');
            }
            
            document.body.removeChild(textArea);
        });
    });

    // Allow Enter key to generate
    paragraphCountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    // Auto-focus on input
    paragraphCountInput.focus();
});
