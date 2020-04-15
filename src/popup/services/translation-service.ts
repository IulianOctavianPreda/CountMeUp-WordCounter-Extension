import { TranslatableElement } from "../types/translatable-element";

export class TranslationService {
    public static updateTranslations(items: TranslatableElement[]) {
        items.forEach((item) => {
            TranslationService.updateTranslation(item);
        });
    }

    public static updateTranslation(item: TranslatableElement) {
        const element = document.getElementById(item.id);
        if (!!element) {
            element[item.property] = chrome.i18n.getMessage(item.translateId);
        }
    }
}
