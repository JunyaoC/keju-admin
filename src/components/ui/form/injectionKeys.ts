import type { InjectionKey } from 'vue'
import type { FormItemContext, FormFieldContext } from './types'

export const FORM_ITEM_INJECTION_KEY = Symbol('form-item') as InjectionKey<FormItemContext>
export const FORM_FIELD_INJECTION_KEY = Symbol('form-field') as InjectionKey<FormFieldContext>
