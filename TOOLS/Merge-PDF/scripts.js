document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const pdfUpload = document.getElementById('pdf-upload');
    const uploadArea = document.getElementById('upload-area');
    const fileListSection = document.getElementById('file-list-section');
    const fileList = document.getElementById('file-list');
    const mergeBtn = document.getElementById('merge-btn');
    const statusMessage = document.getElementById('status');
    const downloadSection = document.getElementById('download-section');
    const downloadLink = document.getElementById('download-link');
    const themeToggle = document.getElementById('theme-toggle');

    // Global variables
    let pdfFiles = [];
    let draggedElement = null;

    // File upload handlers
    pdfUpload.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', () => pdfUpload.click());

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Merge button handler
    mergeBtn.addEventListener('click', mergePDFs);

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
        const files = Array.from(event.target.files);
        addFiles(files);
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
        const pdfFilesOnly = files.filter(file => file.type === 'application/pdf');

        if (pdfFilesOnly.length !== files.length) {
            alert('Only PDF files are allowed. Non-PDF files were ignored.');
        }

        addFiles(pdfFilesOnly);
    }

    // Add files to the list
    function addFiles(files) {
        files.forEach(file => {
            if (file.type === 'application/pdf') {
                pdfFiles.push(file);
            }
        });

        updateFileList();
        updateMergeButton();
    }

    // Update the file list display
    function updateFileList() {
        fileList.innerHTML = '';

        if (pdfFiles.length > 0) {
            fileListSection.style.display = 'block';
        } else {
            fileListSection.style.display = 'none';
            return;
        }

        pdfFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.draggable = true;
            fileItem.dataset.index = index;

            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">📄</div>
                    <div class="file-name">${file.name}</div>
                </div>
                <button class="remove-btn" data-index="${index}">×</button>
            `;

            // Drag handlers
            fileItem.addEventListener('dragstart', handleDragStart);
            fileItem.addEventListener('dragend', handleDragEnd);
            fileItem.addEventListener('dragover', handleDragOverItem);
            fileItem.addEventListener('drop', handleDropOnItem);

            // Remove button handler
            fileItem.querySelector('.remove-btn').addEventListener('click', () => removeFile(index));

            fileList.appendChild(fileItem);
        });
    }

    // Update merge button state
    function updateMergeButton() {
        mergeBtn.disabled = pdfFiles.length < 2;
    }

    // Remove file from list
    function removeFile(index) {
        pdfFiles.splice(index, 1);
        updateFileList();
        updateMergeButton();
    }

    // Drag and drop handlers for reordering
    function handleDragStart(event) {
        draggedElement = event.target;
        event.target.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', event.target.outerHTML);
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
        draggedElement = null;
    }

    function handleDragOverItem(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    function handleDropOnItem(event) {
        event.preventDefault();

        if (draggedElement && draggedElement !== event.currentTarget) {
            const fromIndex = parseInt(draggedElement.dataset.index);
            const toIndex = parseInt(event.currentTarget.dataset.index);

            // Reorder the array
            const [movedFile] = pdfFiles.splice(fromIndex, 1);
            pdfFiles.splice(toIndex, 0, movedFile);

            updateFileList();
        }
    }

    // Merge PDFs
    async function mergePDFs() {
        if (pdfFiles.length < 2) {
            alert('Please select at least 2 PDF files to merge.');
            return;
        }

        try {
            // Show merging status
            statusMessage.textContent = 'Merging PDFs...';
            statusMessage.style.display = 'block';
            downloadSection.style.display = 'none';
            mergeBtn.disabled = true;

            // Create merged PDF
            const mergedPdf = await PDFLib.PDFDocument.create();

            for (const file of pdfFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            }

            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();

            // Create download link
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.download = 'merged.pdf';

            // Hide status and show download
            statusMessage.style.display = 'none';
            downloadSection.style.display = 'block';
            mergeBtn.disabled = false;

        } catch (error) {
            console.error('Error merging PDFs:', error);
            statusMessage.textContent = 'Error merging PDFs. Please try again.';
            statusMessage.style.color = '#dc2626';
            mergeBtn.disabled = false;
        }
    }

    // Clear file input after selection
    pdfUpload.addEventListener('click', function() {
        this.value = '';
    });
});