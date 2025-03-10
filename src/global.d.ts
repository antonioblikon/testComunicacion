// src/global.d.ts
export { };

declare global {
    interface Window {
        webkit?: {
            messageHandlers?: {
                iosListener?: {
                    postMessage: (message: string | Record<string, unknown>) => void;
                };
            };
        };
        receiveMessageFromiOS?: (message: string | Record<string, unknown>) => void;
    }
}