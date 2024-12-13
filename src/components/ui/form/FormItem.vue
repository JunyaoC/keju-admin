<script setup lang="ts">
import { provide } from 'vue'
import { FORM_ITEM_INJECTION_KEY } from './injectionKeys'
import { useId } from '@/lib/utils'

const id = useId()
provide(FORM_ITEM_INJECTION_KEY, id)
</script>

<template>
  <div class="space-y-2">
    <slot />
  </div>
</template>
