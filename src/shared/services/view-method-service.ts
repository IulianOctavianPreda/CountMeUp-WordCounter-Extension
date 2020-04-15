import { Message } from "../enums/message";
import { Storage } from "../enums/storage";
import { ViewMethod } from "../enums/view-method";
import { MenuPosition } from "./../enums/menu-position";
import { MessagePassingService } from "./message-passing-service";
import { StorageService } from "./storage-service";

export class ViewMethodService {
    public static getViewMethod(callback: (data: any) => void): void {
        StorageService.getFromStorage(Storage.SelectedViewMethod, (data) => {
            callback(data);
        });
    }

    public static setViewMethod(viewMethod: ViewMethod) {
        StorageService.saveToStorage(Storage.SelectedViewMethod, viewMethod);
    }

    public static initializeViewMethod() {
        ViewMethodService.getViewMethod((data) => {
            if (!data) {
                data = ViewMethod.Popup;
                ViewMethodService.setViewMethod(data);
            }
        });
    }

    public static openView(tab) {
        ViewMethodService.getViewMethod((data) => {
            data = ViewMethod.Popup;
            if (!ViewMethodService.isAcceptedTab(tab.url)) {
                // if browser is undefined
                if (typeof browser === "object") {
                    data = ViewMethod.Extension;
                } else {
                    data = ViewMethod.Popup;
                }
            }
            switch (data) {
                case ViewMethod.Extension: {
                    browser.browserAction.openPopup();
                    break;
                }
                case ViewMethod.Popup: {
                    StorageService.getFromStorage(Storage.PopupWindowId, (windowId) => {
                        if (!!windowId) {
                            chrome.windows.update(windowId, {
                                focused: true,
                            });
                        } else {
                            chrome.windows.create(
                                {
                                    url: chrome.extension.getURL("popup/popup.html"),
                                    width: 400,
                                    height: 500,
                                    type: "popup",
                                },
                                (window) => {
                                    if (!!window?.id) {
                                        StorageService.saveToStorage(
                                            Storage.PopupWindowId,
                                            window.id
                                        );
                                    }
                                }
                            );
                        }
                    });
                    break;
                }
                case ViewMethod.SideMenuLeft: {
                    MessagePassingService.sendMessageToContentScript(
                        tab.id,
                        { source: Message.BackgroundId },
                        MenuPosition.Left
                    );
                    break;
                }
                case ViewMethod.SideMenuRight: {
                    MessagePassingService.sendMessageToContentScript(
                        tab.id,
                        { source: Message.BackgroundId },
                        MenuPosition.Right
                    );
                    break;
                }
            }
        });
    }

    public static isAcceptedTab(url) {
        return url.includes("http") || url.includes("ftp");
    }
}
