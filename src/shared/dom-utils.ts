export class DomUtils {
    public static getElement(id: string): HTMLElement | null {
        return document.getElementById(id);
    }

    public static getElementsByTag(tag: string): HTMLCollectionOf<Element> {
        return document.getElementsByTagName(tag);
    }

    public static updateElementText(id: string, str: string): void {
        const element = document.getElementById(id);
        if (!!element) {
            element.innerText = str;
        }
    }

    public static updateInputPlaceholder(id: string, str: string): void {
        const element = <HTMLInputElement>document.getElementById(id);
        if (!!element) {
            element.placeholder = str;
        }
    }

    public static updateInputValue(id: string, str: string): void {
        const element = <HTMLInputElement>document.getElementById(id);
        if (!!element) {
            element.value = str;
        }
    }

    public static updateImageSource(id: string, path: string): void {
        const imgURL = chrome.extension.getURL(path);
        const element = <HTMLImageElement>document.getElementById(id);
        if (!!element) {
            element.src = imgURL;
        }
    }

    public static createDarkThemeCss() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `.dark { background-color: black !important; color:white !important; } \
                           .dark-svg { filter:invert(100%); } `;
        DomUtils.getElementsByTag("head")[0].appendChild(style);
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

    public static addDarkTheme(id: string, type: string = "element") {
        const element = document.getElementById(id);
        const appendedClass = type === "svg" ? "dark-svg" : "dark";

        if (!!element) {
            element.classList.add(appendedClass);
        }
    }

    public static removeDarkTheme(id: string, type: string = "element") {
        const element = document.getElementById(id);
        const appendedClass = type === "svg" ? "dark-svg" : "dark";
        if (!!element) {
            element.classList.remove(appendedClass);
        }
    }

    public static addDarkThemeByClassName(className: string, type = "element") {
        const elements = document.getElementsByClassName(className);
        const appendedClass = type === "svg" ? "dark-svg" : "dark";
        for (const element of elements) {
            element.classList.add(appendedClass);
        }
    }

    public static addDarkThemeByClassNames(classNames: string[], type = "element") {
        classNames.forEach((className) => {
            DomUtils.addDarkThemeByClassName(className, type);
        });
    }

    public static removeDarkThemeByClassName(className: string, type = "element") {
        const appendedClass = className === "svg" ? "dark-svg" : "dark";
        const elements = document.getElementsByClassName(className);
        for (const element of elements) {
            element.classList.remove(appendedClass);
        }
    }

    public static removeDarkThemeByClassNames(classNames: string[], type = "element") {
        classNames.forEach((className) => {
            DomUtils.removeDarkThemeByClassName(className, type);
        });
    }

    public static addDarkThemeToTag(tag: string) {
        const elements = DomUtils.getElementsByTag(tag);
        const appendedClass = tag === "img" ? "dark-svg" : "dark";
        for (const element of elements) {
            element.classList.add(appendedClass);
        }
    }

    public static removeDarkThemeFromTag(tag: string) {
        const elements = DomUtils.getElementsByTag(tag);
        const appendedClass = tag === "img" ? "dark-svg" : "dark";
        for (const element of elements) {
            element.classList.remove(appendedClass);
        }
    }
}
