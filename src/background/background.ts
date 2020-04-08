import { Counter } from "../shared/counter";
import { MessagePassingService } from "../shared/message-passing-service";

chrome.contextMenus.create({
    title: `${updatedText("%s")}`,
    contexts: ["selection"],
    onclick: openPopUp,
});

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.create({ url: chrome.extension.getURL("popup.html"), selected: true });
// });

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.sendMessage(<number>tab.id, "toggle");
// });

function openPopUp(info, tab) {
    // browser.browserAction.openPopup();

    MessagePassingService.sendMessageToContentScript(tab.id, info.selectionText);

    // window.open("", "myWindow", "width=200,height=100");

    // window.open(
    //     chrome.extension.getURL("popup/popup.html"),
    //     "_blank",
    //     "scrollbars=yes,resizable=yes,width=320,height=415"
    // );
    saveSelection(info.selectionText);
}

// function updatedText(str) {
//     const counter = new Counter(str);
//     return `W:${counter.numberOfWords} C:${counter.numberOfCharacters} C/:${counter.numberOfCharactersWithoutSpace}`;
// }

function updatedText(str) {
    const counter = new Counter(str);
    return `${counter.numberOfWordsLocaleString} - ${counter.numberOfCharactersLocaleString} - ${counter.numberOfCharactersWithoutSpacesLocaleString}`;
}

function saveSelection(str: string) {
    chrome.storage.sync.set({ selection: str });
}
