document.getElementById('current-year').textContent = new Date().getFullYear();

const copyButton = document.getElementById('copyScriptButton');
const scriptTextarea = document.getElementById('scriptTextarea');
const copyMm2ScriptButton = document.getElementById('copyMm2ScriptButton');
const mm2ScriptTextarea = document.getElementById('mm2ScriptTextarea');

// Function to handle copying text to clipboard
async function copyToClipboard(buttonElement, textareaElement, originalText, copiedText, delay = 2000) {
    try {
        await navigator.clipboard.writeText(textareaElement.value);
        buttonElement.innerHTML = `<i class="fas fa-check"></i> ${copiedText}`; // Change icon to checkmark
        setTimeout(() => {
            buttonElement.innerHTML = originalText; // Revert back
        }, delay);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers or insecure contexts
        textareaElement.select();
        document.execCommand('copy');
        buttonElement.innerHTML = `<i class="fas fa-check"></i> ${copiedText} (Fallback)`;
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
        }, delay);
    }
}

copyButton.addEventListener('click', async () => {
    copyToClipboard(copyButton, scriptTextarea, '<i class="fas fa-copy"></i> Copy Script', 'Copied!');
});

copyMm2ScriptButton.addEventListener('click', async () => {
    copyToClipboard(copyMm2ScriptButton, mm2ScriptTextarea, '<i class="fas fa-copy"></i> Copy Vex Mm2', 'Copied!');
});

// Tab switching logic
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

// Helper function to activate the new tab content
function activateNewTabContent(contentElement) {
    if (contentElement) {
        // Ensure it's displayed first before adding 'active' to trigger animation
        contentElement.style.display = 'block';
        // Use requestAnimationFrame to ensure the display change is rendered before adding 'active' class
        requestAnimationFrame(() => {
            contentElement.classList.add('active'); // This triggers the fadeIn animation
        });
    }
}

function showTab(targetId) {
    const currentActiveContent = document.querySelector('.tab-content.active');
    const newTargetContent = document.getElementById(targetId);

    // If the new target content is already the one currently active, do nothing.
    // This must be checked before modifying any classes.
    if (currentActiveContent && newTargetContent && currentActiveContent.id === newTargetContent.id) {
        return;
    }

    // Clean up any previously fading-out or active content to reset their state
    tabContents.forEach(content => {
        if (content.classList.contains('active')) {
            content.classList.remove('active');
        }
        if (content.classList.contains('fading-out')) {
            content.classList.remove('fading-out');
            content.style.display = 'none'; // Force hide immediately if an animation was interrupted
            // Remove any pending animationend listeners associated with interrupted animations
            if (content._currentAnimationEndHandler) {
                content.removeEventListener('animationend', content._currentAnimationEndHandler);
                content._currentAnimationEndHandler = null; // Clear handler reference
            }
        }
    });

    // Deactivate all nav tabs first, then activate the clicked one for immediate feedback
    navTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTabButton = document.querySelector(`.nav-tab[data-target="${targetId}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
    }

    // If there was an active content before, animate it out
    if (currentActiveContent) {
        currentActiveContent.classList.add('fading-out'); // Add fading-out class to trigger animation

        const handleAnimationEnd = (event) => {
            if (event.target === currentActiveContent) {
                currentActiveContent.classList.remove('fading-out');
                currentActiveContent.style.display = 'none'; // Hide after animation completes
                currentActiveContent.removeEventListener('animationend', currentActiveContent._currentAnimationEndHandler);
                currentActiveContent._currentAnimationEndHandler = null; // Clear handler reference

                // Now, activate the new content after the previous one has faded out
                activateNewTabContent(newTargetContent);
            }
        };
        // Store the handler on the element itself so we can remove it later if interrupted
        currentActiveContent._currentAnimationEndHandler = handleAnimationEnd;
        currentActiveContent.addEventListener('animationend', currentActiveContent._currentAnimationEndHandler);
    } else {
        // No previous active tab (e.g., initial page load or after a full reset), just activate the new one
        activateNewTabContent(newTargetContent);
    }
}

// Show the default tab on page load
document.addEventListener('DOMContentLoaded', () => {
    showTab('home-content'); // Default tab

    // Add click listeners to nav tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            showTab(targetId);
        });
    });
});
