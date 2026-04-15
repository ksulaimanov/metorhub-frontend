<template>
  <div class="rounded-2xl border border-border-brand border-l-4 border-l-brand bg-surface-secondary/50 px-5 py-5">
    <div class="flex items-start gap-3">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <HelpCircle class="h-4 w-4" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-text-primary">{{ t('support.title') }}</p>
        <p class="mt-0.5 text-sm text-text-secondary">{{ t('support.description') }}</p>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <a
              href="https://t.me/ksulaimanov"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-2 text-sm font-medium text-text-primary ring-1 ring-border-brand transition hover:bg-brand-soft hover:text-brand"
          >
            <Send class="h-4 w-4" />
            Telegram
          </a>

          <a
              :href="`mailto:${SUPPORT_EMAIL}`"
              class="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-2 text-sm font-medium text-text-primary ring-1 ring-border-brand transition hover:bg-brand-soft hover:text-brand"
              aria-label="Contact support via email"
          >
            <Mail class="h-4 w-4 whitespace-nowrap" />
             {{ SUPPORT_EMAIL }}
          </a>

          <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-2 text-sm font-medium text-text-primary ring-1 ring-border-brand transition hover:bg-brand-soft hover:text-brand"
              aria-label="Copy support email"
              @click="copyEmail"
          >
            📋 Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Send, Mail, HelpCircle } from 'lucide-vue-next'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'

const { t } = useI18n()
const toastStore = useToastStore()

const SUPPORT_EMAIL = 'ksulaimanov.dev@gmail.com'

const copyEmail = () => {
  navigator.clipboard.writeText(SUPPORT_EMAIL)
  toastStore.success('Email copied to clipboard')
}
</script>

