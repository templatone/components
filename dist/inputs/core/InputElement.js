import {LitElement} from "../../web-modules/pkg/lit.js";
import {InputEvent} from "./InputEvent.js";
export class InputElement extends LitElement {
  constructor() {
    super(...arguments);
    this.eventRepeaterDelay = 100;
    this._eventRepeater = NaN;
    this._eventWaiter = NaN;
    this._rules = [];
    this.filters = [];
  }
  addRule(validator, message = null) {
    this._rules.push({
      validator,
      message
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
    return filters.reduce((value2, filter) => {
      return filter(value2);
    }, value);
  }
  fireUpdateEvent() {
    this.fireImmediatelyUpdateEvent();
    if (isNaN(this._eventWaiter)) {
      this.fireStartUpdateEvent();
    } else {
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
}
const _InputFilters = class {
  static trim(v) {
    return v.trim();
  }
  static trimEachLines(v) {
    const splitter = "\n";
    const lines = v.split(splitter);
    return lines.map((l) => l.trim()).join(splitter);
  }
  static reduceSpaces(v) {
    _InputFilters.regex.spaces.lastIndex = 0;
    return v.replace(_InputFilters.regex.spaces, " ");
  }
  static reduceBreaklines(v) {
    if (v == "")
      return "";
    _InputFilters.regex.breaklines.lastIndex = 0;
    return v.replace(_InputFilters.regex.breaklines, "\n");
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
};
export let InputFilters = _InputFilters;
InputFilters.regex = {
  spaces: /\u0020+/g,
  breaklines: /(\r*\n)+/g
};
