import { MenuPosition } from "../shared/enums/menu-position";

export class SideMenu {
    mousePosition;
    borderSize = 5;
    side = MenuPosition.Right;
    cssSide = {
        [MenuPosition.Right]: { div: "right:0;", iframe: `margin-left:${this.borderSize}px;` },
        [MenuPosition.Left]: { div: "left:0;", iframe: `margin-right:${this.borderSize}px;` },
    };

    constructor() {
        this.render();
        this.addListeners();
    }

    get template() {
        return `
    <div
        id="wordsCounterSidePanel"
        style="height:100%;
                   position: fixed;
                   width: 0px;
                   ${this.cssSide[this.side].div}
                   top:0;
                   border: 0;
                   padding: 0;
                   z-index:9000000000000000000;
                   background-color:black"
        >
        <iframe
            id="wordsCounterSidePanelIframe"
            src="${chrome.extension.getURL("popup/popup.html")}"
            style="height:100%; width:CALC(100% - ${this.borderSize}px); border:0; ${
            this.cssSide[this.side].iframe
        }"
        "></iframe>
    </div>
    `;
    }

    reInitialize(side: MenuPosition = MenuPosition.Right) {
        if (side !== this.side) {
            this.side = side;
            document.getElementById("wordsCounterSidePanel")?.remove();
            this.render();
        }
    }

    render(
        htmlElement: HTMLElement = <HTMLElement>document.getElementsByTagName("body")[0],
        position: InsertPosition = "beforeend"
    ) {
        htmlElement.insertAdjacentHTML(position, this.template);
    }

    get panel() {
        return <HTMLElement>document.getElementById("wordsCounterSidePanel");
    }

    showMenu() {
        this.panel.style.width = 320 + this.borderSize + "px";
    }

    hideMenu() {
        this.panel.style.width = "0px";
    }
    addListeners() {
        document.addEventListener(
            "dblclick",
            () => {
                this.hideMenu();
            },
            false
        );
    }
}
