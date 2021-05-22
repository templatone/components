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
export var InputModeType;
(function(InputModeType2) {
  InputModeType2["Default"] = "";
  InputModeType2["None"] = "none";
  InputModeType2["Text"] = "text";
  InputModeType2["Url"] = "url";
  InputModeType2["Email"] = "email";
  InputModeType2["Numeric"] = "numeric";
  InputModeType2["Search"] = "search";
  InputModeType2["Tel"] = "tel";
  InputModeType2["Decimal"] = "decimal";
})(InputModeType || (InputModeType = {}));
export var AutocompleteType;
(function(AutocompleteType2) {
  AutocompleteType2["Off"] = "off";
  AutocompleteType2["On"] = "on";
  AutocompleteType2["Name"] = "name";
  AutocompleteType2["HonorificPrefix"] = "honorific-prefix";
  AutocompleteType2["GivenName"] = "given-name";
  AutocompleteType2["AdditionalName"] = "additional-name";
  AutocompleteType2["FamilyName"] = "family-name";
  AutocompleteType2["HonorificSuffix"] = "honorific-suffix";
  AutocompleteType2["Nickname"] = "nickname";
  AutocompleteType2["Email"] = "email";
  AutocompleteType2["Username"] = "username";
  AutocompleteType2["NewPassword"] = "new-password";
  AutocompleteType2["CurrentPassword"] = "current-password";
  AutocompleteType2["OneTimeCode"] = "one-time-code";
  AutocompleteType2["OrganizationTitle"] = "organization-title";
  AutocompleteType2["Organization"] = "organization";
  AutocompleteType2["StreetAddress"] = "street-address";
  AutocompleteType2["AddressLine1"] = "address-line1";
  AutocompleteType2["AddressLine2"] = "address-line2";
  AutocompleteType2["AddressLine3"] = "address-line3";
  AutocompleteType2["AddressLevel4"] = "address-level4";
  AutocompleteType2["AddressLevel3"] = "address-level3";
  AutocompleteType2["AddressLevel2"] = "address-level2";
  AutocompleteType2["AddressLevel1"] = "address-level1";
  AutocompleteType2["Country"] = "country";
  AutocompleteType2["CountryName"] = "country-name";
  AutocompleteType2["PostalCode"] = "postal-code";
  AutocompleteType2["CcName"] = "cc-name";
  AutocompleteType2["CcGivenName"] = "cc-given-name";
  AutocompleteType2["CcAdditionalName"] = "cc-additional-name";
  AutocompleteType2["CcFamilyName"] = "cc-family-name";
  AutocompleteType2["CcNumber"] = "cc-number";
  AutocompleteType2["CcExp"] = "cc-exp";
  AutocompleteType2["CcExpMonth"] = "cc-exp-month";
  AutocompleteType2["CcExpYear"] = "cc-exp-year";
  AutocompleteType2["CcCsc"] = "cc-csc";
  AutocompleteType2["CcType"] = "cc-type";
  AutocompleteType2["TransactionCurrency"] = "transaction-currency";
  AutocompleteType2["TransactionAmount"] = "transaction-amount";
  AutocompleteType2["Language"] = "language";
  AutocompleteType2["Bday"] = "bday";
  AutocompleteType2["BdayDay"] = "bday-day";
  AutocompleteType2["BdayMonth"] = "bday-month";
  AutocompleteType2["BdayYear"] = "bday-year";
  AutocompleteType2["Sex"] = "sex";
  AutocompleteType2["Tel"] = "tel";
  AutocompleteType2["TelCountryCode"] = "tel-country-code";
  AutocompleteType2["TelNational"] = "tel-national";
  AutocompleteType2["TelAreaCode"] = "tel-area-code";
  AutocompleteType2["TelLocal"] = "tel-local";
  AutocompleteType2["TelExtension"] = "tel-extension";
  AutocompleteType2["Impp"] = "impp";
  AutocompleteType2["Url"] = "url";
  AutocompleteType2["Photo"] = "photo";
})(AutocompleteType || (AutocompleteType = {}));
