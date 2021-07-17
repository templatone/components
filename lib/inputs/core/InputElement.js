import {LitElement} from "../../web-modules/pkg/lit.js";
import {InputEvent} from "./InputEvent.js";
export class InputElement extends LitElement {
  constructor() {
    super(...arguments);
    this.eventRepeaterDelay = 220;
    this._eventRepeater = null;
    this._eventWaiter = null;
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
    const delay = this.eventRepeaterDelay;
    if (this._eventWaiter === null) {
      this.fireStartUpdateEvent();
    } else {
      clearTimeout(this._eventWaiter);
    }
    this.fireImmediatelyUpdateEvent();
    if (this._eventRepeater === null) {
      this._eventRepeater = window.setTimeout(() => {
        this.firePeriodicallyUpdateEvent();
        this._eventRepeater = null;
      }, delay);
    }
    this._eventWaiter = window.setTimeout(() => {
      this.fireStopUpdateEvent();
      this._eventWaiter = null;
    }, delay);
  }
  fireImmediatelyUpdateEvent() {
    const evnt = new InputEvent(InputEvent.Update, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  firePeriodicallyUpdateEvent() {
    const evnt = new InputEvent(InputEvent.UpdatePeriodically, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  fireStartUpdateEvent() {
    const evnt = new InputEvent(InputEvent.UpdateStart, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  fireStopUpdateEvent() {
    const evnt = new InputEvent(InputEvent.UpdateStop, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  fireFocusEvent() {
    const evnt = new InputEvent(InputEvent.Focus, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  fireBlurEvent() {
    const evnt = new InputEvent(InputEvent.Blur, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
}
