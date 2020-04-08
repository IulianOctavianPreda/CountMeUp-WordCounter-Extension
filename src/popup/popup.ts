import "./popup.scss";

import { Counter } from "../shared/counter";
import { DomUtils } from "../shared/dom-utils";
import { Storage } from "../shared/enums/storage";
import { StorageService } from "../shared/storage-service";

const counter = new Counter();

if (!!typeof browser) {
    // firefox specific extra option - open directly in the extension popup
    DomUtils.hideElementById("listCheck4");
}

StorageService.getFromStorage(Storage.SelectedText, getSelectedText);
StorageService.getFromStorage(Storage.DarkTheme, (data) => {
    changeTheme(data.darkTheme);
    updateDarkThemeSwitch(data.darkTheme);
});

StorageService.getFromStorage(Storage.SelectedViewMethod, (data) => {
    checklistUpdate(data.selectedViewMethod);
});

DomUtils.createDarkThemeCss();
placeTranslations();
addChecklistListeners();

(<HTMLInputElement>DomUtils.getElement("textArea"))?.addEventListener("keyup", (event) => {
    counter.setText((event as any)?.target.value);
    updateInputs();
});

(<HTMLInputElement>DomUtils.getElement("darkSwitch"))?.addEventListener("click", (event) => {
    const inputValue = (event as any)?.target.checked;
    StorageService.saveToStorage({ darkTheme: inputValue });
    changeTheme(inputValue);
});

// window.addEventListener("load", (event) => {

// });

function getSelectedText(data) {
    if (!!data && !!data.selection) {
        DomUtils.updateInputValue("textArea", data.selection);
        updateInputs();
    }
    StorageService.removeFromStorage("selection");
    updateImageSources();
}

function placeTranslations() {
    DomUtils.updateInputPlaceholder("textArea", chrome.i18n.getMessage("_enterDesiredText"));
    DomUtils.updateElementText("cardTitle", chrome.i18n.getMessage("extDescription"));
    DomUtils.updateElementText("inputWordsLabel", chrome.i18n.getMessage("_words"));
    DomUtils.updateElementText("inputCharactersLabel", chrome.i18n.getMessage("_characters"));
    DomUtils.updateElementText(
        "inputCharactersWithoutSpacesLabel",
        chrome.i18n.getMessage("_charactersWithoutSpaces")
    );
    DomUtils.updateElementText("popup", chrome.i18n.getMessage("_inPopup"));
    DomUtils.updateElementText("sideMenu", chrome.i18n.getMessage("_inSideMenu"));
    DomUtils.updateElementText("extension", chrome.i18n.getMessage("_inExtension"));
}

function updateInputs() {
    DomUtils.updateInputValue("inputWords", String(counter.numberOfWords));
    DomUtils.updateInputValue("inputCharacters", String(counter.numberOfCharacters));
    DomUtils.updateInputValue(
        "inputCharactersWithoutSpaces",
        String(counter.numberOfCharactersWithoutSpaces)
    );
}

function updateImageSources() {
    DomUtils.updateImageSource("menu", "assets/images/menu.svg");
    DomUtils.updateImageSource("sun", "assets/images/sun.svg");
    DomUtils.updateImageSource("moon", "assets/images/moon.svg");
    DomUtils.updateImageSource("check1", "assets/images/check.svg");
    DomUtils.updateImageSource("check2", "assets/images/check.svg");
    DomUtils.updateImageSource("check3", "assets/images/check.svg");
    DomUtils.updateImageSource("check4", "assets/images/check.svg");
}

function changeTheme(isDark) {
    if (isDark) {
        toDarkTheme();
    } else {
        toLightTheme();
    }
}

function addChecklistListeners() {
    const idList = ["listCheck1", "listCheck2", "listCheck3", "listCheck3"];
    idList.forEach((element) => {
        (<HTMLInputElement>DomUtils.getElement(element))?.addEventListener(
            "click",
            checklistUpdateEvent
        );
    });
}

function checklistUpdateEvent(this: any) {
    checklistUpdate(this.id);
}

function checklistUpdate(id: string) {
    const idList = ["check1", "check2", "check3", "check4"];
    const toShowId = idList.find((x) => id.toLowerCase().includes(x));
    const idToHide = idList.filter((x) => toShowId !== x);
    console.log(idToHide);
    idToHide.forEach((element) => {
        DomUtils.hideElementById(element);
    });
    DomUtils.showElementById(toShowId ?? "");
    StorageService.saveToStorage({ selectedViewMethod: id });
}

function updateDarkThemeSwitch(isDark) {
    const element = <HTMLInputElement>DomUtils.getElement("darkSwitch");
    if (!!element) {
        element.checked = isDark;
    }
}

function toDarkTheme() {
    DomUtils.addDarkThemeToTag("img");
    DomUtils.addDarkThemeToTag("body");
    DomUtils.addDarkThemeByClassNames([
        "card",
        "form-control",
        "btn list",
        "input-group-text",
        "dropdown-content",
    ]);
}

function toLightTheme() {
    DomUtils.removeDarkThemeFromTag("img");
    DomUtils.removeDarkThemeFromTag("body");
    DomUtils.removeDarkThemeByClassNames([
        "card",
        "form-control",
        "btn list",
        "input-group-text",
        "dropdown-content",
    ]);
}
