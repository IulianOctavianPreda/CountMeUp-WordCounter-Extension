export class StorageService {
    public static getFromStorage(id: string, callback) {
        chrome.storage.sync.get(id, (data) => {
            callback(data[id]);
        });
    }

    public static removeFromStorage(id: string, callback?) {
        chrome.storage.sync.remove(id, callback);
    }

    public static saveToStorage(id: string, data: string | number | object, callback?) {
        chrome.storage.sync.set({ id: data }, callback);
    }
}
