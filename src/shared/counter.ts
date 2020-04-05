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

    public get numberOfCharactersWithoutSpace() {
        return this.text.split(" ").join("").length;
    }
}
