import { Storage } from "./enums/storage";
import { ViewMethod } from "./enums/view-method";
import { StorageService } from "./storage-service";

export class ViewMethodService {
    public static getViewMethod(callback?: (data: any) => void): void {
        StorageService.getFromStorage(Storage.SelectedViewMethod, (data) => {
            callback(data[Storage.SelectedViewMethod]);
        });
    }

    public static setViewMethod(viewMethod: ViewMethod) {
        StorageService.saveToStorage({ [Storage.SelectedViewMethod]: viewMethod });
    }
}
