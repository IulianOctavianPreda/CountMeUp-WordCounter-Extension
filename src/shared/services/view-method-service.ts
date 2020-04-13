import { Storage } from "../enums/storage";
import { ViewMethod } from "../enums/view-method";
import { StorageService } from "./storage-service";

export class ViewMethodService {
    public static getViewMethod(callback?: (data: any) => void): void {
        StorageService.getFromStorage(Storage.SelectedViewMethod, (data) => {
            callback(data);
        });
    }

    public static setViewMethod(viewMethod: ViewMethod) {
        StorageService.saveToStorage(Storage.SelectedViewMethod, viewMethod);
    }

    public static openView(tabId?: number, detail?: any) {
        ViewMethodService.getViewMethod((data) => {
            switch (data) {
                case ViewMethod.Popup: {
                    window.open(
                        chrome.extension.getURL("popup/popup.html"),
                        "_blank",
                        "scrollbars=yes,resizable=yes,width=400,height=500"
                    );
                    break;
                }
                case ViewMethod.SideMenuLeft: {
                    // MessagePassingService.sendMessageToContentScript(tabId, MenuPosition.Left);
                }
            }
        });
    }
}

// should place message passing between window//sidemenu to extension
// initialize default for dark theme and selected view mode
// place listeners for both of them with special id  + create aditional
// function to send / receive data from popup - side / window to popup extension
/// ( actualli it mign not be needed , just put everithing in the storage , because when you open
// the pop-up it loads everithing again , so fuck the ones that leave it on wait they can't so the
/// storage is enough)
