import { Counter } from "../shared/counter";
import { Message } from "../shared/enums/message";
import { Storage } from "../shared/enums/storage";
import { MessagePassingService } from "./../shared/services/message-passing-service";
import { StorageService } from "./../shared/services/storage-service";
import { ViewMethodService } from "./services/view-method-service";

chrome.runtime.onInstalled.addListener(() => {
    ViewMethodService.initializeViewMethod();
});

chrome.runtime.onStartup.addListener(() => {
    StorageService.removeFromStorage(Storage.PopupWindowId);
});

chrome.contextMenus.create({
    title: `Word counter`,
    contexts: ["selection"],
    id: "WordsCounter",
    onclick: openPopUp,
});

function openPopUp(info, tab) {
    ViewMethodService.openView(tab);
    StorageService.saveToStorage(Storage.SelectedText, info.selectionText);
}

MessagePassingService.addMessageListener(
    { source: Message.ContentId, destination: Message.BackgroundId, name: "selectedText" },
    (selectedText) => {
        const counter = new Counter(selectedText);
        chrome.contextMenus.update("WordsCounter", {
            title: `${counter.formattedTextLong()}`,
        });

        MessagePassingService.sendMessage(
            { source: Message.BackgroundId, destination: Message.PopupId, name: "selectedText" },
            selectedText
        );
    }
);

chrome.windows.onRemoved.addListener((removedWindowId) => {
    StorageService.getFromStorage(Storage.PopupWindowId, (windowId) => {
        if (removedWindowId === windowId) {
            StorageService.removeFromStorage(Storage.PopupWindowId);
        }
    });
});
