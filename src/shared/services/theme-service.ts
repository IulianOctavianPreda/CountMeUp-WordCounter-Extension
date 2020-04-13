import { ThemeType } from "../enums/theme-type";
import { ThemeElement } from "./../types/theme-element";

export class ThemeService {
    public static createDarkThemeCss() {
        const style = document.createElement("style");
        // style.type = "text/css";
        style.innerHTML = `.dark { background-color: black !important; color:white !important; } \
                           .dark-svg { filter:invert(100%); } `;
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    public static addDarkTheme(elements: ThemeElement[]) {
        elements.forEach((element) => {
            switch (element.type) {
                case ThemeType.Class: {
                    ThemeService.addDarkThemeByClassName(element.name, element.isImage);
                    break;
                }
                case ThemeType.Tag: {
                    ThemeService.addDarkThemeToTag(element.name, element.isImage);
                    break;
                }
                case ThemeType.Id: {
                    ThemeService.addDarkThemeById(element.name, element.isImage);
                    break;
                }
            }
        });
    }

    public static removeDarkTheme(elements: ThemeElement[]) {
        elements.forEach((element) => {
            switch (element.type) {
                case ThemeType.Class: {
                    ThemeService.removeDarkThemeByClassName(element.name, element.isImage);
                    break;
                }
                case ThemeType.Tag: {
                    ThemeService.removeDarkThemeFromTag(element.name, element.isImage);
                    break;
                }
                case ThemeType.Id: {
                    ThemeService.removeDarkThemeById(element.name, element.isImage);
                    break;
                }
            }
        });
    }

    public static addDarkThemeById(id: string, isImage: boolean = false) {
        const element = document.getElementById(id);
        const appendedClass = isImage ? "dark-svg" : "dark";

        if (!!element) {
            element.classList.add(appendedClass);
        }
    }

    public static removeDarkThemeById(id: string, isImage: boolean = false) {
        const element = document.getElementById(id);
        const appendedClass = isImage ? "dark-svg" : "dark";
        if (!!element) {
            element.classList.remove(appendedClass);
        }
    }

    public static addDarkThemeByClassNames(classNames: string[], isImage: boolean = false) {
        classNames.forEach((className) => {
            ThemeService.addDarkThemeByClassName(className, isImage);
        });
    }

    public static addDarkThemeByClassName(className: string, isImage: boolean = false) {
        const elements = document.getElementsByClassName(className);
        const appendedClass = isImage ? "dark-svg" : "dark";
        for (const element of elements) {
            element.classList.add(appendedClass);
        }
    }

    public static removeDarkThemeByClassNames(classNames: string[], isImage: boolean = false) {
        classNames.forEach((className) => {
            ThemeService.removeDarkThemeByClassName(className, isImage);
        });
    }

    public static removeDarkThemeByClassName(className: string, isImage: boolean = false) {
        const appendedClass = isImage ? "dark-svg" : "dark";
        const elements = document.getElementsByClassName(className);
        for (const element of elements) {
            element.classList.remove(appendedClass);
        }
    }

    public static addDarkThemeToTag(tag: string, isImage: boolean = false) {
        const elements = document.getElementsByTagName(tag);
        const appendedClass = isImage ? "dark-svg" : "dark";
        for (const element of elements) {
            element.classList.add(appendedClass);
        }
    }

    public static removeDarkThemeFromTag(tag: string, isImage: boolean = false) {
        const elements = document.getElementsByTagName(tag);
        const appendedClass = isImage ? "dark-svg" : "dark";
        for (const element of elements) {
            element.classList.remove(appendedClass);
        }
    }
}
