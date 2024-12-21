document.getElementById("fetchData").addEventListener("click", async () => {
    document.getElementById("status").innerText = "Processing...";

    // Inject the content script
    chrome.scripting.executeScript(
        {
            target: { tabId: (await getActiveTab()).id },
            files: ["scripts/content.js"]
        },
        () => {
            document.getElementById("status").innerText = "Data fetched. Check console.";
        }
    );
});

// Helper to get the active tab
async function getActiveTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}  