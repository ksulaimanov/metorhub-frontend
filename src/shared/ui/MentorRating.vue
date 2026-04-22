<template>
  <div class="flex items-center gap-1.5 min-h-[20px]">
    <template v-if="rating && rating > 0">
      <StarRating :rating="rating" :show-value="false" class="text-sm" />
      <span class="font-semibold text-text-primary text-sm">{{ rating.toFixed(1) }}</span>
      <span class="text-sm text-text-secondary">({{ reviewsCount || 0 }})</span>
    </template>
    <div v-else class="flex items-center gap-1.5 text-text-secondary">
      <Star class="h-4 w-4 text-border-brand" />
      <span class="text-sm">{{ t('mentorProfile.newMentor') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Star } from 'lucide-vue-next'
import StarRating from '@/shared/ui/StarRating.vue'

const { t } = useI18n()

defineProps<{
  rating?: number | null
  reviewsCount?: number
}>()
</script>
