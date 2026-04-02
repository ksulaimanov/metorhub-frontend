<template>
  <div>
    <!-- Summary -->
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-semibold text-text-primary">{{ t('publicMentorProfile.reviewsTitle') }}</h2>
      <span v-if="reviews.length" class="text-sm text-text-secondary">
        {{ t('publicMentorProfile.reviewCount', { count: reviews.length }) }}
      </span>
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
    <div v-else-if="reviews.length === 0" class="mt-4 rounded-2xl bg-white p-6 text-center ring-1 ring-border-brand/80">
      <p class="text-sm text-text-secondary">{{ t('publicMentorProfile.noReviews') }}</p>
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
import type { MentorReview } from '../../shared/types/mentor'
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
</script>

