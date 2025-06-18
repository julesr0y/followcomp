// elements
const messageElement = document.getElementById("message");

// functions
// if URL could not be read
function errorURL() {
    messageElement.textContent = "Unable to get current tab URL, please try again";
    messageElement.className = "error";
}

// if URL cannot be used by extension
function incorrectURL() {
    messageElement.textContent = "Please navigate to your Instagram profile page to use this extension";
    messageElement.className = "error";
}

// if URL is correct
function correctURL() {
    // make fetch button visible
    const buttonContainer = document.getElementById('button');
    buttonContainer.style.display = 'block';
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
    document.getElementById("message").innerText = "Processing..."; // Update message to indicate processing

    // Inject the content script
    chrome.scripting.executeScript(
        {
            target: { tabId: (await getActiveTab()).id },
            files: ["scripts/content.js"]
        },
        () => {
            // Results
            const result = document.getElementById("message");

            chrome.storage.local.get('dontFollowMeBack', (result) => {
                const list = result.dontFollowMeBack || [];
                const message = document.getElementById('message');

                message.innerHTML = ''; // Clear the processing message (end of processing)

            list.forEach(user => {
                const dontFollowMeBackList = document.createElement('div');
                dontFollowMeBackList.style.display = "flex";
                dontFollowMeBackList.style.alignItems = "center";
                dontFollowMeBackList.style.marginBottom = "8px";

                // profile picture
                const profilePic = document.createElement('img');
                profilePic.src = user.profile_pic_url;
                profilePic.alt = `${user.username}'s profile picture`;
                profilePic.style.width = "32px";
                profilePic.style.height = "32px";
                profilePic.style.borderRadius = "50%";
                profilePic.style.marginRight = "8px";
                dontFollowMeBackList.appendChild(profilePic);

                // username
                const usernameSpan = document.createElement('span');
                usernameSpan.textContent = user.username;
                dontFollowMeBackList.appendChild(usernameSpan);

                // verified badge
                if (user.verified) {
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("width", "16");
                    svg.setAttribute("height", "16");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.style.marginLeft = "8px";
                    svg.innerHTML = `
                        <path fill="#0095f6" d="M12 2l2.09 6.26L20 9.27l-5 4.87L16.18 22 12 18.56 7.82 22 9 14.14l-5-4.87 5.91-.99z"/>
                    `;
                    dontFollowMeBackList.appendChild(svg);
                }

                message.appendChild(dontFollowMeBackList);
            });
            });
        }
    );
});

// Helper to get the active tab
async function getActiveTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}