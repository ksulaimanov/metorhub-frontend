<template>
  <div class="w-full">
    <label v-if="label" :for="fieldId" class="mb-1.5 block text-sm font-medium text-text-primary">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <!--
      Slot props wire the control to its label and messages.
      Call sites should spread them onto the input:
        <AppField label="Email" :error="err" v-slot="f">
          <AppInput :id="f.id" :aria-describedby="f.describedBy" :error="f.invalid" />
        </AppField>
      Omitting them still renders correctly — the association is just lost.
    -->
    <slot :id="fieldId" :described-by="describedBy" :invalid="!!error" />

    <p
        v-if="error"
        :id="`${fieldId}-error`"
        class="mt-1.5 text-sm text-danger"
        role="alert"
    >
      {{ error }}
    </p>
    <p
        v-else-if="hint"
        :id="`${fieldId}-hint`"
        class="mt-1.5 text-sm text-text-muted"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  label?: string
  error?: string
  hint?: string
  required?: boolean
  /** Override the generated id when the control already has one. */
  id?: string
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? generatedId)

const describedBy = computed(() => {
  if (props.error) return `${fieldId.value}-error`
  if (props.hint) return `${fieldId.value}-hint`
  return undefined
})
</script>
