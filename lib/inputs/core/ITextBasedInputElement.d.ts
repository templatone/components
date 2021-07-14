import type { AutocapitalizeType } from "./AutocapitalizeType.js";
import type { AutocompleteType } from "./AutocompleteType.js";
import type { IInputElement } from "./IInputElement.js";
import type { InputModeType } from "./InputModeType.js";
export interface ITextBasedInputElement<ValueType> extends IInputElement<ValueType> {
    autocapitalize: AutocapitalizeType;
    autocomplete: AutocompleteType;
    inputMode: InputModeType | string;
    name: string;
    placeholder: string | null;
    spellcheck: boolean;
}
