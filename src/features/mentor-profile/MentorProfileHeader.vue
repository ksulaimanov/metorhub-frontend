<template>
  <AppCard>
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-2xl font-bold text-brand">
          <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="t('mentorProfile.avatarAlt')"
              class="h-full w-full object-cover"
          />
          <span v-else>{{ initials }}</span>
        </div>

        <div>
          <h2 class="text-xl font-semibold text-text-primary">{{ displayName }}</h2>
          <p v-if="headline" class="mt-1 text-sm text-text-secondary">{{ headline }}</p>
          <div v-if="verified" class="mt-2">
            <AppBadge variant="success">{{ t('mentorProfile.verified') }}</AppBadge>
          </div>
        </div>
      </div>

      <slot name="actions" />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppCard from '../../shared/ui/AppCard.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'

const { t } = useI18n()

const props = defineProps<{
  firstName?: string
  lastName?: string
  avatarUrl?: string
  headline?: string
  verified?: boolean
}>()

const displayName = computed(() => {
  const full = `${props.firstName || ''} ${props.lastName || ''}`.trim()
  return full || t('mentorProfile.newMentor')
})

const initials = computed(() => {
  const first = props.firstName?.charAt(0) || ''
  const last = props.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'M'
})
</script>

