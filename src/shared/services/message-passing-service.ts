import { Message } from "../enums/message";

export class MessagePassingService {
    public static sendMessageToContentScript(
        tabId: number,
        msg: { source: string; name?: string },
        data: any,
        responseCallback?: (response: any) => void
    ): void {
        chrome.tabs.sendMessage(
            tabId,
            { msg: { source: msg.source, destination: Message.ContentId, name: msg.name }, data },
            responseCallback
        );
    }

    public static sendMessage(
        msg: { source: string; destination: string; name?: string },
        data: any,
        responseCallback?: (response: any) => void
    ): void {
        chrome.runtime.sendMessage({ msg, data }, responseCallback);
    }

    public static addMessageListener(
        msg: { source: string; destination: string; name?: string },
        callback: (
            data: any,
            sender?: chrome.runtime.MessageSender,
            sendResponse?: (response?: any) => void
        ) => void
    ): void {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.msg.source === msg.source && request.msg.destination === msg.destination) {
                if (!!msg.name) {
                    if (msg?.name === request.msg?.name) {
                        callback(request.data, sender, sendResponse);
                    }
                } else {
                    callback(request.data, sender, sendResponse);
                }
            }
        });
    }
}
