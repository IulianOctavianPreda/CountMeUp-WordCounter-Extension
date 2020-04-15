import { Property } from "../enums/property";
import { ImageElement } from "../types/image-element";
import { ViewMethod } from "./../../shared/enums/view-method";

export const ImageElementsModel: ImageElement[] = [
    {
        id: "menu",
        path: "assets/images/menu.svg",
        property: Property.Src,
    },
    {
        id: "sun",
        path: "assets/images/sun.svg",
        property: Property.Src,
    },
    {
        id: "moon",
        path: "assets/images/moon.svg",
        property: Property.Src,
    },
    {
        id: ViewMethod.Popup + "Check",
        path: "assets/images/check.svg",
        property: Property.Src,
    },
    {
        id: ViewMethod.SideMenuLeft + "Check",
        path: "assets/images/check.svg",
        property: Property.Src,
    },
    {
        id: ViewMethod.SideMenuRight + "Check",
        path: "assets/images/check.svg",
        property: Property.Src,
    },
];
