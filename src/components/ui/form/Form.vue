<script setup lang="ts">
defineProps<{
  id?: string
  class?: string
}>()
</script>

<template>
  <form :id="id" :class="class">
    <slot />
  </form>
</template> 