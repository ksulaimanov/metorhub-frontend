<template>
  <div class="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5 ring-1 ring-border-brand/80">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
          {{ initials }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-white">{{ displayName }}</p>
          <p class="text-xs text-slate-400">{{ formattedDate }}</p>
        </div>
      </div>
      <StarRating :rating="review.rating" :show-value="false" class="text-sm" />
    </div>
    <p v-if="review.comment" class="mt-3 text-sm leading-relaxed text-slate-400">
      {{ review.comment }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MentorReview } from '@/shared/types/mentor'
import { formatDateTimeForDisplay } from '@/shared/lib/dateFormatter'
import StarRating from '@/shared/ui/StarRating.vue'

const { t } = useI18n()

const props = defineProps<{
  review: MentorReview
}>()

const displayName = computed(() => {
  const first = props.review.studentFirstName?.trim() || ''
  const last = props.review.studentLastName?.trim() || ''
  const full = `${first} ${last}`.trim()
  return full || t('publicMentorProfile.reviewAnonymous')
})

const initials = computed(() => {
  const first = props.review.studentFirstName?.trim()?.[0] || ''
  const last = props.review.studentLastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || '?'
})

const formattedDate = computed(() => formatDateTimeForDisplay(props.review.createdAt, false))
</script>

