<script setup lang="ts">
import { ref } from 'vue';
import { useField } from 'vee-validate';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const props = defineProps<{
  modelValue: {
    title: string;
    category: string;
    location: string;
    isRemote: boolean;
    description: string;
  }
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>();

const categories = [
  "Café/Restaurant",
  "Retail",
  "Event Staffing",
  "Delivery",
  "General Labor",
  "Others"
] as const;
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-2">
      <FormField name="title">
        <FormItem>
          <FormLabel>Job Title *</FormLabel>
          <FormControl>
            <Input 
              v-model="modelValue.title"
              required
              placeholder="e.g., Weekend Barista, Event Helper"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="category">
        <FormItem>
          <FormLabel>Category *</FormLabel>
          <Select v-model="modelValue.category" required>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem 
                  v-for="category in categories" 
                  :key="category" 
                  :value="category"
                >
                  {{ category }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField name="location">
      <FormItem>
        <FormLabel>Location *</FormLabel>
        <FormControl>
          <Input 
            v-model="modelValue.location"
            required
            placeholder="e.g., Kuala Lumpur, Petaling Jaya"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="isRemote">
      <FormItem class="flex items-center gap-2">
        <FormControl>
          <input 
            type="checkbox"
            v-model="modelValue.isRemote"
            class="rounded border-input"
          />
        </FormControl>
        <FormLabel>Remote Work Available</FormLabel>
      </FormItem>
    </FormField>

    <FormField name="description">
      <FormItem>
        <FormLabel>Job Description *</FormLabel>
        <FormControl>
          <Textarea
            v-model="modelValue.description"
            required
            :rows="6"
            placeholder="Describe the job role, responsibilities, and any specific requirements..."
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>