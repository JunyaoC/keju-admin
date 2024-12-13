<script setup lang="ts">
import { inject, provide } from 'vue'
import { useField } from 'vee-validate'
import { FORM_FIELD_INJECTION_KEY } from './injectionKeys'
import type { FormFieldContext } from './types'

const props = defineProps<{
  name: string
  validate?: (value: unknown) => string | boolean | Promise<string | boolean>
}>()

const field = useField(props.name, props.validate)

provide(FORM_FIELD_INJECTION_KEY, {
  ...field,
  name: props.name
})
</script>

<template>
  <div class="space-y-2">
    <slot />
  </div>
</template>