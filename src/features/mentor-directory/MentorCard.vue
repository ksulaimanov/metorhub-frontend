<template>
  <RouterLink
      :to="`/mentors/${mentor.id}`"
      class="group flex flex-col rounded-2xl bg-white p-5 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80 transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <!-- Top: Avatar + Name + Badge -->
    <div class="flex items-start gap-3.5">
      <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-base font-bold text-brand">
        <img
            v-if="mentor.avatarUrl"
            :src="mentor.avatarUrl"
            :alt="name"
            class="h-full w-full object-cover"
        />
        <span v-else>{{ initials }}</span>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="truncate text-lg font-semibold text-text-primary group-hover:text-brand">
              {{ name }}
            </h3>
            <p class="mt-0.5 truncate text-sm text-text-secondary">
              {{ mentor.headline || t('mentorDirectory.defaultHeadline') }}
            </p>
          </div>
          <AppBadge v-if="mentor.verified" variant="success" class="shrink-0">
            {{ t('mentorDirectory.verified') }}
          </AppBadge>
        </div>
      </div>
    </div>

    <!-- Specialization -->
    <p class="mt-3 line-clamp-2 text-sm text-text-secondary">
      {{ mentor.specialization || t('mentorDirectory.specNotSet') }}
    </p>

    <!-- Format badges -->
    <div class="mt-3 flex flex-wrap gap-1.5 text-xs">
      <AppBadge v-if="mentor.lessonFormatOnline">{{ t('common.lessonFormat.ONLINE') }}</AppBadge>
      <AppBadge v-if="mentor.lessonFormatOffline">{{ t('common.lessonFormat.OFFLINE') }}</AppBadge>
      <AppBadge v-if="mentor.lessonFormatHybrid">{{ t('common.lessonFormat.HYBRID') }}</AppBadge>
    </div>

    <!-- Stats grid -->
    <div class="mt-auto pt-4">
      <div class="grid grid-cols-2 gap-2.5 rounded-xl bg-surface-secondary p-3 text-sm">
        <div>
          <p class="text-xs text-text-secondary">{{ t('mentorDirectory.cityLabel') }}</p>
          <p class="mt-0.5 font-medium text-text-primary">
            {{ mentor.city || t('mentorDirectory.cityNotSet') }}
          </p>
        </div>
        <div>
          <p class="text-xs text-text-secondary">{{ t('publicMentorProfile.price') }}</p>
          <p class="mt-0.5 font-medium text-text-primary">
            {{ mentor.pricePerHour ? `${mentor.pricePerHour} ${t('mentorDirectory.priceSuffix')}` : t('mentorDirectory.priceNotSet') }}
          </p>
        </div>
        <div>
          <p class="text-xs text-text-secondary">{{ t('mentorDirectory.ratingLabel') }}</p>
          <div class="mt-0.5 flex items-center gap-1">
            <StarRating :rating="mentor.averageRating" class="text-xs" />
          </div>
        </div>
        <div>
          <p class="text-xs text-text-secondary">{{ t('mentorDirectory.lessonsLabel') }}</p>
          <p class="mt-0.5 font-medium text-text-primary">
            {{ mentor.lessonsCompleted ?? 0 }}
          </p>
        </div>
      </div>
    </div>

    <!-- CTA footer -->
    <div class="mt-4 flex items-center justify-between">
      <span class="text-sm text-text-secondary">{{ t('mentorDirectory.detailsLink') }}</span>
      <span class="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-brand-hover">
        {{ t('mentorDirectory.open') }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MentorDirectoryItem } from '../../shared/types/mentor'
import AppBadge from '../../shared/ui/AppBadge.vue'
import StarRating from '../../shared/ui/StarRating.vue'

const { t } = useI18n()

const props = defineProps<{
  mentor: MentorDirectoryItem
}>()

const name = computed(() => {
  const full = `${props.mentor.firstName || ''} ${props.mentor.lastName || ''}`.trim()
  return full || t('mentorDirectory.noName')
})

const initials = computed(() => {
  const first = props.mentor.firstName?.trim()?.[0] || ''
  const last = props.mentor.lastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'M'
})
</script>

