declare const enum EventType {
    FOCUS = "focus",
    BLUR = "blur",
    UPDATE = "update",
    UPDATE_DELAYED = "update-delayed",
    UPDATE_START = "update-start",
    UPDATE_END = "update-end"
}
export declare class InputEvent<VALUE> extends CustomEvent<{
    value: VALUE;
    valid: boolean;
}> {
    static readonly FOCUS = EventType.FOCUS;
    static readonly BLUR = EventType.BLUR;
    static readonly UPDATE = EventType.UPDATE;
    static readonly UPDATE_STABLE = EventType.UPDATE_DELAYED;
    static readonly UPDATE_START = EventType.UPDATE_START;
    static readonly UPDATE_END = EventType.UPDATE_END;
    constructor(typeArg: EventType, value: VALUE, isValid: boolean);
}
export {};
