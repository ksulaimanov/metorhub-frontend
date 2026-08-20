<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <AppCard>
      <p class="text-sm text-text-secondary">{{ t('mentorProfile.statRating') }}</p>
      <div class="mt-2">
        <StarRating :rating="averageRating" class="text-xl" />
      </div>
    </AppCard>

    <AppCard>
      <p class="text-sm text-text-secondary">{{ t('mentorProfile.statLessons') }}</p>
      <p class="mt-2 text-2xl font-bold text-white">{{ lessonsCompleted }}</p>
    </AppCard>

    <AppCard>
      <p class="text-sm text-text-secondary">{{ t('mentorProfile.statVisibility') }}</p>
      <div class="mt-3">
        <AppBadge :variant="isPublic ? 'success' : 'default'">
          {{ isPublic ? t('mentorProfile.publicProfile') : t('mentorProfile.hiddenProfile') }}
        </AppBadge>
      </div>
    </AppCard>

    <AppCard>
      <p class="text-sm text-text-secondary">{{ t('mentorProfile.statStatus') }}</p>
      <div class="mt-3">
        <AppBadge :variant="verified ? 'success' : 'info'">
          {{ verified ? t('mentorProfile.verified') : t('mentorProfile.regular') }}
        </AppBadge>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppCard from '@/shared/ui/AppCard.vue'
import AppBadge from '@/shared/ui/AppBadge.vue'
import StarRating from '@/shared/ui/StarRating.vue'

const { t } = useI18n()

defineProps<{
  averageRating: number
  lessonsCompleted: number
  isPublic: boolean
  verified: boolean
}>()
</script>

