<template>
  <div class="space-y-6">
    <!-- Profile header card -->
    <AppCard padding="none" radius="lg">
      <!-- Decorative gradient banner -->
      <div class="h-20 rounded-t-3xl bg-gradient-to-r from-brand/5 via-accent/5 to-brand-soft/40" />

      <div class="-mt-10 px-6 pb-6">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div class="flex items-end gap-5">
            <div class="ring-4 ring-white rounded-full shadow-lg">
              <ProfileAvatar
                  :src="profile.avatarUrl"
                  :first-name="profile.firstName"
                  :last-name="profile.lastName"
                  :alt="t('mentorProfile.avatarAlt')"
                  size="xl"
              />
            </div>

            <div class="min-w-0 pb-1">
              <h2 class="text-2xl font-bold text-white">{{ displayName }}</h2>
              <p class="mt-1 text-sm text-slate-400">
                {{ profile.headline || t('mentorProfile.viewHeadlineNotSet') }}
              </p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <AppBadge v-if="profile.verified" variant="success">{{ t('mentorProfile.verified') }}</AppBadge>
                <AppBadge :variant="profile.public ? 'success' : 'default'">
                  {{ profile.public ? t('mentorProfile.publicProfile') : t('mentorProfile.hiddenProfile') }}
                </AppBadge>
              </div>
              <SocialLinks
                  v-if="hasAnySocial"
                  :instagram="profile.instagramUrl"
                  :telegram="profile.telegramUsername"
                  :email="profile.publicEmail"
                  class="mt-3"
              />
            </div>
          </div>

          <AppButton variant="secondary" size="md" @click="$emit('edit')">
            <Pencil class="h-4 w-4" />
            {{ t('mentorProfile.editProfile') }}
          </AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Stats row -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AppCard>
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <StarIcon class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-slate-400">{{ t('mentorProfile.statRating') }}</p>
            <div class="mt-1">
              <StarRating :rating="profile.averageRating" class="text-xl" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-soft shadow-[0_0_15px_rgba(108,92,231,0.2)] border border-white/5">
            <BookOpenIcon class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-slate-400">{{ t('mentorProfile.statLessons') }}</p>
            <p class="mt-1 text-2xl font-bold text-text-primary">{{ profile.lessonsCompleted }}</p>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-accent">
            <BriefcaseIcon class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-text-secondary">{{ t('mentorProfile.viewSpecialization') }}</p>
            <p class="mt-1 text-base font-semibold text-text-primary">
              {{ profile.specialization || t('mentorProfile.viewNotSpecified') }}
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ClockIcon class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-text-secondary">{{ t('mentorProfile.viewExperience') }}</p>
            <p class="mt-1 text-base font-semibold text-text-primary">
              {{ profile.yearsExperience
                  ? t('mentorProfile.viewExperienceYears', { years: profile.yearsExperience })
                  : t('mentorProfile.viewNotSpecified') }}
            </p>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- About / Bio -->
    <AppCard>
      <h3 class="text-lg font-semibold text-text-primary">{{ t('mentorProfile.viewBio') }}</h3>
      <p v-if="profile.bio" class="mt-3 whitespace-pre-line leading-relaxed text-text-secondary">{{ profile.bio }}</p>
      <p v-else class="mt-3 text-sm italic text-text-muted">{{ t('mentorProfile.viewNoBio') }}</p>
    </AppCard>

    <!-- Lesson details -->
    <AppCard>
      <h3 class="text-lg font-semibold text-text-primary">{{ t('mentorProfile.sectionFormat') }}</h3>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <!-- Formats -->
        <div>
          <p class="text-sm text-text-secondary">{{ t('mentorProfile.viewFormats') }}</p>
          <div v-if="formats.length" class="mt-2 flex flex-wrap gap-2">
            <AppBadge v-for="f in formats" :key="f">{{ f }}</AppBadge>
          </div>
          <p v-else class="mt-2 text-sm italic text-text-muted">{{ t('mentorProfile.viewNoFormats') }}</p>
        </div>

        <!-- Price -->
        <div>
          <p class="text-sm text-text-secondary">{{ t('mentorProfile.viewPrice') }}</p>
          <p class="mt-2 text-base font-semibold text-text-primary">
            {{ profile.pricePerHour
                ? t('mentorProfile.viewPriceValue', { price: profile.pricePerHour })
                : t('mentorProfile.viewPriceNotSet') }}
          </p>
        </div>

        <!-- City -->
        <div>
          <p class="text-sm text-text-secondary">{{ t('mentorProfile.viewCity') }}</p>
          <p class="mt-2 text-base text-text-primary">{{ profile.city || t('mentorProfile.viewCityNotSet') }}</p>
        </div>

        <!-- Address -->
        <div v-if="profile.addressText">
          <p class="text-sm text-text-secondary">{{ t('mentorProfile.viewAddress') }}</p>
          <p class="mt-2 text-base text-text-primary">{{ profile.addressText }}</p>
        </div>

        <!-- Meeting Link -->
        <div v-if="profile.meetingLink">
          <p class="text-sm text-text-secondary">{{ t('mentorProfile.viewMeetingLink') }}</p>
          <a
              :href="profile.meetingLink"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 block truncate text-base text-brand hover:underline"
          >
            {{ profile.meetingLink }}
          </a>
        </div>
      </div>
    </AppCard>

    <!-- Contacts -->
    <AppCard>
      <h3 class="text-lg font-semibold text-text-primary">{{ t('mentorProfile.viewContacts') }}</h3>
      <div v-if="hasAnySocial" class="mt-4 space-y-3">
        <div v-if="profile.instagramUrl" class="flex items-center gap-3 text-sm">
          <Instagram class="h-4 w-4 text-text-secondary" />
          <span class="text-text-primary">{{ profile.instagramUrl }}</span>
        </div>
        <div v-if="profile.telegramUsername" class="flex items-center gap-3 text-sm">
          <Send class="h-4 w-4 text-text-secondary" />
          <span class="text-text-primary">{{ profile.telegramUsername }}</span>
        </div>
        <div v-if="profile.publicEmail" class="flex items-center gap-3 text-sm">
          <Mail class="h-4 w-4 text-text-secondary" />
          <span class="text-text-primary">{{ profile.publicEmail }}</span>
        </div>
      </div>
      <p v-else class="mt-3 text-sm italic text-text-muted">{{ t('mentorProfile.viewNoContacts') }}</p>
    </AppCard>

    <!-- Support -->
    <SupportContact />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pencil, Instagram, Send, Mail, Star as StarIcon, BookOpen as BookOpenIcon, Briefcase as BriefcaseIcon, Clock as ClockIcon } from 'lucide-vue-next'
