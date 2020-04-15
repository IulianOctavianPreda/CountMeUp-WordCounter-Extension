import { ImageElement } from "../types/image-element";

export class ImageService {
    public static updateSources(items: ImageElement[]) {
        items.forEach((item) => {
            ImageService.updateSource(item);
        });
    }

    public static updateSource(item: ImageElement) {
        const element = document.getElementById(item.id);
        if (!!element) {
            element[item.property] = chrome.extension.getURL(item.path);
        }
    }
}
