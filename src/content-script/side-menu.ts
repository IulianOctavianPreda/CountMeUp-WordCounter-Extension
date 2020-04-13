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
            style="height:100%; width:CALC(100% - ${this.borderSize}px); ${
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

    get panelIframe() {
        return <HTMLIFrameElement>document.getElementById("wordsCounterSidePanelIframe");
    }

    showMenu() {
        this.panel.style.width = 320 + this.borderSize + "px";
    }

    hideMenu() {
        this.panel.style.width = "0px";
    }

    addListeners() {
        // this.bubbleIframeMouseMove(this.panelIframe);
        const resizeEvent = this.resize.bind(this);

        this.panel.addEventListener(
            "mousedown",
            (e) => {
                if (this.side === MenuPosition.Right) {
                    if (e.offsetX < this.borderSize) {
                        this.mousePosition = e.x;
                        document.addEventListener("mousemove", resizeEvent);
                    }
                }
                if (this.side === MenuPosition.Left) {
                    if (
                        this.panel.offsetWidth - this.borderSize < e.offsetX &&
                        e.offsetX < this.panel.offsetWidth
                    ) {
                        this.mousePosition = e.x;
                        document.addEventListener("mousemove", resizeEvent);
                    }
                }
            },
            false
        );

        document.addEventListener(
            "mouseup",
            () => {
                document.removeEventListener("mousemove", resizeEvent);
            },
            false
        );

        document.addEventListener(
            "dblclick",
            () => {
                this.hideMenu();
            },
            false
        );
    }

    resize(e) {
        let dx = 0;
        if (this.side === MenuPosition.Right) {
            dx = this.mousePosition - e.x;
        } else {
            dx = e.x - this.mousePosition;
        }
        this.mousePosition = e.x;

        const panelWidth = parseInt(this.panel.style.width, 10);
        if (panelWidth < 50) {
            this.panel.style.width = "0px";
        } else {
            this.panel.style.width = parseInt(this.panel.style.width, 10) + dx + "px";
        }
    }

    /*
        Left for academic purposes, if you have the same source as the web page in your iframe,
        you can bubble up the event sending the relevant information in order "to listen" to the incoming event
        from the iframe. Other method as a workaround is using message passing.
    */

    // bubbleIframeMouseMove(iframe: HTMLIFrameElement) {
    //     if (!!iframe && !!iframe.contentWindow) {
    //         iframe.contentWindow.addEventListener("mousemove", (event) => {
    //             console.log("in ifrapme");
    //             const boundingClientRect = iframe.getBoundingClientRect();

    //             const evt = new CustomEvent("mousemove", { bubbles: true, cancelable: false });
    //             evt["clientX"] = event.clientX + boundingClientRect.left;
    //             evt["clientY"] = event.clientY + boundingClientRect.top;
    //             evt["screenX"] = event.screenX;
    //             evt["screenY"] = event.screenY;
    //             evt["ctrlKey"] = event.ctrlKey;
    //             evt["altKey"] = event.altKey;
    //             evt["shiftKey"] = event.shiftKey;
    //             evt["metaKey"] = event.metaKey;
    //             evt["button"] = event.button;
    //             iframe.dispatchEvent(evt);
    //         });
    //         iframe.contentWindow.addEventListener("click", () => console.log("click"));
    //     }
    // }
}
