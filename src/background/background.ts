import { Message } from "src/shared/enums/message";

import { Counter } from "../shared/counter";
import { MessagePassingService } from "../shared/services/message-passing-service";

chrome.contextMenus.create({
    title: `${updatedText("%s")}`,
    contexts: ["selection"],
    onclick: openPopUp,
});

function openPopUp(info, tab) {
    // browser.browserAction.openPopup();

    MessagePassingService.sendMessageToContentScript(
        tab.id,
        { source: Message.BackgroundId },
        info.selectionText
    );

    // window.open("", "myWindow", "width=200,height=100");

    // window.open(
    //     chrome.extension.getURL("popup/popup.html"),
    //     "_blank",
    //     "scrollbars=yes,resizable=yes,width=400,height=500"
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
