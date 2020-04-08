import { MenuPosition } from "../shared/enums/menu-position";

export class SideMenu {
    BORDER_SIZE = 5;
    mouse_position;
    cssPosition: { div: string; iframe: string };
    position: string;

    template = `
    <div
        id="wordsCounterSidePanel"
        style="height:100%;
                   position: fixed;
                   width: 0px;
                   ${this.cssPosition?.div}
                   top:0;
                   border: 0;
                   padding: 0;
                   z-index:9000000000000000000;
                   background-color:black"
        >
        <iframe
            id="wordsCounterSidePanelIframe"
            src="${chrome.extension.getURL("popup/popup.html")}"
            style="height:100%; width:CALC(100% - ${this.BORDER_SIZE}px); ${
        this.cssPosition?.iframe
    }"
        "></iframe>
    </div>
    `;

    constructor(side: MenuPosition = MenuPosition.Right) {
        this.position = side;
        if (side === MenuPosition.Left) {
            this.cssPosition = { div: "left:0;", iframe: `margin-right:${this.BORDER_SIZE}px;` };
        } else {
            this.cssPosition = { div: "right:0;", iframe: `margin-left:${this.BORDER_SIZE}px;` };
        }
    }

    render(
        htmlElement = <HTMLElement>document.getElementsByTagName("body")[0],
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
        this.panel.style.width = 320 + this.BORDER_SIZE + "px";
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
                if (this.position === MenuPosition.Right) {
                    if (e.offsetX < this.BORDER_SIZE) {
                        this.mouse_position = e.x;
                        document.addEventListener("mousemove", resizeEvent);
                    }
                }
                if (this.position === MenuPosition.Left) {
                    if (
                        this.panel.offsetWidth - this.BORDER_SIZE < e.offsetX &&
                        e.offsetX < this.panel.offsetWidth
                    ) {
                        this.mouse_position = e.x;
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
        if (this.position === MenuPosition.Right) {
            dx = this.mouse_position - e.x;
        } else {
            dx = e.x - this.mouse_position;
        }
        this.mouse_position = e.x;

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
