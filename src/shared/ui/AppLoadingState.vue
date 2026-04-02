<template>
  <div class="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
    <p class="text-slate-600">{{ text || t('common.loading') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  text?: string
}>()
</script>