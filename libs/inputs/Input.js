import { CustomElement } from "../../libs/CustomElement.js";
export class Input extends CustomElement {
    constructor() {
        super(...arguments);
        this.eventRepeaterDelay = 100;
        this._eventRepeater = NaN;
        this._eventWaiter = NaN;
        // Rules
        this._rules = [];
        this.filters = [];
    }
    get value() {
        throw new Error(`${this.tagName}: Property 'value' is not defined.`);
    }
    addRule(validator, message = null) {
        this._rules.push({
            validator,
            message,
        });
    }
    setRules(rules) {
        this._rules = rules;
    }
    getRules() {
        return [...this._rules];
    }
    isValid() {
        const rules = this.getRules();
        const value = this.value;
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.validator(value) == false)
                return false;
        }
        return true;
    }
    static applyFilters(filters, value) {
        return filters.reduce((value, filter) => {
            return filter(value);
        }, value);
    }
    fireUpdateEvent() {
        this.fireImmediatelyUpdateEvent();
        if (isNaN(this._eventWaiter)) {
            this.fireStartUpdateEvent();
        }
        else {
            clearTimeout(this._eventWaiter);
        }
        this._eventWaiter = window.setTimeout(() => {
            this.fireStableUpdateEvent();
            this._eventWaiter = NaN;
        }, this.eventRepeaterDelay);
        if (isNaN(this._eventRepeater)) {
            this._eventRepeater = window.setTimeout(() => {
                this.fireStableUpdateEvent();
                this._eventRepeater = NaN;
            }, this.eventRepeaterDelay);
        }
    }
    fireImmediatelyUpdateEvent() {
        const evnt = new InputEvent(InputEvent.UPDATE, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }
    fireStableUpdateEvent() {
        const evnt = new InputEvent(InputEvent.UPDATE_STABLE, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }
    fireStartUpdateEvent() {
        const evnt = new InputEvent(InputEvent.UPDATE_START, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }
    fireEndUpdateEvent() {
        const evnt = new InputEvent(InputEvent.UPDATE_END, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }
    fireFocusEvent() {
        const evnt = new InputEvent(InputEvent.FOCUS, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }
    fireBlurEvent() {
        const evnt = new InputEvent(InputEvent.BLUR, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }
    getTemplate() {
        throw new Error(`${this.tagName}: Method 'getTemplate' is not defined.`);
    }
    connectedCallback() {
        super.invalidate();
    }
}
export class InputEvent extends CustomEvent {
    constructor(typeArg, value, isValid) {
        super(typeArg, {
            detail: {
                value, valid: isValid
            }
        });
    }
}
InputEvent.FOCUS = "focus" /* FOCUS */;
InputEvent.BLUR = "blur" /* BLUR */;
InputEvent.UPDATE = "update" /* UPDATE */;
InputEvent.UPDATE_STABLE = "update-delayed" /* UPDATE_DELAYED */;
InputEvent.UPDATE_START = "update-start" /* UPDATE_START */;
InputEvent.UPDATE_END = "update-end" /* UPDATE_END */;
export class InputFilters {
    static trim(v) {
        return v.trim();
    }
    static trimEachLines(v) {
        const splitter = '\n';
        const lines = v.split(splitter);
        return lines.map(l => l.trim()).join(splitter);
    }
    static reduceSpaces(v) {
        InputFilters.regex.spaces.lastIndex = 0;
        return v.replace(InputFilters.regex.spaces, ' ');
    }
    static reduceBreaklines(v) {
        if (v == '')
            return '';
        InputFilters.regex.breaklines.lastIndex = 0;
        return v.replace(InputFilters.regex.breaklines, '\n');
    }
    static lowerCase(v) {
        return v.toLocaleLowerCase();
    }
    static upperCase(v) {
        return v.toLocaleUpperCase();
    }
    static blankToNull(v) {
        return v != "" ? v : null;
    }
}
InputFilters.regex = {
    spaces: /\u0020+/g,
    breaklines: /(\r*\n)+/g,
};
