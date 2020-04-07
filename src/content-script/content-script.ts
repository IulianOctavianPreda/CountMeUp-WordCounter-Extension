import { Message } from "../shared/message";

console.log("toggle");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

    if (request.msg === Message.Id) {
        console.log("toggle");
        toggle();
    }
});

let iframe = document.createElement("iframe");
iframe.style.background = "green";
iframe.style.height = "800px";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
// iframe.frameBorder = "none";
iframe.src = chrome.extension.getURL("popup/popup.html");

document.body.appendChild(iframe);

function toggle() {
    if (iframe.style.width == "0px") {
        iframe.style.width = "320px";
    } else {
        iframe.style.width = "0px";
    }
}
