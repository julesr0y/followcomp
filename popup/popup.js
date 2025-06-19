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
    messageElement.textContent = "Please navigate to Instagram website and connect to your account to use this extension";
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
    const fetchButton = document.getElementById("fetchData");
    // When button is clicked, we replace the button text with a loading message
    fetchButton.innerHTML = `<div style="display:flex;align-items:center;">Getting data <img id="loaderIcon" src="${chrome.runtime.getURL('images/loader.png')}" style="width:18px;height:18px;margin-left:8px;vertical-align:middle;animation:spin 1s linear infinite;"></div>`;

    // Inject the content script
    chrome.scripting.executeScript(
        {
            target: { tabId: (await getActiveTab()).id },
            files: ["scripts/content.js"]
        },
        () => {
            chrome.storage.local.get('dontFollowMeBack', (result) => {
                const list = result.dontFollowMeBack || [];
                const message = document.getElementById('message');

                fetchButton.innerHTML = 'Try again'; // Clear the processing message (end of processing)

                list.forEach(user => {
                    const dontFollowMeBackList = document.createElement('div');
                    dontFollowMeBackList.style.display = "flex";
                    dontFollowMeBackList.style.alignItems = "center";
                    dontFollowMeBackList.style.marginBottom = "8px";

                    // profile picture
                    const profilePic = document.createElement('img');
                    const proxyURL = `https://images.weserv.nl/?url=${encodeURIComponent(user.profile_pic_url.replace(/^https?:\/\//, ''))}`;
                    profilePic.src = proxyURL;
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
                    if (user.is_verified) {
                        const verifiedImg = document.createElement('img');
                        verifiedImg.src = chrome.runtime.getURL('images/verified.svg');
                        verifiedImg.alt = "Vérifié";
                        verifiedImg.style.width = "16px";
                        verifiedImg.style.height = "16px";
                        verifiedImg.style.marginLeft = "8px";
                        dontFollowMeBackList.appendChild(verifiedImg);
                        console.log("Verified user:", user.username);
                    }

                    const br = document.createElement('br');
                    message.appendChild(br);
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