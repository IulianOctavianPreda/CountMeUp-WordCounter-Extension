import { Message } from "../../src/shared/enums/message";
import { MessagePassingService } from "../../src/shared/services/message-passing-service";

try{
    document.addEventListener("mouseup", (event) => {
        const selectedText = window?.getSelection()?.toString();
        if (!!selectedText) {
            MessagePassingService.sendMessage(
                { source: Message.ContentId, destination: Message.BackgroundId, name: "selectedText" },
                selectedText
            );
        }
    });
} catch(err){
    console.error(err);
}