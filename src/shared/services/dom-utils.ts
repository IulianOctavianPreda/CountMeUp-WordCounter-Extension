export class DomUtils {
    public static getElement(id: string): HTMLElement | null {
        return document.getElementById(id);
    }

    public static getElementsByTag(tag: string): HTMLCollectionOf<Element> {
        return document.getElementsByTagName(tag);
    }

    public static updateInputValue(id: string, str: string): void {
        const element = <HTMLInputElement>document.getElementById(id);
        if (!!element) {
            element.value = str;
        }
    }

    public static hideElementById(id: string) {
        const element = document.getElementById(id);
        if (!!element) {
            element.style.display = "none";
        }
    }

    public static showElementById(id: string, display = "block") {
        const element = document.getElementById(id);
        if (!!element) {
            element.style.display = display;
        }
    }
}
