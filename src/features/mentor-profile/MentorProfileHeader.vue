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
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-white">{{ displayName }}</h2>
            <span v-if="username" class="rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]-secondary px-2 py-0.5 text-xs font-semibold tracking-wide text-brand/80">
              @{{ username }}
            </span>
          </div>
          <p v-if="headline" class="mt-1 text-sm text-slate-400">{{ headline }}</p>
          <div class="mt-3">
            <MentorRating :rating="rating" :reviewsCount="reviewsCount" />
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2">
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
import MentorRating from '../../shared/ui/MentorRating.vue'
import ProfileAvatar from '../../shared/ui/ProfileAvatar.vue'
import SocialLinks from '../../shared/ui/SocialLinks.vue'

const { t } = useI18n()

const props = defineProps<{
  firstName?: string
  lastName?: string
  username?: string
  avatarUrl?: string
  headline?: string
  verified?: boolean
  rating?: number
  reviewsCount?: number
  instagramUrl?: string
  telegramUsername?: string
  publicEmail?: string
}>()

const displayName = computed(() => {
  const full = `${props.firstName || ''} ${props.lastName || ''}`.trim()
  return full || t('mentorProfile.newMentor')
})
</script>
