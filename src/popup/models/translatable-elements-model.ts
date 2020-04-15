import { Property } from "../enums/property";
import { TranslatableElement } from "../types/translatable-element";

export const TranslatableElementsModel: TranslatableElement[] = [
    {
        id: "textArea",
        translateId: "_enterDesiredText",
        property: Property.Placeholder,
    },
    {
        id: "cardTitle",
        translateId: "extDescription",
        property: Property.InnerText,
    },
    {
        id: "inputWordsLabel",
        translateId: "_words",
        property: Property.InnerText,
    },
    {
        id: "inputCharactersLabel",
        translateId: "_characters",
        property: Property.InnerText,
    },
    {
        id: "inputCharactersWithoutSpacesLabel",
        translateId: "_charactersWithoutSpaces",
        property: Property.InnerText,
    },
    {
        id: "popup",
        translateId: "_inPopup",
        property: Property.InnerText,
    },
    {
        id: "sideMenuLeft",
        translateId: "_insideMenuLeft",
        property: Property.InnerText,
    },
    {
        id: "sideMenuRight",
        translateId: "_insideMenuRight",
        property: Property.InnerText,
    },
    {
        id: "extension",
        translateId: "_inExtension",
        property: Property.InnerText,
    },
];
