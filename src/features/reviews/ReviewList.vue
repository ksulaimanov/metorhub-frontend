<template>
  <div>
    <!-- Summary header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-semibold text-text-primary">{{ t('publicMentorProfile.reviewsTitle') }}</h2>
        <span v-if="reviews.length" class="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">
          {{ reviews.length }}
        </span>
      </div>
      <div v-if="reviews.length && averageRating" class="flex items-center gap-1.5 text-sm">
        <StarRating :rating="averageRating" :show-value="false" class="text-sm" />
        <span class="font-semibold text-text-primary">{{ averageRating.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-4 space-y-3">
      <div v-for="i in 2" :key="i" class="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-border-brand/80">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-brand-soft" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 w-24 rounded bg-brand-soft" />
            <div class="h-3 w-16 rounded bg-brand-soft/60" />
          </div>
        </div>
        <div class="mt-3 h-3 w-full rounded bg-brand-soft/40" />
        <div class="mt-2 h-3 w-3/4 rounded bg-brand-soft/40" />
      </div>
    </div>

    <!-- Error -->
    <p v-else-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <!-- Empty -->
    <div v-else-if="reviews.length === 0" class="mt-4 rounded-2xl bg-surface-secondary p-8 text-center ring-1 ring-border-brand/60">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
        <MessageSquare class="h-5 w-5 text-brand" />
      </div>
      <p class="mt-3 text-sm font-medium text-text-primary">{{ t('publicMentorProfile.noReviewsTitle') }}</p>
      <p class="mt-1 text-xs text-text-secondary">{{ t('publicMentorProfile.noReviewsHint') }}</p>
    </div>

    <!-- Reviews -->
    <div v-else class="mt-4 space-y-3">
      <ReviewCard
          v-for="review in visibleReviews"
          :key="review.id"
          :review="review"
      />
      <button
          v-if="reviews.length > visibleCount"
          type="button"
          class="w-full rounded-2xl border border-border-brand bg-white px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-brand-soft"
          @click="showAll = true"
      >
        {{ t('publicMentorProfile.showAllReviews', { count: reviews.length }) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MessageSquare } from 'lucide-vue-next'
import type { MentorReview } from '../../shared/types/mentor'
import StarRating from '../../shared/ui/StarRating.vue'
import ReviewCard from './ReviewCard.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  reviews: MentorReview[]
  loading?: boolean
  error?: string
  initialCount?: number
}>(), {
  loading: false,
  error: '',
  initialCount: 3,
})

const showAll = ref(false)
const visibleCount = computed(() => showAll.value ? props.reviews.length : props.initialCount)
const visibleReviews = computed(() => props.reviews.slice(0, visibleCount.value))

const averageRating = computed(() => {
  if (props.reviews.length === 0) return null
  const sum = props.reviews.reduce((acc, r) => acc + r.rating, 0)
  return sum / props.reviews.length
})
</script>

