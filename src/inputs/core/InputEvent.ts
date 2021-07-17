const enum EventType {
    Focus = 'focus',
    Blur = 'blur',
    Update = 'update',
    UpdatePeriodically = 'update-periodically',
    UpdateStart = 'update-start',
    UpdateStop = 'update-stop',
}



export class InputEvent<ValueType> extends CustomEvent<{
    value: ValueType,
    valid: boolean,
}> {

    static readonly Focus = EventType.Focus;
    static readonly Blur = EventType.Blur;
    static readonly Update = EventType.Update;
    static readonly UpdatePeriodically = EventType.UpdatePeriodically;
    static readonly UpdateStart = EventType.UpdateStart;
    static readonly UpdateStop = EventType.UpdateStop;

    constructor(typeArg: EventType, value: ValueType, isValid: boolean) {
        super(typeArg, {
            detail: {
                value, valid: isValid
            }
        })
    }
}
