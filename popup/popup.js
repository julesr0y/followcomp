// elements
const messageElement = document.getElementById("message");

// functions
// if URL could not be read
function errorURL() {
    messageElement.textContent = "Unable to get current tab URL";
    messageElement.className = "error";
}

// if URL cannot be used by extension
function incorrectURL() {
    messageElement.textContent = "You're not on Instagram";
    messageElement.className = "error";
}

// if URL is correct
function correctURL() {
    // make fetch button visible
    const buttonContainer = document.getElementById('button');
    buttonContainer.style.display = 'block';

    // update message
    messageElement.textContent = "You're on Instagram";
    messageElement.className = "success";
}

// Verify if user is opening extension on instagram page
document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        if (currentTab && currentTab.url) {
            if (currentTab.url.includes("instagram.com")) {
                correctURL();
            } else {
                incorrectURL();
            }
        } else {
            errorURL();
        }
    });
});

// Get data with content.js
document.getElementById("fetchData").addEventListener("click", async () => {
    document.getElementById("message").innerText = "Processing...";

    // Inject the content script
    chrome.scripting.executeScript(
        {
            target: { tabId: (await getActiveTab()).id },
            files: ["scripts/content.js"]
        },
        () => {
            document.getElementById("message").innerText = "Data fetched. Check console.";
        }
    );
});

// Helper to get the active tab
async function getActiveTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}