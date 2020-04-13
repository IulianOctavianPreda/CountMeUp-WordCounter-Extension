import { ThemeType } from "../../shared/enums/theme-type";
import { ThemeElement } from "./../../shared/types/theme-element";

export const ThemeElementsModel: ThemeElement[] = [
    {
        name: "img",
        type: ThemeType.Tag,
        isImage: true,
    },
    {
        name: "body",
        type: ThemeType.Tag,
        isImage: false,
    },
    {
        name: "card",
        type: ThemeType.Class,
        isImage: false,
    },
    {
        name: "form-control",
        type: ThemeType.Class,
        isImage: false,
    },
    {
        name: "btn list",
        type: ThemeType.Class,
        isImage: false,
    },
    {
        name: "input-group-text",
        type: ThemeType.Class,
        isImage: false,
    },
    {
        name: "dropdown-content",
        type: ThemeType.Class,
        isImage: false,
    },
];
