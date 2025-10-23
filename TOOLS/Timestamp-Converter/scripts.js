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
    const timestampInput = document.getElementById('timestamp-input');
    const dateOutput = document.getElementById('date-output');
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const timestampOutput = document.getElementById('timestamp-output');
    const nowBtn = document.getElementById('now-btn');

    // Function to update date from timestamp
    function updateFromTimestamp() {
        const timestamp = parseInt(timestampInput.value);
        
        if (isNaN(timestamp) || timestampInput.value === '') {
            dateOutput.value = '';
            return;
        }

        try {
            // Convert timestamp to date (assuming timestamp is in seconds)
            const date = new Date(timestamp * 1000);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                dateOutput.value = 'Invalid timestamp';
                return;
            }

            // Format the date to UTC string
            dateOutput.value = date.toUTCString();
        } catch (error) {
            dateOutput.value = 'Error converting timestamp';
        }
    }

    // Function to update timestamp from date/time
    function updateFromDateTime() {
        const dateValue = dateInput.value;
        const timeValue = timeInput.value || '00:00:00';
        
        if (!dateValue) {
            timestampOutput.value = '';
            return;
        }

        try {
            // Combine date and time
            const dateTimeString = `${dateValue}T${timeValue}Z`;
            const date = new Date(dateTimeString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                timestampOutput.value = 'Invalid date/time';
                return;
            }

            // Convert to Unix timestamp (seconds)
            const timestamp = Math.floor(date.getTime() / 1000);
            timestampOutput.value = timestamp;
        } catch (error) {
            timestampOutput.value = 'Error converting date/time';
        }
    }

    // Function to set current time in all fields
    function setCurrentTime() {
        const now = new Date();
        
        // Get current timestamp in seconds
        const currentTimestamp = Math.floor(now.getTime() / 1000);
        
        // Set timestamp input
        timestampInput.value = currentTimestamp;
        
        // Set date output
        dateOutput.value = now.toUTCString();
        
        // Set date input (YYYY-MM-DD format)
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        
        // Set time input (HH:MM:SS format)
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}:${seconds}`;
        
        // Set timestamp output
        timestampOutput.value = currentTimestamp;
    }

    // Event listeners
    timestampInput.addEventListener('input', updateFromTimestamp);
    dateInput.addEventListener('change', updateFromDateTime);
    timeInput.addEventListener('change', updateFromDateTime);
    nowBtn.addEventListener('click', setCurrentTime);

    // Initialize with current time on page load
    setCurrentTime();
});
