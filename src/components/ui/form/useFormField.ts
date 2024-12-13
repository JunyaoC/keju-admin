import { inject } from 'vue'
import { FORM_FIELD_INJECTION_KEY } from './injectionKeys'
import type { FormFieldContext } from './types'

export function useFormField() {
  const field = inject(FORM_FIELD_INJECTION_KEY)

  if (!field) {
    throw new Error('useFormField must be used within a FormField')
  }

  return field as FormFieldContext
}
