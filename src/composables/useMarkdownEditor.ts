import { ref, computed } from 'vue'
import { marked } from 'marked'

export function useMarkdownEditor(initialValue: string = '') {
  const markdown = ref(initialValue)
  
  const preview = computed(() => {
    return marked(markdown.value)
  })

  return {
    markdown,
    preview
  }
} 