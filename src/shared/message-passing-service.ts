import { Message } from "./enums/message";

export class MessagePassingService {
    public static sendMessageToPopup(
        data: object,
        responseCallback?: (response: any) => void
    ): void {
        MessagePassingService.sendMessage(Message.PopupId, data, responseCallback);
    }

    public static sendMessageToBackground(
        data: object,
        responseCallback?: (response: any) => void
    ): void {
        MessagePassingService.sendMessage(Message.BackgroundId, data, responseCallback);
    }

    public static sendMessageToContentScript(
        tabId: number,
        data: object,
        responseCallback?: (response: any) => void
    ): void {
        chrome.tabs.sendMessage(tabId, { id: Message.ContentId, data }, responseCallback);
    }

    public static addMessageListenerForBackground(
        callback: (data: any, sendResponse?: (response?: any) => void) => void
    ): void {
        MessagePassingService.addMessageListener(Message.BackgroundId, callback);
    }

    public static addMessageListenerForPopup(
        callback: (data: any, sendResponse?: (response?: any) => void) => void
    ): void {
        MessagePassingService.addMessageListener(Message.PopupId, callback);
    }

    public static addMessageListenerForContentScript(
        callback: (data: any, sendResponse?: (response?: any) => void) => void
    ): void {
        MessagePassingService.addMessageListener(Message.ContentId, callback);
    }

    public static sendMessage(
        id: string,
        data: object,
        responseCallback?: (response: any) => void
    ): void {
        chrome.runtime.sendMessage({ id, data }, responseCallback);
    }

    public static addMessageListener(
        id: string,
        callback: (data: any, sendResponse?: (response?: any) => void) => void
    ): void {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.id === id) {
                callback(request.data, sendResponse);
            }
        });
    }
}
