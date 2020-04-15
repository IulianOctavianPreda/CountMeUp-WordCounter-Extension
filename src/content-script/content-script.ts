import { Message } from "../shared/enums/message";
import { MessagePassingService } from "../shared/services/message-passing-service";
import { SideMenu } from "./side-menu";

const sideMenu = new SideMenu();
MessagePassingService.addMessageListener(
    { source: Message.BackgroundId, destination: Message.ContentId },
    (data) => {
        sideMenu.reInitialize(data);
        sideMenu.showMenu();
    }
);

document.addEventListener("mouseup", (event) => {
    const selectedText = window?.getSelection()?.toString();
    if (!!selectedText) {
        MessagePassingService.sendMessage(
            { source: Message.ContentId, destination: Message.BackgroundId, name: "selectedText" },
            selectedText
        );
    }
});
