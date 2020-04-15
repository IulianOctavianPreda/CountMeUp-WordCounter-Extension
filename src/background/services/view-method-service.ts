import { MenuPosition } from "../../shared/enums/menu-position";
import { Message } from "../../shared/enums/message";
import { Storage } from "../../shared/enums/storage";
import { ViewMethod } from "../../shared/enums/view-method";
import { MessagePassingService } from "../../shared/services/message-passing-service";
import { StorageService } from "../../shared/services/storage-service";

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
            if (!ViewMethodService.isAcceptedTab(tab.url)) {
                data = ViewMethod.Popup;
            }
            switch (data) {
                case ViewMethod.Popup: {
                    StorageService.getFromStorage(Storage.PopupWindowId, (windowId) => {
                        if (!!windowId) {
                            chrome.windows.update(
                                windowId,
                                {
                                    focused: true,
                                },
                                (callbackData) => {
                                    if (!callbackData) {
                                        ViewMethodService.createWindow();
                                    }
                                }
                            );
                        } else {
                            ViewMethodService.createWindow();
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

    public static createWindow() {
        chrome.windows.create(
            {
                url: chrome.extension.getURL("popup/popup.html"),
                width: 400,
                height: 500,
                type: "popup",
            },
            (window) => {
                if (!!window?.id) {
                    StorageService.saveToStorage(Storage.PopupWindowId, window.id);
                }
            }
        );
    }
}
