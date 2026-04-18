<template>
  <template v-if="isLoading">
    <div
      v-for="index in 2"
      :key="index"
      class="rounded-2xl border border-border-brand bg-surface p-5"
      aria-hidden="true"
    >
      <div class="h-4 w-1/3 rounded bg-brand/30 animate-pulse" />
      <div class="mt-3 h-3 w-full rounded bg-brand/15 animate-pulse" />
      <div class="mt-2 h-3 w-4/5 rounded bg-brand/15 animate-pulse" />
    </div>
  </template>
  <template v-else>
    <FeatureCard
      class="!bg-surface !border-border-brand !text-text-primary"
      :title="t('auth.loginHeroStudentTitle')"
      :description="t('auth.loginHeroStudentDesc')"
    />
    <FeatureCard
      class="!bg-surface !border-border-brand !text-text-primary"
      :title="t('auth.loginHeroMentorTitle')"
      :description="t('auth.loginHeroMentorDesc')"
    />
  </template>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FeatureCard from '@/shared/ui/FeatureCard.vue'

withDefaults(defineProps<{
  isLoading?: boolean
}>(), {
  isLoading: false,
})

const { t } = useI18n()
</script>
