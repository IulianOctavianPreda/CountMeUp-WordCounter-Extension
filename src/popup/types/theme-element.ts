import { ThemeType } from "./../enums/theme-type";

export interface ThemeElement {
    name: string;
    type: ThemeType;
    isImage: boolean;
}
