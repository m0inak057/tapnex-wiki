document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const pdfUpload = document.getElementById('pdf-upload');
    const uploadArea = document.getElementById('upload-area');
    const optionsSection = document.getElementById('options-section');
    const fileInfo = document.getElementById('file-info');
    const splitBtn = document.getElementById('split-btn');
    const statusMessage = document.getElementById('status');
    const downloadSection = document.getElementById('download-section');
    const downloadLink = document.getElementById('download-link');
    const themeToggle = document.getElementById('theme-toggle');
    const rangeInput = document.getElementById('range-input');
    const modeRange = document.getElementById('mode-range');
    const modeAll = document.getElementById('mode-all');

    // Global variables
    let uploadedFile = null;
    let pdfDoc = null;

    // File upload handlers
    pdfUpload.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', () => pdfUpload.click());

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Mode change handlers
    modeRange.addEventListener('change', toggleRangeInput);
    modeAll.addEventListener('change', toggleRangeInput);

    // Split button handler
    splitBtn.addEventListener('click', splitPDF);

    // Theme toggle
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function() {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Handle file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            uploadedFile = file;
            loadPDF(file);
        } else {
            alert('Please select a valid PDF file.');
        }
    }

    // Handle drag over
    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        uploadArea.classList.add('dragover');
    }

    // Handle drag leave
    function handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        uploadArea.classList.remove('dragover');
    }

    // Handle drop
    function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        uploadArea.classList.remove('dragover');

        const files = Array.from(event.dataTransfer.files);
        const pdfFile = files.find(file => file.type === 'application/pdf');

        if (pdfFile) {
            uploadedFile = pdfFile;
            loadPDF(pdfFile);
        } else {
            alert('Please drop a valid PDF file.');
        }
    }

    // Load PDF and show options
    async function loadPDF(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            fileInfo.textContent = `Uploaded: ${file.name} (${pageCount} Pages)`;
            optionsSection.style.display = 'block';
            splitBtn.disabled = false;
            toggleRangeInput();
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF. Please try again.');
        }
    }

    // Toggle range input visibility
    function toggleRangeInput() {
        if (modeRange.checked) {
            rangeInput.style.display = 'block';
        } else {
            rangeInput.style.display = 'none';
        }
    }

    // Parse page range string
    function parsePageRange(rangeStr, totalPages) {
        const pages = new Set();

        // Split by comma and process each part
        const parts = rangeStr.split(',').map(part => part.trim());

        for (const part of parts) {
            if (part.includes('-')) {
                // Range like "1-5"
                const [start, end] = part.split('-').map(num => parseInt(num.trim()));
                if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= totalPages) {
                    for (let i = start; i <= end; i++) {
                        pages.add(i - 1); // Convert to 0-based
                    }
                }
            } else {
                // Single page like "3"
                const page = parseInt(part);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    pages.add(page - 1); // Convert to 0-based
                }
            }
        }

        return Array.from(pages).sort((a, b) => a - b);
    }

    // Split PDF
    async function splitPDF() {
        if (!pdfDoc || !uploadedFile) {
            alert('Please upload a PDF file first.');
            return;
        }

        try {
            // Show splitting status
            statusMessage.textContent = 'Splitting PDF...';
            statusMessage.style.display = 'block';
            downloadSection.style.display = 'none';
            splitBtn.disabled = true;

            const mode = document.querySelector('input[name="split-mode"]:checked').value;

            if (mode === 'range') {
                // Extract by range
                const rangeStr = document.getElementById('page-range').value.trim();
                if (!rangeStr) {
                    alert('Please enter a page range.');
                    statusMessage.style.display = 'none';
                    splitBtn.disabled = false;
                    return;
                }

                const pageIndices = parsePageRange(rangeStr, pdfDoc.getPageCount());
                if (pageIndices.length === 0) {
                    alert('Invalid page range. Please check your input.');
                    statusMessage.style.display = 'none';
                    splitBtn.disabled = false;
                    return;
                }

                const newPdf = await PDFLib.PDFDocument.create();
                const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
                copiedPages.forEach(page => newPdf.addPage(page));

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                downloadLink.href = url;
                downloadLink.download = 'split-pages.pdf';

            } else {
                // Extract all pages as separate PDFs in a ZIP
                const zip = new JSZip();
                const totalPages = pdfDoc.getPageCount();

                for (let i = 0; i < totalPages; i++) {
                    const newPdf = await PDFLib.PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(copiedPage);

                    const pdfBytes = await newPdf.save();
                    zip.file(`page_${i + 1}.pdf`, pdfBytes);
                }

                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(zipBlob);

                downloadLink.href = url;
                downloadLink.download = 'split-files.zip';
            }

            // Hide status and show download
            statusMessage.style.display = 'none';
            downloadSection.style.display = 'block';
            splitBtn.disabled = false;

        } catch (error) {
            console.error('Error splitting PDF:', error);
            statusMessage.textContent = 'Error splitting PDF. Please try again.';
            statusMessage.style.color = '#dc2626';
            splitBtn.disabled = false;
        }
    }

    // Clear file input after selection
    pdfUpload.addEventListener('click', function() {
        this.value = '';
    });
});