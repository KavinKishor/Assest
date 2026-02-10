import { EventEmitter } from "events";

// Global variable to maintain consistent event emitter across hot reloads in Next.js
// eslint-disable-next-line no-var
declare global {
    // eslint-disable-next-line no-var
    var notificationEmitter: EventEmitter | undefined;
}

const notificationEmitter = global.notificationEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
    global.notificationEmitter = notificationEmitter;
}

export { notificationEmitter };
