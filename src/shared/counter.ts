export class Counter {
    private text = "";

    constructor(str = "") {
        this.text = str;
    }

    public setText(text: string) {
        this.text = text;
    }

    public get numberOfWords() {
        return this.text.split(" ").length;
    }

    public get numberOfCharacters() {
        return this.text.length;
    }

    public get numberOfCharactersWithoutSpaces() {
        return this.text.split(" ").join("").length;
    }

    public get numberOfWordsLocaleString() {
        const numberOfWords = this.numberOfWords;
        if (numberOfWords === 1) {
            return `${numberOfWords} ${chrome.i18n.getMessage("_word")}`;
        }
        return `${numberOfWords} ${chrome.i18n.getMessage("_words")}`;
    }

    public get numberOfCharactersLocaleString() {
        const numberOfCharacters = this.numberOfCharacters;
        if (numberOfCharacters === 1) {
            return `${numberOfCharacters} ${chrome.i18n.getMessage("_character")}`;
        }
        return `${numberOfCharacters} ${chrome.i18n.getMessage("_characters")}`;
    }

    public get numberOfCharactersWithoutSpacesLocaleString() {
        const numberOfCharactersWithoutSpaces = this.numberOfCharactersWithoutSpaces;
        if (numberOfCharactersWithoutSpaces === 1) {
            return `${numberOfCharactersWithoutSpaces} ${chrome.i18n.getMessage(
                "_characterWithoutSpaces"
            )}`;
        }
        return `${numberOfCharactersWithoutSpaces} ${chrome.i18n.getMessage(
            "_charactersWithoutSpaces"
        )}`;
    }
}
