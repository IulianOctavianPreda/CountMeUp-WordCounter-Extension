import { Counter } from "../shared/counter";
import { Storage } from "../shared/enums/storage";
import { StorageService } from "./../shared/services/storage-service";
import { ViewMethodService } from "./../shared/services/view-method-service";

const counter = new Counter();

chrome.runtime.onInstalled.addListener(() => {
    ViewMethodService.initializeViewMethod();
});

chrome.contextMenus.create({
    title: `${counter.formattedTextLong("%s")}`,
    contexts: ["selection"],
    onclick: openPopUp,
});

function openPopUp(info, tab) {
    ViewMethodService.openView(tab.id);
    StorageService.saveToStorage(Storage.SelectedText, info.selectionText);
}
