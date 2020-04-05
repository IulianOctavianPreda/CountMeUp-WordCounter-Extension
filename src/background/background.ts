import { Counter } from "../shared/counter";
import { Message } from "../shared/message";

chrome.contextMenus.create({
    title: `${updatedText("%s")}`,
    contexts: ["selection"],
    onclick: openPopUp,
});

function openPopUp(info, tab) {
    sendMessage(info.selectionText);
}

function updatedText(str) {
    const counter = new Counter(str);
    return `W:${counter.numberOfWords} C:${counter.numberOfCharacters} C/:${counter.numberOfCharactersWithoutSpace}`;
}

function sendMessage(content: string) {
    chrome.runtime.sendMessage({
        msg: Message.Id,
        data: {
            subject: Message.Subject,
            content,
        },
    });
}
