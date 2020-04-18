import { MenuPosition } from "../shared/enums/menu-position";
import { Message } from "../shared/enums/message";
import { MessagePassingService } from "../shared/services/message-passing-service";
import { MouseButton } from "./enums/mouse-button";

export class SideMenu {
    isHidden = true;
    borderSize = 5;
    side = MenuPosition.Right;
    cssSide = {
        [MenuPosition.Right]: {
            div: { right: "0px", left: "auto" },
            iframe: {
                marginLeft: `${this.borderSize}px`,
                marginRight: `0px`,
            },
        },
        [MenuPosition.Left]: {
            div: { right: "auto", left: "0px" },
            iframe: {
                marginLeft: `0px`,
                marginRight: `${this.borderSize}px`,
            },
        },
    };

    constructor() {
        this.render();
        this.postRenderUpdate();
        this.addListeners();
    }

    get template() {
        return `
    <div
        id="countMeUpWordCounterSidePanel"
        style="height:100%;
                   position: fixed;
                   width: 0px;
                   top:0;
                   border: 0;
                   padding: 0;
                   z-index:9000000000000000000;
                   background-color:black"
        >
        <iframe
            id="countMeUpWordCounterSidePanelIframe"
            src="${chrome.extension.getURL("popup/popup.html")}"
            style="height:100%; width:CALC(100% - ${this.borderSize}px); border:0;"
        "></iframe>
    </div>
    `;
    }

    reInitialize(side: MenuPosition = MenuPosition.Right) {
        if (side !== this.side) {
            this.side = side;
            this.postRenderUpdate();
        }
    }

    render(
        htmlElement: HTMLElement = <HTMLElement>document.getElementsByTagName("body")[0],
        position: InsertPosition = "beforeend"
    ) {
        htmlElement.insertAdjacentHTML(position, this.template);
    }

    postRenderUpdate() {
        this.panel.style.left = this.cssSide[this.side].div.left;
        this.panel.style.right = this.cssSide[this.side].div.right;
        this.iframePanel.style.marginLeft = this.cssSide[this.side].iframe.marginLeft;
        this.iframePanel.style.marginRight = this.cssSide[this.side].iframe.marginRight;
    }

    get panel() {
        return <HTMLElement>document.getElementById("countMeUpWordCounterSidePanel");
    }

    get iframePanel() {
        return <HTMLElement>document.getElementById("countMeUpWordCounterSidePanelIframe");
    }

    showMenu() {
        this.isHidden = false;
        this.panel.style.width = 320 + this.borderSize + "px";
    }

    hideMenu() {
        this.isHidden = true;
        this.panel.style.width = "0px";
    }
    addListeners() {
        document.addEventListener("mousedown", (e) => {
            if (e.button === MouseButton.Middle && !this.isHidden) {
                this.hideMenu();
                e.preventDefault();
                e.stopPropagation();
            }
        });

        MessagePassingService.addMessageListener(
            { source: Message.PopupId, destination: Message.ContentId, name: "closeSideMenu" },
            this.hideMenu.bind(this)
        );
    }
}
