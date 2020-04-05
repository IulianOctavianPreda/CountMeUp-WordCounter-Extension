import "./popup.scss";

import { Counter } from "../shared/counter";
import { Message } from "../shared/message";

const counter = new Counter();

placeTranslations();

(<HTMLInputElement>getElement("textArea"))?.addEventListener("change", (event) => {
    counter.setText((event as any)?.target.value);
    updateInputs();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg === Message.Id) {
        updateInputValue("textArea", request.data.content);
    }
});

function getElement(id: string): HTMLElement | null {
    return document.getElementById(id);
}

function updateElementText(id: string, str: string): void {
    const element = document.getElementById(id);
    if (!!element) {
        element.innerText = str;
    }
}

function updateInputPlaceholder(id: string, str: string): void {
    const element = <HTMLInputElement>document.getElementById(id);
    if (!!element) {
        element.placeholder = str;
    }
}

function updateInputValue(id: string, str: string): void {
    const element = <HTMLInputElement>document.getElementById(id);
    if (!!element) {
        element.value = str;
    }
}

function placeTranslations() {
    updateInputPlaceholder("textArea", chrome.i18n.getMessage("_translations.enterDesiredText"));
    updateElementText("inputWordsLabel", chrome.i18n.getMessage("_translations.words"));
    updateElementText("inputCharactersLabel", chrome.i18n.getMessage("_translations.characters"));
    updateElementText(
        "inputCharactersWithoutSpacesLabel",
        chrome.i18n.getMessage("_translations.charactersWithoutSpaces")
    );
}

function updateInputs() {
    updateInputValue("inputWords", String(counter.numberOfWords));
    updateInputValue("inputCharacters", String(counter.numberOfCharacters));
    updateInputValue(
        "inputCharactersWithoutSpaces",
        String(counter.numberOfCharactersWithoutSpace)
    );
}
