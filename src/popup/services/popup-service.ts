import { Counter } from "../../shared/counter";
import { Message } from "../../shared/enums/message";
import { Storage } from "../../shared/enums/storage";
import { MessagePassingService } from "../../shared/services/message-passing-service";
import { StorageService } from "../../shared/services/storage-service";
import { Identifiers } from "../enums/identifiers";
import { Property } from "../enums/property";
import { ImageElementsModel } from "../models/image-elements-model";
import { ThemeElementsModel } from "../models/theme-elements-model";
import { TranslatableElementsModel } from "../models/translatable-elements-model";
import { ViewMethod } from "./../../shared/enums/view-method";
import { DomUtils } from "./dom-utils";
import { ImageService } from "./image-service";
import { ThemeService } from "./theme-service";
import { TranslationService } from "./translation-service";

export class PopupService {
    private counter = new Counter();

    constructor() {
        ThemeService.createDarkThemeCss();
        TranslationService.updateTranslations(TranslatableElementsModel);
        ImageService.updateSources(ImageElementsModel);
    }

    public initializeFromStorage() {
        StorageService.getFromStorage(
            Storage.SelectedText,
            this.updateUsingSelectedText.bind(this)
        );

        StorageService.getFromStorage(Storage.DarkTheme, (data) => {
            this.changeTheme(data);
            this.updateDarkThemeSwitch(data);
        });

        StorageService.getFromStorage(Storage.SelectedViewMethod, (data) => {
            this.checklistUpdate(data);
        });
    }

    public addListeners() {
        this.addOptionMenuListeners();

        MessagePassingService.addMessageListener(
            { source: Message.BackgroundId, destination: Message.PopupId, name: "selectedText" },
            this.updateUsingSelectedText.bind(this)
        );

        (<HTMLInputElement>document.getElementById(Identifiers.TextArea))?.addEventListener(
            "keyup",
            (event) => {
                this.counter.setText((event as any)?.target.value);
                this.updateInputs();
            }
        );

        (<HTMLInputElement>document.getElementById(Identifiers.DarkSwitch))?.addEventListener(
            "click",
            (event) => {
                const inputValue = (event as any)?.target.checked;
                StorageService.saveToStorage(Storage.DarkTheme, inputValue);
                this.changeTheme(inputValue);
            }
        );
    }

    private updateUsingSelectedText(data) {
        if (!!data) {
            this.counter.setText(data);
            DomUtils.updateElement(Identifiers.TextArea, Property.Value, data);
            this.updateInputs();
        }
        StorageService.removeFromStorage(Storage.SelectedText);
    }

    private addOptionMenuListeners() {
        const _this = this;
        const optionMenuIdList = Object.keys(ViewMethod)
            .map((k) => ViewMethod[k])
            .map((v) => v as ViewMethod);
        optionMenuIdList.forEach((element) => {
            (<HTMLInputElement>document.getElementById(element))?.addEventListener(
                "click",
                function () {
                    _this.checklistUpdateEvent(this);
                }
            );
        });
    }

    private checklistUpdateEvent(element: any) {
        this.checklistUpdate(element.id);
    }

    private checklistUpdate(id: string) {
        const optionMenuCheckIconIdList = Object.keys(ViewMethod)
            .map((k) => ViewMethod[k])
            .map((v) => v + "Check");
        const idToShow = optionMenuCheckIconIdList.find((x) => x.includes(id));
        const idToHide = optionMenuCheckIconIdList.filter((x) => idToShow !== x);
        idToHide.forEach((element) => {
            DomUtils.hideElementById(element);
        });
        DomUtils.showElementById(idToShow ?? "");
        StorageService.saveToStorage(Storage.SelectedViewMethod, id);
    }

    private changeTheme(isDark) {
        if (isDark) {
            this.toDarkTheme();
        } else {
            this.toLightTheme();
        }
    }

    private toDarkTheme() {
        ThemeService.addDarkTheme(ThemeElementsModel);
    }

    private toLightTheme() {
        ThemeService.removeDarkTheme(ThemeElementsModel);
    }

    private updateDarkThemeSwitch(isDark) {
        DomUtils.updateElement(Identifiers.DarkSwitch, Property.Checked, isDark);
    }

    private updateInputs() {
        DomUtils.updateElement(
            Identifiers.InputWords,
            Property.Value,
            String(this.counter.numberOfWords)
        );
        DomUtils.updateElement(
            Identifiers.InputCharacters,
            Property.Value,
            String(this.counter.numberOfCharacters)
        );
        DomUtils.updateElement(
            Identifiers.InputCharactersWithoutSpaces,
            Property.Value,
            String(this.counter.numberOfCharactersWithoutSpaces)
        );
    }
}
