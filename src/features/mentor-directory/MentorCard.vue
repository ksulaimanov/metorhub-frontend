<template>
  <RouterLink
      :to="`/mentors/${mentor.id}`"
      class="group flex flex-col rounded-2xl bg-surface p-5 shadow-md border border-border-brand transition-all hover:shadow-md hover:border-brand/40 hover:-translate-y-1"
  >
    <!-- Top: Avatar + Name + Badge -->
    <div class="flex items-start gap-4">
      <ProfileAvatar
        :src="mentor.avatarUrl"
        :first-name="mentor.firstName"
        :last-name="mentor.lastName"
        size="md"
        class="h-14 w-14 ring-1 ring-white/20 shadow-sm"
      />

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="truncate text-lg font-semibold text-text-primary group-hover:text-brand transition-colors">
              {{ name }}
            </h3>
            <p class="mt-0.5 truncate text-sm text-text-secondary">
              {{ mentor.headline || t('mentorDirectory.defaultHeadline') }}
            </p>
          </div>

          <div
              v-if="mentor.averageRating"
              class="flex shrink-0 items-center justify-center rounded-xl bg-warning-soft px-2 py-1 text-sm font-bold text-warning"
          >
            <MentorRating :rating="mentor.averageRating" :reviewsCount="mentor.reviewsCount || 0" />
          </div>
        </div>
      </div>
    </div>

    <!-- Specialization -->
    <p class="mt-3 line-clamp-2 text-sm text-text-muted">
      {{ mentor.specialization || t('mentorDirectory.specNotSet') }}
    </p>

    <!-- Format badges -->
    <div class="mt-3 flex flex-wrap gap-1.5 text-xs">
      <AppBadge v-if="mentor.lessonFormatOnline">{{ t('common.lessonFormat.ONLINE') }}</AppBadge>
      <AppBadge v-if="mentor.lessonFormatOffline">{{ t('common.lessonFormat.OFFLINE') }}</AppBadge>
      <AppBadge v-if="mentor.lessonFormatHybrid">{{ t('common.lessonFormat.HYBRID') }}</AppBadge>
    </div>

    <!-- Stats Row -->
    <div class="mt-5 grid grid-cols-2 gap-3 shrink-0">
      <!-- Price -->
      <div class="flex flex-col gap-1 rounded-xl bg-black/20 p-3 border border-border-subtle">
        <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Banknote class="h-3.5 w-3.5" />
          {{ t('mentorDirectory.priceLabel') }}
        </div>
        <div class="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
        <p class="mt-0.5 text-sm font-bold text-text-primary">
          {{ mentor.pricePerHour ? `${mentor.pricePerHour} ${t('mentorDirectory.priceSuffix')}` : t('mentorDirectory.priceNotSet') }}
        </p>
      </div>

      <!-- Lessons Completed -->
      <div class="flex flex-col gap-1 rounded-xl bg-black/20 p-3 border border-border-subtle">
        <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Sparkles class="h-3.5 w-3.5" />
          {{ t('mentorProfile.statsLessons') }}
        </div>
        <div class="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
        <p class="mt-0.5 text-sm font-bold text-text-primary">
          {{ mentor.lessonsCompleted ? mentor.lessonsCompleted : '—' }}
        </p>
      </div>

      <!-- Format -->
      <div class="flex flex-col gap-1 rounded-xl bg-black/20 p-3 border border-border-subtle">
        <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Laptop class="h-3.5 w-3.5" />
          {{ t('mentorDirectory.formatLabel') }}
        </div>
        <div class="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
        <p class="mt-0.5 text-sm font-medium text-text-primary truncate">
          {{ (mentor.lessonFormatOnline ? t('common.lessonFormat.ONLINE') : '') + ' ' +
          (mentor.lessonFormatOffline ? t('common.lessonFormat.OFFLINE') : '') + ' ' +
          (mentor.lessonFormatHybrid ? t('common.lessonFormat.HYBRID') : '') }}
        </p>
      </div>

      <!-- Location -->
      <div class="flex flex-col gap-1 rounded-xl bg-black/20 p-3 border border-border-subtle">
        <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <MapPin class="h-3.5 w-3.5" />
          {{ t('mentorDirectory.locationLabel') }}
        </div>
        <div class="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
        <p class="mt-0.5 text-sm font-medium text-text-primary truncate">
          {{ mentor.city || t('mentorDirectory.formatOnline') }}
        </p>
      </div>
    </div>

    <!-- CTA footer -->
    <div class="mt-4 flex items-center justify-between">
      <span class="text-sm text-text-muted">{{ t('mentorDirectory.detailsLink') }}</span>
      <span class="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition group-hover:bg-brand-hover">
        {{ t('mentorDirectory.open') }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Banknote, Sparkles, Laptop, MapPin } from 'lucide-vue-next'
import type { MentorDirectoryItem } from '@/shared/types/mentor'
import AppBadge from '@/shared/ui/AppBadge.vue'
import MentorRating from '@/shared/ui/MentorRating.vue'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'

const { t } = useI18n()

const props = defineProps<{
  mentor: MentorDirectoryItem
}>()

const name = computed(() => {
  const full = `${props.mentor.firstName || ''} ${props.mentor.lastName || ''}`.trim()
  return full || t('mentorDirectory.noName')
})
</script>
