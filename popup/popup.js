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

// Verify if user is opening extension on instagram page
document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const messageElement = document.getElementById("message");

        if (currentTab && currentTab.url) {
            // Vérifiez si l'URL appartient à Instagram
            if (currentTab.url.includes("instagram.com")) {
                messageElement.textContent = "You're on Instagram";
                messageElement.className = "success";
            } else {
                messageElement.textContent = "You're not on Instagram";
                messageElement.className = "error";
            }
        } else {
            messageElement.textContent = "Unable to get current tab URL";
            messageElement.className = "error";
        }
    });
});