import AppCard from '@/shared/ui/AppCard.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppBadge from '@/shared/ui/AppBadge.vue'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'
import StarRating from '@/shared/ui/StarRating.vue'
import SocialLinks from '@/shared/ui/SocialLinks.vue'
import SupportContact from '@/shared/ui/SupportContact.vue'

const { t } = useI18n()

export interface MentorProfileData {
  firstName: string
  lastName: string
  avatarUrl: string
  headline: string
  bio: string
  specialization: string
  yearsExperience: number
  lessonFormatOnline: boolean
  lessonFormatOffline: boolean
  lessonFormatHybrid: boolean
  city: string
  addressText: string
  meetingLink: string
  pricePerHour: number
  public: boolean
  averageRating: number
  lessonsCompleted: number
  verified: boolean
  instagramUrl: string
  telegramUsername: string
  publicEmail: string
}

const props = defineProps<{
  profile: MentorProfileData
}>()

defineEmits<{
  edit: []
}>()

const displayName = computed(() => {
  const full = `${props.profile.firstName || ''} ${props.profile.lastName || ''}`.trim()
  return full || t('mentorProfile.newMentor')
})

const hasAnySocial = computed(() =>
    !!props.profile.instagramUrl || !!props.profile.telegramUsername || !!props.profile.publicEmail,
)

const formats = computed(() => {
  const result: string[] = []
  if (props.profile.lessonFormatOnline) result.push(t('mentorProfile.formatOnline'))
  if (props.profile.lessonFormatOffline) result.push(t('mentorProfile.formatOffline'))
  if (props.profile.lessonFormatHybrid) result.push(t('mentorProfile.formatHybrid'))
  return result
})
</script>

