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
      this.firePeriodicalUpdateEvent();
      this._eventWaiter = NaN;
    }, this.eventRepeaterDelay);
    if (isNaN(this._eventRepeater)) {
      this._eventRepeater = window.setTimeout(() => {
        this.firePeriodicalUpdateEvent();
        this._eventRepeater = NaN;
      }, this.eventRepeaterDelay);
    }
  }
  fireImmediatelyUpdateEvent() {
    const evnt = new InputEvent(InputEvent.Update, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  firePeriodicalUpdateEvent() {
    const evnt = new InputEvent(InputEvent.UpdatePeriodically, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  fireStartUpdateEvent() {
    const evnt = new InputEvent(InputEvent.UpdateStart, this.value, this.isValid());
    this.dispatchEvent(evnt);
  }
  fireEndUpdateEvent() {
    const evnt = new InputEvent(InputEvent.UpdateEnd, this.value, this.isValid());
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
