import { Counter } from "../shared/counter";

chrome.contextMenus.create({
    title: `${updatedText("%s")}`,
    contexts: ["selection"],
    onclick: openPopUp,
});

function openPopUp(info, tab) {
    // browser.browserAction.openPopup();
    // sendMessage(info.selectionText);
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

// function sendMessage(str: string) {
//     chrome.runtime.sendMessage({
//         msg: Message.Id,
//         data: {
//             subject: Message.Subject,
//             content: str,
//         },
//     });
// }

function saveSelection(str: string) {
    chrome.storage.sync.set({ selection: str });
}
