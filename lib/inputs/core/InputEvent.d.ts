declare const enum EventType {
    Focus = "focus",
    Blur = "blur",
    Update = "update",
    UpdatePeriodically = "update-periodically",
    UpdateStart = "update-start",
    UpdateEnd = "update-end"
}
export declare class InputEvent<ValueType> extends CustomEvent<{
    value: ValueType;
    valid: boolean;
}> {
    static readonly Focus = EventType.Focus;
    static readonly Blur = EventType.Blur;
    static readonly Update = EventType.Update;
    static readonly UpdatePeriodically = EventType.UpdatePeriodically;
    static readonly UpdateStart = EventType.UpdateStart;
    static readonly UpdateEnd = EventType.UpdateEnd;
    constructor(typeArg: EventType, value: ValueType, isValid: boolean);
}
export {};
