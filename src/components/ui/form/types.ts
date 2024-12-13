import type { FieldContext, FieldMeta } from 'vee-validate'

export interface FormItemContext {
  id: string
}

export interface FormFieldContext extends FieldContext {
  name: string
  value: unknown
  errorMessage?: string
  handleChange: (value: unknown) => void
  handleBlur: () => void
  meta: FieldMeta<unknown>
}