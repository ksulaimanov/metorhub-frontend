<template>
  <div class="rounded-2xl border border-border-brand bg-surface-secondary/50 px-5 py-4">
    <p class="text-sm font-medium text-text-primary">{{ t('support.title') }}</p>
    <p class="mt-1 text-sm text-text-secondary">{{ t('support.description') }}</p>

    <div class="mt-3 flex flex-wrap items-center gap-3">
      <a
          href="https://t.me/ksulaimanov"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-text-primary ring-1 ring-border-brand transition hover:bg-brand-soft hover:text-brand"
      >
        <Send class="h-4 w-4" />
        Telegram
      </a>

      <a
          href="mailto:ksulaimanov.dev@gmail.com"
          class="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-text-primary ring-1 ring-border-brand transition hover:bg-brand-soft hover:text-brand"
      >
        <Mail class="h-4 w-4" />
        Email
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Send, Mail } from 'lucide-vue-next'

const { t } = useI18n()
</script>

