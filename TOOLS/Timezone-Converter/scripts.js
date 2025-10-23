document.addEventListener('DOMContentLoaded', function() {
    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme') || (prefersDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ==================== TIMEZONE CONVERTER LOGIC ====================
    
    // Get references to DOM elements
    const currentTimeDisplay = document.getElementById('current-time');
    const currentDateDisplay = document.getElementById('current-date');
    const sourceTimezone = document.getElementById('source-timezone');
    const sourceTime = document.getElementById('source-time');
    const sourceDate = document.getElementById('source-date');
    const targetTimezone = document.getElementById('target-timezone');
    const resultDisplay = document.getElementById('result-display');
    const convertBtn = document.getElementById('convert-btn');
    const useCurrentBtn = document.getElementById('use-current-btn');
    const swapBtn = document.getElementById('swap-btn');

    // Initialize with current time
    function updateCurrentTime() {
        const now = new Date();
        
        // Format time as HH:MM:SS
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Format date
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        currentTimeDisplay.textContent = timeString;
        currentDateDisplay.textContent = dateString;
    }

    // Update current time every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Set default values
    function initializeDefaults() {
        const now = new Date();
        
        // Set source time to current time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        sourceTime.value = `${hours}:${minutes}`;
        
        // Set source date to today
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        sourceDate.value = `${year}-${month}-${day}`;
        
        // Try to detect user's timezone and set it
        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const sourceOptions = Array.from(sourceTimezone.options);
            const matchingOption = sourceOptions.find(opt => opt.value === userTimezone);
            
            if (matchingOption) {
                sourceTimezone.value = userTimezone;
            }
        } catch (e) {
            console.log('Could not detect timezone');
        }
        
        // Set target to a popular different timezone
        targetTimezone.value = 'Europe/London';
    }

    initializeDefaults();

    /**
     * Convert timezone
     */
    function convertTimezone() {
        const sourceValue = sourceTime.value;
        const dateValue = sourceDate.value;
        
        if (!sourceValue || !dateValue) {
            updateResultDisplay('--:--', 'Please select time and date');
            return;
        }

        try {
            // Parse the source date and time
            const [hours, minutes] = sourceValue.split(':');
            const dateObj = new Date(dateValue);
            
            // Create a date string in the source timezone
            const dateTimeString = `${dateValue}T${sourceValue}:00`;
            
            // Create date in source timezone
            const sourceDate = new Date(dateTimeString);
            
            // Get timezone offsets
            const sourceOffset = getTimezoneOffset(sourceDate, sourceTimezone.value);
            const targetOffset = getTimezoneOffset(sourceDate, targetTimezone.value);
            
            // Calculate the difference and adjust
            const offsetDiff = targetOffset - sourceOffset;
            const targetDate = new Date(sourceDate.getTime() + offsetDiff);
            
            // Format the result
            const targetTimeString = targetDate.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                timeZone: targetTimezone.value
            });
            
            const targetDateString = targetDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: targetTimezone.value
            });
            
            updateResultDisplay(targetTimeString, targetDateString);
            
        } catch (error) {
            console.error('Conversion error:', error);
            updateResultDisplay('Error', 'Unable to convert timezone');
        }
    }

    /**
     * Get timezone offset in milliseconds
     */
    function getTimezoneOffset(date, timezone) {
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        return tzDate.getTime() - utcDate.getTime();
    }

    /**
     * Update result display
     */
    function updateResultDisplay(time, date) {
        const resultTime = resultDisplay.querySelector('.result-time');
        const resultDate = resultDisplay.querySelector('.result-date');
        
        resultTime.textContent = time;
        resultDate.textContent = date;
    }

    /**
     * Use current time
     */
    function useCurrentTime() {
        const now = new Date();
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        sourceTime.value = `${hours}:${minutes}`;
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        sourceDate.value = `${year}-${month}-${day}`;
        
        // Auto-convert after setting current time
        convertTimezone();
        
        // Visual feedback
        showFeedback(useCurrentBtn, '✓ Current time set');
    }

    /**
     * Swap timezones
     */
    function swapTimezones() {
        const tempTimezone = sourceTimezone.value;
        sourceTimezone.value = targetTimezone.value;
        targetTimezone.value = tempTimezone;
        
        // Visual feedback
        showFeedback(swapBtn, '✓ Swapped');
        
        // Auto-convert after swapping
        setTimeout(() => {
            convertTimezone();
        }, 100);
    }

    /**
     * Show temporary feedback on button
     */
    function showFeedback(button, message) {
        const originalHTML = button.innerHTML;
        button.innerHTML = message;
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 1500);
    }

    // Event Listeners
    convertBtn.addEventListener('click', convertTimezone);
    useCurrentBtn.addEventListener('click', useCurrentTime);
    swapBtn.addEventListener('click', swapTimezones);

    // Auto-convert when inputs change
    sourceTime.addEventListener('change', convertTimezone);
    sourceDate.addEventListener('change', convertTimezone);
    sourceTimezone.addEventListener('change', convertTimezone);
    targetTimezone.addEventListener('change', convertTimezone);

    // Initial conversion
    convertTimezone();
});
