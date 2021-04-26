/*
export abstract class StandardInput<VALUE> extends Input<VALUE> {

    private _rawValue: string = '';
    get value(): VALUE { return this.decodeValue(this._rawValue) }
    set value(value: VALUE) {
        this._rawValue = this.encodeValue(value);
        this.invalidate();
    }


    get rawValue(): string { return this._rawValue; }



    constructor(defaultValue: VALUE) {
        super();
        this.value = defaultValue;
    }



    tranformRawToCooked(rawValue: string): VALUE {
        throw new Error(`${this.tagName}: Method 'tranformRawToCooked' is not defined.`);
    }


    decodeValue(rawValue: string): VALUE {
        return this.applyFilters(this.tranformRawToCooked(rawValue));
    }


    tranformCookedToRaw(value: VALUE): string {
        throw new Error(`${this.tagName}: Method 'tranformCookedToRaw' is not defined.`);
    }


    encodeValue(value: VALUE): string {
        return this.tranformCookedToRaw(value);
    }


    isSameValueAs(value: VALUE): boolean {
        throw new Error(`${this.tagName}: isSameValueAs is not defined.`);
    }


    onInput(rawValue: string): void {
        this._rawValue = rawValue;

        this.fireUpdateEvent();
    }

}

*/ 
