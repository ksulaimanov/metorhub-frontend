<template>
  <div class="relative">
    <AppInput
        :model-value="modelValue"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        :error="error"
        :placeholder="placeholder"
        class="pr-24"
        @update:model-value="$emit('update:modelValue', $event)"
    />
    <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:bg-brand-soft hover:text-brand"
        @click="visible = !visible"
    >
      {{ visible ? t('auth.hidePassword') : t('auth.showPassword') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInput from '../../shared/ui/AppInput.vue'

const { t } = useI18n()

defineProps<{
  modelValue: string
  autocomplete?: string
  error?: boolean
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const visible = ref(false)
</script>

