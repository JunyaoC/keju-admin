import { defineComponent, PropType } from 'vue'

export interface Step {
  title: string;
  isValid: boolean;
}

export const Steps = defineComponent({
  name: 'Steps',
  props: {
    steps: {
      type: Array as PropType<Step[]>,
      required: true
    },
    currentStep: {
      type: Number,
      required: true
    }
  },
  template: `
    <div class="flex items-center justify-between">
      <template v-for="(step, index) in steps" :key="index">
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full"
            :class="[
              index <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            ]"
          >
            {{ index + 1 }}
          </div>
          
          <span 
            class="ml-2 text-sm font-medium"
            :class="[
              index <= currentStep 
                ? 'text-foreground' 
                : 'text-muted-foreground'
            ]"
          >
            {{ step.title }}
          </span>

          <div 
            v-if="index < steps.length - 1"
            class="w-12 h-px mx-4"
            :class="[
              index < currentStep 
                ? 'bg-primary' 
                : 'bg-muted'
            ]"
          />
        </div>
      </template>
    </div>
  `
}) 