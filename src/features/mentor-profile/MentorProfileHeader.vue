<template>
  <AppCard>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex items-center gap-5">
        <ProfileAvatar
            :src="avatarUrl"
            :first-name="firstName"
            :last-name="lastName"
            :alt="t('mentorProfile.avatarAlt')"
            size="lg"
            class="h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-surface shadow-md shadow-slate-900/10"
        />

        <div class="min-w-0">
          <h2 class="text-xl font-semibold text-text-primary">{{ displayName }}</h2>
          <p v-if="headline" class="mt-1 text-sm text-text-secondary">{{ headline }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <AppBadge v-if="verified" variant="success">{{ t('mentorProfile.verified') }}</AppBadge>
            <SocialLinks
                :instagram="instagramUrl"
                :telegram="telegramUsername"
                :email="publicEmail"
            />
          </div>
        </div>
      </div>

      <div class="shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppCard from '../../shared/ui/AppCard.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import ProfileAvatar from '../../shared/ui/ProfileAvatar.vue'
import SocialLinks from '../../shared/ui/SocialLinks.vue'

const { t } = useI18n()

const props = defineProps<{
  firstName?: string
  lastName?: string
  avatarUrl?: string
  headline?: string
  verified?: boolean
  instagramUrl?: string
  telegramUsername?: string
  publicEmail?: string
}>()

const displayName = computed(() => {
  const full = `${props.firstName || ''} ${props.lastName || ''}`.trim()
  return full || t('mentorProfile.newMentor')
})
</script>

