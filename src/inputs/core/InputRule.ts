import { TemplateResult } from "lit";


export interface InputRuleType {
    message: TemplateResult | Element | string | null,
    validator: InputRuleValidatorType,
}


export interface InputRuleValidatorType {
    (value: any): boolean
}

