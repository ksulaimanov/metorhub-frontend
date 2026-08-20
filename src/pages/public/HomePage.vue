<template>
  <PublicLayout>
    <div class="relative bg-gradient-to-b bg-surface min-h-screen pb-10">
      <!-- Full background subtle pattern across the whole landing page -->
      <KyrgyzOrnamentPattern :opacity="0.10" :scale="1" class="fixed inset-0 z-0 pointer-events-none mix-blend-overlay" />

      <!-- Fullscreen hero -->
      <div class="relative z-10">
        <HeroSection />
      </div>

      <!-- 2. Features -->
      <section class="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24 mt-8">
        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
              v-for="(item, i) in trustItems"
              :key="i"
              class="flex items-start gap-4 rounded-2xl bg-surface p-6 shadow-sm shadow-brand/5 border border-border-brand hover:shadow-md transition-all hover:scale-[1.02] hover:border-brand/30"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand shadow-md">
              <component :is="item.icon" class="h-6 w-6" />
            </div>
            <div>
              <p class="text-base font-bold leading-snug text-text-primary">{{ item.title }}</p>
              <p class="mt-1.5 text-sm leading-relaxed text-text-secondary">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── 3. How It Works ─── -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <OrnamentDivider :opacity="0.1" class="text-text-primary" />
      </div>

      <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-hover text-text-primary shadow-sm border border-border-brand">
          <KyrgyzOrnamentPattern :opacity="0.08" :scale="1.2" class="text-text-primary mix-blend-overlay pointer-events-none" />
          <div class="relative z-10 px-6 py-12 md:px-12 md:py-20">
            <div class="text-center mb-12">
              <h2 class="text-2xl font-extrabold sm:text-3xl lg:text-4xl">{{ t('home.stepsTitle') }}</h2>
            </div>
            <div class="grid gap-8 md:grid-cols-3 md:gap-12">
              <div v-for="(step, i) in steps" :key="i" class="flex flex-col items-center text-center">
                <span class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary mx-auto shadow-sm border border-border-brand">
                  <component :is="step.icon" class="h-8 w-8 text-text-primary" />
                </span>
                <h3 class="mt-6 text-xl font-bold text-text-primary">{{ step.title }}</h3>
                <p class="mt-3 text-base leading-relaxed text-text-primary/80 max-w-xs">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── 4. Featured Mentors ─── -->
      <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 class="text-3xl font-extrabold text-text-primary sm:text-4xl">{{ t('home.featuredTitle') }}</h2>
          <RouterLink
              to="/mentors"
              class="inline-flex shrink-0 items-center justify-center rounded-xl bg-surface-secondary px-5 py-2.5 text-sm font-bold text-text-primary transition hover:bg-surface-secondary border border-border-subtle"
          >
            {{ t('home.featuredViewAll') }}
          </RouterLink>
        </div>

        <!-- Loading skeleton -->
        <div v-if="featuredLoading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl bg-surface p-5 border border-border-brand">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-full bg-surface-secondary" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-24 rounded bg-surface-secondary" />
                <div class="h-3 w-32 rounded bg-surface-secondary" />
              </div>
            </div>
            <div class="mt-4 h-3 w-full rounded bg-surface-secondary" />
            <div class="mt-2 h-3 w-2/3 rounded bg-surface-secondary" />
          </div>
        </div>

        <!-- Mentor cards -->
        <div v-else-if="featuredMentors.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <RouterLink
              v-for="mentor in featuredMentors"
              :key="mentor.id"
              :to="`/mentors/${mentor.id}`"
              class="group rounded-2xl bg-surface p-5 shadow-sm border border-border-brand transition-all hover:-translate-y-1 hover:shadow-md hover:border-brand/40"
          >
            <!-- Avatar + Name -->
            <div class="flex items-center gap-3">
              <ProfileAvatar
                :src="mentor.avatarUrl"
                :first-name="mentor.firstName"
                :last-name="mentor.lastName"
                size="md"
                class="h-12 w-12"
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-text-primary group-hover:text-brand transition-colors">
                  {{ mentorName(mentor) }}
                </p>
                <p class="truncate text-xs text-text-secondary">
                  {{ mentor.specialization || t('home.featuredSpecNotSet') }}
                </p>
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-4 flex items-center gap-3 text-xs text-text-secondary">
              <span v-if="mentor.averageRating" class="flex items-center gap-1">
                <Star class="h-3.5 w-3.5 fill-amber-400 text-warning" />
                {{ mentor.averageRating.toFixed(1) }}
              </span>
              <span v-if="mentor.pricePerHour" class="flex items-center gap-1">
                {{ mentor.pricePerHour }} {{ t('home.featuredPriceSuffix') }}
              </span>
              <span v-if="mentor.city" class="flex items-center gap-1">
                <MapPin class="h-3 w-3" />
                {{ mentor.city }}
              </span>
            </div>
          </RouterLink>
        </div>

        <!-- Empty state -->
        <div v-else class="relative w-full overflow-hidden rounded-[2rem] bg-surface border border-border-brand px-6 py-20 sm:px-12 flex flex-col items-center">
          <!-- Visual Ghost Profile Grid as Background Hint -->
          <div class="absolute inset-0 flex items-center justify-center gap-6 opacity-20 dark:opacity-[0.08] pointer-events-none" aria-hidden="true">
            <div v-for="i in 3" :key="i" class="hidden sm:block w-64 rounded-2xl bg-surface-sunken p-5 ring-1 ring-border-default">
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-surface-sunken" />
                <div class="space-y-3 flex-1">
                  <div class="h-4 w-3/4 rounded bg-surface-sunken" />
                  <div class="h-3 w-1/2 rounded bg-surface-sunken" />
                </div>
              </div>
              <div class="mt-8 flex gap-3">
                <div class="h-8 w-16 rounded bg-surface-sunken" />
                <div class="h-8 w-24 rounded bg-surface-sunken" />
              </div>
            </div>
          </div>

          <div class="relative z-10 flex flex-col items-center justify-center text-center">
            <div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-secondary ring-4 ring-white/5 shadow-sm border border-border-brand">
              <UserCheck class="h-10 w-10 text-text-primary opacity-80" />
            </div>
            <h3 class="text-2xl font-extrabold text-text-primary mb-3">{{ t('home.featuredEmpty') }}</h3>
            <p class="text-base text-text-secondary max-w-md">{{ t('home.featuredEmptyDesc') }}</p>
          </div>
        </div>
      </section>

      <!-- ─── 5. Why JaiMentorship ─── -->
      <section class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div class="mb-12 max-w-2xl">
          <h2 class="text-3xl font-extrabold text-text-primary sm:text-4xl">{{ t('home.whyTitle') }}</h2>
          <p class="mt-4 text-lg leading-relaxed text-text-secondary">{{ t('home.whySubtitle') }}</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-sm border border-border-brand hover:shadow-md transition-all hover:-translate-y-1 hover:border-brand/30"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand shadow-md">
              <component :is="feature.icon" class="h-6 w-6" />
            </div>
            <div>
              <p class="text-lg font-bold leading-snug text-text-primary">{{ feature.title }}</p>
              <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── 6. Dual-path CTA ─── -->
      <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Student path -->
          <div class="relative rounded-[2rem] overflow-hidden bg-surface p-8 border border-border-brand sm:p-10 flex flex-col items-start hover:shadow-md transition-all hover:border-brand/40">
            <KyrgyzCornerOrnament position="top-right" :opacity="0.10" class="text-text-primary" />
            <span class="inline-flex rounded-full bg-brand/20 px-4 py-1.5 text-sm font-bold text-brand border border-brand/30">
              {{ t('home.studentBadge') }}
            </span>
            <h3 class="mt-6 text-2xl font-extrabold text-text-primary">{{ t('home.studentTitle') }}</h3>
            <p class="mt-3 text-base leading-relaxed text-text-secondary flex-grow">{{ t('home.studentDesc') }}</p>
            <RouterLink
                to="/register"
                class="mt-8 inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-on-brand shadow-md transition-all hover:bg-brand-hover hover:-translate-y-0.5"
            >
              {{ t('home.studentCta') }}
            </RouterLink>
          </div>

          <!-- Mentor path -->
          <div class="relative rounded-[2rem] overflow-hidden bg-surface p-8 border border-border-brand sm:p-10 flex flex-col items-start hover:shadow-md transition-all hover:border-brand/40">
            <KyrgyzCornerOrnament position="top-right" :opacity="0.10" class="text-text-primary" />
            <span class="inline-flex rounded-full bg-surface-secondary px-4 py-1.5 text-sm font-bold text-text-primary border border-border-brand">
              {{ t('home.mentorBadge') }}
            </span>
            <h3 class="mt-6 text-2xl font-extrabold text-text-primary">{{ t('home.mentorTitle') }}</h3>
            <p class="mt-3 text-base leading-relaxed text-text-secondary flex-grow">{{ t('home.mentorDesc') }}</p>
            <RouterLink
                to="/mentor/apply"
                class="mt-8 inline-flex items-center justify-center rounded-xl border-2 border-border-brand bg-surface px-6 py-3.5 text-base font-bold text-text-primary transition-all hover:border-border-brand hover:bg-surface-secondary hover:-translate-y-0.5"
            >
              {{ t('home.mentorCta') }}
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- ─── 7. Closing CTA ─── -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <OrnamentDivider :opacity="0.1" class="text-text-primary" />
      </div>

      <section class="mx-auto px-4 py-20 sm:px-6 lg:py-32 flex justify-center">
        <div class="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-surface border border-border-brand px-6 py-20 text-center shadow-sm sm:px-16 sm:py-20 flex flex-col items-center">
          <KyrgyzOrnamentPattern :opacity="0.05" :scale="1.5" class="text-text-primary mix-blend-overlay pointer-events-none" />

          <div class="relative z-10 max-w-xl">
            <h2 class="text-3xl font-extrabold text-text-primary sm:text-4xl lg:text-5xl leading-tight">{{ t('home.closingTitle') }}</h2>
            <p class="mx-auto mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
              {{ t('home.closingSubtitle') }}
            </p>
            <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <RouterLink
                  to="/register"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand px-8 py-4 text-base font-bold text-on-brand shadow-sm transition hover:bg-brand-hover hover:-translate-y-0.5 active:scale-95"
              >
                {{ t('home.closingCtaRegister') }}
              </RouterLink>
              <RouterLink
                  to="/mentors"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-border-brand bg-surface px-8 py-4 text-base font-bold text-text-primary transition hover:border-border-brand hover:bg-surface-secondary hover:-translate-y-0.5 active:scale-95"
              >
                {{ t('home.closingCtaMentors') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import PublicLayout from '@/widgets/layout/PublicLayout.vue'
import HeroSection from '@/widgets/hero/ui/HeroSection.vue'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'
import KyrgyzCornerOrnament from '@/shared/ui/KyrgyzCornerOrnament.vue'
import OrnamentDivider from '@/shared/ui/OrnamentDivider.vue'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'
import { getFeaturedMentors } from '@/shared/api/mentorPublicApi'
import type { MentorDirectoryItem } from '@/shared/types/mentor'

// Lucide icons
import {
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  Search,
  CalendarDays,
  GraduationCap,
  LayoutList,
  UserCheck,
  CalendarCheck,
  LayoutDashboard,
  Star,
  MapPin,
} from 'lucide-vue-next'

// Hero image assets (AVIF → WebP → JPEG fallback, art-directed desktop + mobile)
// Removed unused imports

const { t } = useI18n()

// ── Trust bar items ──
const trustItems = computed(() => [
  { icon: ShieldCheck, title: t('home.trustVerified'), desc: t('home.trustVerifiedDesc') },
  { icon: Eye,         title: t('home.trustTransparent'), desc: t('home.trustTransparentDesc') },
  { icon: SlidersHorizontal, title: t('home.trustFlexible'), desc: t('home.trustFlexibleDesc') },
])

// ── Steps ──
const steps = computed(() => [
  { icon: Search,       title: t('home.step1Title'), desc: t('home.step1Desc') },
  { icon: CalendarDays, title: t('home.step2Title'), desc: t('home.step2Desc') },
  { icon: GraduationCap, title: t('home.step3Title'), desc: t('home.step3Desc') },
])

// ── Features ──
const features = computed(() => [
  { icon: LayoutList,      title: t('home.feat1Title'), desc: t('home.feat1Desc') },
  { icon: UserCheck,       title: t('home.feat2Title'), desc: t('home.feat2Desc') },
  { icon: CalendarCheck,   title: t('home.feat3Title'), desc: t('home.feat3Desc') },
  { icon: LayoutDashboard, title: t('home.feat4Title'), desc: t('home.feat4Desc') },
])

// ── Featured Mentors ──
const featuredMentors = ref<MentorDirectoryItem[]>([])
const featuredLoading = ref(true)

const mentorName = (m: MentorDirectoryItem) => {
  const full = `${m.firstName || ''} ${m.lastName || ''}`.trim()
  return full || t('home.featuredNoName')
}


onMounted(async () => {
  try {
    featuredMentors.value = await getFeaturedMentors(4)
  } catch {
    // Silent fail — section will show empty state
  } finally {
    featuredLoading.value = false
  }
})
</script>

