document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const textInput = document.getElementById('text-input');
    const generateButton = document.getElementById('generate-button');
    const copyButtons = document.querySelectorAll('.copy-button');
    const themeToggle = document.getElementById('theme-toggle');

    // Output elements
    const md5Output = document.getElementById('md5-output');
    const sha1Output = document.getElementById('sha1-output');
    const sha256Output = document.getElementById('sha256-output');
    const sha512Output = document.getElementById('sha512-output');

    // MD5 implementation (pure JavaScript)
    function md5(text) {
        // MD5 implementation
        function addUnsigned(a, b) {
            const lsw = (a & 0xFFFF) + (b & 0xFFFF);
            const msw = (a >> 16) + (b >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function leftRotate(value, amount) {
            return (value << amount) | (value >>> (32 - amount));
        }

        function F(x, y, z) { return (x & y) | (~x & z); }
        function G(x, y, z) { return (x & z) | (y & ~z); }
        function H(x, y, z) { return x ^ y ^ z; }
        function I(x, y, z) { return y ^ (x | ~z); }

        function FF(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(leftRotate(a, s), b);
        }

        function GG(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(leftRotate(a, s), b);
        }

        function HH(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(leftRotate(a, s), b);
        }

        function II(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(leftRotate(a, s), b);
        }

        function convertToWordArray(string) {
            const messageLength = string.length;
            const numberOfWordsTemp1 = messageLength + 8;
            const numberOfWordsTemp2 = (numberOfWordsTemp1 - (numberOfWordsTemp1 % 64)) / 64;
            const numberOfWords = (numberOfWordsTemp2 + 1) * 16;
            const wordArray = new Array(numberOfWords - 1);

            for (let i = 0; i < numberOfWords - 1; i++) {
                wordArray[i] = 0;
            }

            let bytePosition = 0;
            let byteCount = 0;

            while (byteCount < messageLength) {
                const count = (byteCount - (byteCount % 4)) / 4;
                bytePosition = (byteCount % 4) * 8;
                wordArray[count] = (wordArray[count] | (string.charCodeAt(byteCount) << bytePosition));
                byteCount++;
            }

            const count = (byteCount - (byteCount % 4)) / 4;
            bytePosition = (byteCount % 4) * 8;
            wordArray[count] = wordArray[count] | (0x80 << bytePosition);
            wordArray[numberOfWords - 2] = messageLength << 3;
            wordArray[numberOfWords - 1] = messageLength >>> 29;

            return wordArray;
        }

        function wordToHex(value) {
            let hex = '';
            for (let i = 0; i <= 3; i++) {
                const byte = (value >>> (i * 8)) & 255;
                hex += ('0' + byte.toString(16)).slice(-2);
            }
            return hex;
        }

        const x = convertToWordArray(text);
        let a = 0x67452301;
        let b = 0xEFCDAB89;
        let c = 0x98BADCFE;
        let d = 0x10325476;

        for (let i = 0; i < x.length; i += 16) {
            const AA = a, BB = b, CC = c, DD = d;

            a = FF(a, b, c, d, x[i + 0], 7, 0xD76AA478);
            d = FF(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
            c = FF(c, d, a, b, x[i + 2], 17, 0x242070DB);
            b = FF(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
            d = FF(d, a, b, c, x[i + 5], 12, 0x4787C62A);
            c = FF(c, d, a, b, x[i + 6], 17, 0xA8304613);
            b = FF(b, c, d, a, x[i + 7], 22, 0xFD469501);
            a = FF(a, b, c, d, x[i + 8], 7, 0x698098D8);
            d = FF(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
            a = FF(a, b, c, d, x[i + 12], 7, 0x6B901122);
            d = FF(d, a, b, c, x[i + 13], 12, 0xFD987193);
            c = FF(c, d, a, b, x[i + 14], 17, 0xA679438E);
            b = FF(b, c, d, a, x[i + 15], 22, 0x49B40821);

            a = GG(a, b, c, d, x[i + 1], 5, 0xF61E2562);
            d = GG(d, a, b, c, x[i + 6], 9, 0xC040B340);
            c = GG(c, d, a, b, x[i + 11], 14, 0x265E5A51);
            b = GG(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[i + 5], 5, 0xD62F105D);
            d = GG(d, a, b, c, x[i + 10], 9, 0x02441453);
            c = GG(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
            b = GG(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
            d = GG(d, a, b, c, x[i + 14], 9, 0xC33707D6);
            c = GG(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
            b = GG(b, c, d, a, x[i + 8], 20, 0x455A14ED);
            a = GG(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
            d = GG(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[i + 7], 14, 0x676F02D9);
            b = GG(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);

            a = HH(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
            d = HH(d, a, b, c, x[i + 8], 11, 0x8771F681);
            c = HH(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
            b = HH(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
            a = HH(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
            d = HH(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
            c = HH(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
            b = HH(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
            a = HH(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
            d = HH(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
            c = HH(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
            b = HH(b, c, d, a, x[i + 6], 23, 0x04881D05);
            a = HH(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
            d = HH(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
            c = HH(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
            b = HH(b, c, d, a, x[i + 2], 23, 0xC4AC5665);

            a = II(a, b, c, d, x[i + 0], 6, 0xF4292244);
            d = II(d, a, b, c, x[i + 7], 10, 0x432AFF97);
            c = II(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
            b = II(b, c, d, a, x[i + 5], 21, 0xFC93A039);
            a = II(a, b, c, d, x[i + 12], 6, 0x655B59C3);
            d = II(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
            c = II(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
            b = II(b, c, d, a, x[i + 1], 21, 0x85845DD1);
            a = II(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
            d = II(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
            c = II(c, d, a, b, x[i + 6], 15, 0xA3014314);
            b = II(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
            a = II(a, b, c, d, x[i + 4], 6, 0xF7537E82);
            d = II(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
            c = II(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
            b = II(b, c, d, a, x[i + 9], 21, 0xEB86D391);

            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }

        return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
    }

    // Generate crypto hash using Web Crypto API
    async function generateCryptoHash(algorithm, text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Generate all hashes
    async function generateHashes() {
        const text = textInput.value.trim();

        if (!text) {
            alert('Please enter some text to hash!');
            return;
        }

        try {
            // Generate MD5
            const md5Hash = md5(text);
            md5Output.value = md5Hash;

            // Generate SHA hashes
            const [sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
                generateCryptoHash('SHA-1', text),
                generateCryptoHash('SHA-256', text),
                generateCryptoHash('SHA-512', text)
            ]);

            sha1Output.value = sha1Hash;
            sha256Output.value = sha256Hash;
            sha512Output.value = sha512Hash;

        } catch (error) {
            console.error('Error generating hashes:', error);
            alert('Error generating hashes. Please try again.');
        }
    }

    // Copy to clipboard
    function copyToClipboard(targetId) {
        const outputElement = document.getElementById(targetId);
        const hash = outputElement.value;

        if (!hash) {
            alert('Please generate hashes first!');
            return;
        }

        navigator.clipboard.writeText(hash).then(function() {
            // Visual feedback
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = 'linear-gradient(145deg, #10b981, #059669)';

            setTimeout(function() {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy hash. Please try again.');
        });
    }

    // Generate hashes on button click
    generateButton.addEventListener('click', generateHashes);

    // Copy buttons event listeners
    copyButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const targetId = this.getAttribute('data-target');
            copyToClipboard(targetId);
        });
    });

    // Generate initial hashes if there's default text
    if (textInput.value.trim()) {
        generateHashes();
    }

    // Theme toggle functionality
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function() {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});