import "./popup.scss";

import { Counter } from "../shared/counter";

const counter = new Counter();

placeTranslations();

(<HTMLInputElement>getElement("textArea"))?.addEventListener("keyup", (event) => {
    counter.setText((event as any)?.target.value);
    updateInputs();
});

window.addEventListener("load", (event) => {
    getFromStorage();
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.msg === Message.Id) {
//         alert(request.data.content);
//         updateInputValue("textArea", request.data.content);
//     }
// });

function getFromStorage() {
    chrome.storage.sync.get(["selection"], (data) => {
        if (!!data && !!data.selection) {
            updateInputValue("textArea", data.selection);
            updateInputs();
        }
        chrome.storage.sync.remove(["selection"]);
    });
}

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
    updateInputPlaceholder("textArea", chrome.i18n.getMessage("_enterDesiredText"));
    updateElementText("cardTitle", chrome.i18n.getMessage("extDescription"));
    updateElementText("inputWordsLabel", chrome.i18n.getMessage("_words"));
    updateElementText("inputCharactersLabel", chrome.i18n.getMessage("_characters"));
    updateElementText(
        "inputCharactersWithoutSpacesLabel",
        chrome.i18n.getMessage("_charactersWithoutSpaces")
    );
}

function updateInputs() {
    updateInputValue("inputWords", String(counter.numberOfWords));
    updateInputValue("inputCharacters", String(counter.numberOfCharacters));
    updateInputValue(
        "inputCharactersWithoutSpaces",
        String(counter.numberOfCharactersWithoutSpaces)
    );
}
