document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const imageUpload = document.getElementById('image-upload');
    const uploadArea = document.getElementById('upload-area');
    const imageListSection = document.getElementById('image-list-section');
    const imageList = document.getElementById('image-list');
    const convertBtn = document.getElementById('convert-btn');
    const statusMessage = document.getElementById('status');
    const downloadSection = document.getElementById('download-section');
    const downloadLink = document.getElementById('download-link');
    const themeToggle = document.getElementById('theme-toggle');

    // Global variables
    let imageFiles = [];
    let draggedElement = null;

    // File upload handlers
    imageUpload.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', () => imageUpload.click());

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Convert button handler
    convertBtn.addEventListener('click', convertToPDF);

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
        addImages(files);
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
        const imageFilesOnly = files.filter(file => file.type.startsWith('image/'));

        if (imageFilesOnly.length !== files.length) {
            alert('Only image files are allowed. Non-image files were ignored.');
        }

        addImages(imageFilesOnly);
    }

    // Add images to the list
    function addImages(files) {
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                imageFiles.push(file);
            }
        });

        updateImageList();
        updateConvertButton();
    }

    // Update the image list display
    function updateImageList() {
        imageList.innerHTML = '';

        if (imageFiles.length > 0) {
            imageListSection.style.display = 'block';
        } else {
            imageListSection.style.display = 'none';
            return;
        }

        imageFiles.forEach((file, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.draggable = true;
            imageItem.dataset.index = index;

            // Create thumbnail
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image-thumbnail';
                img.alt = file.name;

                const nameDiv = document.createElement('div');
                nameDiv.className = 'image-name';
                nameDiv.textContent = file.name;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.textContent = '×';
                removeBtn.addEventListener('click', () => removeImage(index));

                imageItem.appendChild(img);
                imageItem.appendChild(nameDiv);
                imageItem.appendChild(removeBtn);
            };
            reader.readAsDataURL(file);

            // Drag handlers
            imageItem.addEventListener('dragstart', handleDragStart);
            imageItem.addEventListener('dragend', handleDragEnd);
            imageItem.addEventListener('dragover', handleDragOverItem);
            imageItem.addEventListener('drop', handleDropOnItem);

            imageList.appendChild(imageItem);
        });
    }

    // Update convert button state
    function updateConvertButton() {
        convertBtn.disabled = imageFiles.length === 0;
    }

    // Remove image from list
    function removeImage(index) {
        imageFiles.splice(index, 1);
        updateImageList();
        updateConvertButton();
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
            const [movedFile] = imageFiles.splice(fromIndex, 1);
            imageFiles.splice(toIndex, 0, movedFile);

            updateImageList();
        }
    }

    // Convert images to PDF
    async function convertToPDF() {
        if (imageFiles.length === 0) {
            alert('Please upload at least one image.');
            return;
        }

        try {
            // Show converting status
            statusMessage.textContent = 'Converting images to PDF...';
            statusMessage.style.display = 'block';
            downloadSection.style.display = 'none';
            convertBtn.disabled = true;

            // Create PDF
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.create();

            for (const file of imageFiles) {
                const arrayBuffer = await file.arrayBuffer();
                let pdfImage;

                if (file.type === 'image/png') {
                    pdfImage = await pdfDoc.embedPng(arrayBuffer);
                } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    pdfImage = await pdfDoc.embedJpg(arrayBuffer);
                } else if (file.type === 'image/webp') {
                    // Convert WebP to PNG using canvas
                    const img = new Image();
                    img.src = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });

                    await new Promise((resolve) => {
                        img.onload = resolve;
                    });

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const pngDataUrl = canvas.toDataURL('image/png');
                    const pngArrayBuffer = await (await fetch(pngDataUrl)).arrayBuffer();
                    pdfImage = await pdfDoc.embedPng(pngArrayBuffer);
                } else {
                    // For other formats, try to embed as JPG
                    pdfImage = await pdfDoc.embedJpg(arrayBuffer);
                }

                const { width, height } = pdfImage.scale(1);
                const page = pdfDoc.addPage([width, height]);
                page.drawImage(pdfImage, { x: 0, y: 0, width: width, height: height });
            }

            // Save the PDF
            const pdfBytes = await pdfDoc.save();

            // Create download link
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.download = 'converted.pdf';

            // Hide status and show download
            statusMessage.style.display = 'none';
            downloadSection.style.display = 'block';
            convertBtn.disabled = false;

        } catch (error) {
            console.error('Error converting images to PDF:', error);
            statusMessage.textContent = 'Error converting images. Please try again.';
            statusMessage.style.color = '#dc2626';
            convertBtn.disabled = false;
        }
    }

    // Clear file input after selection
    imageUpload.addEventListener('click', function() {
        this.value = '';
    });
});