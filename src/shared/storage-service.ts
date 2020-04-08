export class StorageService {
    public static getFromStorage(id: string, callback) {
        chrome.storage.sync.get(id, callback);
    }

    public static removeFromStorage(id: string, callback?) {
        chrome.storage.sync.remove(id, callback);
    }

    public static saveToStorage(obj) {
        chrome.storage.sync.set(obj);
    }
}
