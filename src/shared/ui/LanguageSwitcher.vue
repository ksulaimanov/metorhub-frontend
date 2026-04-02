<template>
  <button
      type="button"
      @click="toggle"
      class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-brand-soft hover:text-brand"
      :title="t('common.switchLanguage')"
  >
    <span class="text-base leading-none">{{ flag }}</span>
    <span class="uppercase">{{ current }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { saveLocale, type SupportedLocale } from '@/shared/i18n/index'

const { locale, t } = useI18n()

const current = computed(() => locale.value as SupportedLocale)

const flag = computed(() => (current.value === 'ky' ? '🇰🇬' : '🇷🇺'))

function toggle() {
  const next: SupportedLocale = current.value === 'ky' ? 'ru' : 'ky'
  locale.value = next
  saveLocale(next)
}
</script>

