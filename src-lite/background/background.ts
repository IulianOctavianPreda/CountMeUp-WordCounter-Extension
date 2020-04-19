import { Message } from "../../src/shared/enums/message";
import { MessagePassingService } from "../../src/shared/services/message-passing-service";

chrome.contextMenus.create({
    title: `Word counter`,
    contexts: ["selection"],
    id: "WordsCounter",
});

MessagePassingService.addMessageListener(
    { source: Message.ContentId, destination: Message.BackgroundId, name: "selectedText" },
    (selectedText) => {
        chrome.contextMenus.update("WordsCounter", {
            title: `${formattedTextLong(selectedText)}`,
        });
    }
);

function numberOfWords(text = "") {
    return text.trim().split(" ").length;
}

function numberOfCharacters(text = "") {
    return text.trim().length;
}

function formattedTextLong(text = "") {
    return `${numberOfWordsLocaleString(text)} - ${numberOfCharactersLocaleString(text)}`;
}

function numberOfWordsLocaleString(text = "") {
    const nrOfWords = numberOfWords(text);
    if (nrOfWords === 1) {
        return `${nrOfWords} ${chrome.i18n.getMessage("_word")}`;
    }
    return `${nrOfWords} ${chrome.i18n.getMessage("_words")}`;
}

function numberOfCharactersLocaleString(text) {
    const nrOfCharacters = numberOfCharacters(text);
    if (nrOfCharacters === 1) {
        return `${nrOfCharacters} ${chrome.i18n.getMessage("_character")}`;
    }
    return `${nrOfCharacters} ${chrome.i18n.getMessage("_characters")}`;
}
