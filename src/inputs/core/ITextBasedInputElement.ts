import type { AutocompleteType } from "./AutocompleteType.js";
import type { IInputElement } from "./IInputElement.js";
import type { InputModeType } from "./InputModeType.js";

export interface ITextBasedInputElement<ValueType> extends IInputElement<ValueType> {
    placeholder: string | null,
    autocomplete: AutocompleteType,
    spellcheck: boolean,
    inputMode: InputModeType | string,
}
