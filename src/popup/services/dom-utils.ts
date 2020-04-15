import { Property } from "../enums/property";
import { Identifiers } from "./../enums/identifiers";

export class DomUtils {
    public static updateElement(id: Identifiers, property: Property, value: string | number) {
        const element = document.getElementById(id);
        if (!!element) {
            element[property] = value;
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
