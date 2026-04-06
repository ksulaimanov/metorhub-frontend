<template>
  <div class="space-y-6">
    <!-- Profile header card -->
    <AppCard padding="none" radius="lg">
      <!-- Decorative gradient banner -->
      <div class="h-20 rounded-t-3xl bg-gradient-to-r from-brand/5 via-accent/5 to-brand-soft/40" />

      <div class="-mt-10 px-6 pb-6">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div class="flex items-end gap-5">
            <div class="rounded-full ring-4 ring-white shadow-lg">
              <ProfileAvatar
                  :src="profile.avatarUrl"
                  :first-name="profile.firstName"
                  :last-name="profile.lastName"
                  :alt="t('studentProfile.avatarAlt')"
                  size="xl"
              />
            </div>

            <div class="min-w-0 pb-1">
              <h2 class="text-2xl font-bold text-text-primary">{{ displayName }}</h2>
              <p v-if="profile.city" class="mt-1 text-sm text-text-secondary">
                {{ profile.city }}
              </p>
              <p v-else class="mt-1 text-sm text-text-muted">
                {{ t('studentProfile.viewCityNotSet') }}
              </p>
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
            {{ t('studentProfile.editProfile') }}
          </AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Info cards -->
    <div class="grid gap-4 sm:grid-cols-3">
      <AppCard>
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <MapPin class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-text-secondary">{{ t('studentProfile.statCity') }}</p>
            <p class="mt-1 text-base font-semibold text-text-primary">
              {{ profile.city || t('studentProfile.viewCityNotSet') }}
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-accent">
            <Globe class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-text-secondary">{{ t('studentProfile.viewTimezone') }}</p>
            <p class="mt-1 text-base font-semibold text-text-primary">
              {{ profile.timezone || t('studentProfile.viewTimezoneNotSet') }}
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Phone class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-text-secondary">{{ t('studentProfile.viewPhone') }}</p>
            <p class="mt-1 text-base font-semibold text-text-primary">
              {{ profile.phone || t('studentProfile.viewPhoneNotSet') }}
            </p>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- About / Bio -->
    <AppCard>
      <h3 class="text-lg font-semibold text-text-primary">{{ t('studentProfile.viewBio') }}</h3>
      <p v-if="profile.bio" class="mt-3 whitespace-pre-line leading-relaxed text-text-secondary">{{ profile.bio }}</p>
      <p v-else class="mt-3 text-sm italic text-text-muted">{{ t('studentProfile.viewNoBio') }}</p>
    </AppCard>

    <!-- Contacts -->
    <AppCard>
      <h3 class="text-lg font-semibold text-text-primary">{{ t('studentProfile.viewContacts') }}</h3>
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
      <p v-else class="mt-3 text-sm italic text-text-muted">{{ t('studentProfile.viewNoContacts') }}</p>
    </AppCard>

    <!-- Support -->
    <SupportContact />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pencil, Instagram, Send, Mail, MapPin, Globe, Phone } from 'lucide-vue-next'
import AppCard from '../../shared/ui/AppCard.vue'
import AppButton from '../../shared/ui/AppButton.vue'
import ProfileAvatar from '../../shared/ui/ProfileAvatar.vue'
import SocialLinks from '../../shared/ui/SocialLinks.vue'
import SupportContact from '../../shared/ui/SupportContact.vue'

const { t } = useI18n()

export interface StudentProfileData {
  firstName: string
  lastName: string
  avatarUrl: string
  bio: string
  timezone: string
  phone: string
  city: string
  instagramUrl: string
  telegramUsername: string
  publicEmail: string
}

const props = defineProps<{
  profile: StudentProfileData
}>()

defineEmits<{
  edit: []
}>()

const displayName = computed(() => {
  const full = `${props.profile.firstName || ''} ${props.profile.lastName || ''}`.trim()
  return full || t('studentProfile.notFilled')
})

const hasAnySocial = computed(() =>
    !!props.profile.instagramUrl || !!props.profile.telegramUsername || !!props.profile.publicEmail,
)
</script>

