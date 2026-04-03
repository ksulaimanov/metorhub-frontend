<template>
  <div v-if="hasAnyLink" class="flex items-center gap-3">
    <a
        v-if="instagram"
        :href="instagramHref"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t('social.instagram')"
        class="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition hover:bg-brand-soft hover:text-brand"
    >
      <Instagram class="h-[18px] w-[18px]" />
    </a>

    <a
        v-if="telegram"
        :href="telegramHref"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t('social.telegram')"
        class="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition hover:bg-brand-soft hover:text-brand"
    >
      <Send class="h-[18px] w-[18px]" />
    </a>

    <a
        v-if="email"
        :href="`mailto:${email}`"
        :aria-label="t('social.email')"
        class="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition hover:bg-brand-soft hover:text-brand"
    >
      <Mail class="h-[18px] w-[18px]" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Instagram, Send, Mail } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps<{
  instagram?: string | null
  telegram?: string | null
  email?: string | null
}>()

const hasAnyLink = computed(() => !!props.instagram || !!props.telegram || !!props.email)

const instagramHref = computed(() => {
  if (!props.instagram) return ''
  if (props.instagram.startsWith('http')) return props.instagram
  const handle = props.instagram.replace(/^@/, '')
  return `https://instagram.com/${handle}`
})

const telegramHref = computed(() => {
  if (!props.telegram) return ''
  if (props.telegram.startsWith('http')) return props.telegram
  const handle = props.telegram.replace(/^@/, '')
  return `https://t.me/${handle}`
})
</script>

