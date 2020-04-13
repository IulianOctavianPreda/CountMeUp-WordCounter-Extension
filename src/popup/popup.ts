import "./popup.scss";

import { Counter } from "../shared/counter";
import { Storage } from "../shared/enums/storage";
import { DomUtils } from "../shared/services/dom-utils";
import { ImageService } from "../shared/services/image-service";
import { StorageService } from "../shared/services/storage-service";
import { ThemeService } from "../shared/services/theme-service";
import { TranslationService } from "../shared/services/translation-service";
import { ImageElementsModel } from "./models/image-elements-model";
import { ThemeElementsModel } from "./models/theme-elements-model";
import { TranslatableElementsModel } from "./models/translatable-elements-model";

const counter = new Counter();

if (!!typeof browser) {
    // firefox specific extra option - open directly in the extension popup
    DomUtils.hideElementById("listCheck4");
}

StorageService.getFromStorage(Storage.SelectedText, getSelectedText);
StorageService.getFromStorage(Storage.DarkTheme, (data) => {
    changeTheme(data);
    updateDarkThemeSwitch(data);
});

StorageService.getFromStorage(Storage.SelectedViewMethod, (data) => {
    checklistUpdate(data);
});

ThemeService.createDarkThemeCss();
TranslationService.updateTranslations(TranslatableElementsModel);
ImageService.updateSources(ImageElementsModel);
addChecklistListeners();

(<HTMLInputElement>DomUtils.getElement("textArea"))?.addEventListener("keyup", (event) => {
    counter.setText((event as any)?.target.value);
    updateInputs();
});

(<HTMLInputElement>DomUtils.getElement("darkSwitch"))?.addEventListener("click", (event) => {
    const inputValue = (event as any)?.target.checked;
    StorageService.saveToStorage(Storage.DarkTheme, inputValue);
    changeTheme(inputValue);
});

function getSelectedText(data) {
    if (!!data) {
        DomUtils.updateInputValue("textArea", data);
        updateInputs();
    }
    StorageService.removeFromStorage(Storage.SelectedText);
}

function updateInputs() {
    DomUtils.updateInputValue("inputWords", String(counter.numberOfWords));
    DomUtils.updateInputValue("inputCharacters", String(counter.numberOfCharacters));
    DomUtils.updateInputValue(
        "inputCharactersWithoutSpaces",
        String(counter.numberOfCharactersWithoutSpaces)
    );
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
    StorageService.saveToStorage(Storage.SelectedViewMethod, id);
}

function updateDarkThemeSwitch(isDark) {
    const element = <HTMLInputElement>DomUtils.getElement("darkSwitch");
    if (!!element) {
        element.checked = isDark;
    }
}

function changeTheme(isDark) {
    if (isDark) {
        toDarkTheme();
    } else {
        toLightTheme();
    }
}

function toDarkTheme() {
    ThemeService.addDarkTheme(ThemeElementsModel);
}

function toLightTheme() {
    ThemeService.removeDarkTheme(ThemeElementsModel);
}
