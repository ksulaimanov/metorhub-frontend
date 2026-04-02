<template>
  <PublicLayout>
    <!-- ─── 1. Hero ─── -->
    <section class="relative overflow-hidden bg-gradient-to-b from-brand-soft/40 to-bg">
      <div class="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 lg:pb-20 lg:pt-20">
        <div class="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-12">

          <!-- Left: copy + CTAs -->
          <div>
            <p class="inline-flex rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand">
              {{ t('home.heroBadge') }}
            </p>

            <h1 class="mt-5 max-w-lg text-3xl font-extrabold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              {{ t('home.heroTitle') }}
            </h1>

            <p class="mt-5 max-w-md text-base leading-7 text-text-secondary lg:text-lg lg:leading-8">
              {{ t('home.heroSubtitle') }}
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <RouterLink
                  to="/mentors"
                  class="rounded-2xl bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand/20 transition hover:bg-brand-hover active:scale-[0.98]"
              >
                {{ t('home.ctaFindMentor') }}
              </RouterLink>

              <RouterLink
                  to="/register"
                  class="rounded-2xl border border-border-brand bg-white px-6 py-3.5 text-base font-semibold text-text-primary transition hover:bg-brand-soft active:scale-[0.98]"
              >
                {{ t('home.ctaRegister') }}
              </RouterLink>
            </div>
          </div>

          <!-- Right: hero image -->
          <div class="relative lg:max-w-sm lg:justify-self-end">
            <div class="aspect-[4/5] w-full overflow-hidden rounded-3xl md:aspect-[16/9] lg:aspect-[3/4]">
              <AppResponsiveImage
                :desktop-src="heroDesktopJpg"
                :desktop-webp="heroDesktopWebp"
                :desktop-avif="heroDesktopAvif"
                :mobile-src="heroMobileJpg"
                :mobile-webp="heroMobileWebp"
                :mobile-avif="heroMobileAvif"
                :alt="t('home.heroImageAlt')"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                :width="1440"
                :height="810"
                img-class="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── 2. Trust Bar ─── -->
    <section class="mx-auto -mt-4 max-w-6xl px-4 sm:px-6 lg:-mt-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <div
            v-for="(item, i) in trustItems"
            :key="i"
            class="flex items-start gap-3.5 rounded-2xl bg-white p-5 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <component :is="item.icon" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-semibold leading-snug text-text-primary">{{ item.title }}</p>
            <p class="mt-0.5 text-xs leading-relaxed text-text-secondary">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── 3. How It Works ─── -->
    <section class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div class="rounded-[1.75rem] bg-brand px-6 py-8 text-white md:px-10 md:py-12">
        <h2 class="mb-8 text-xl font-bold sm:text-2xl">{{ t('home.stepsTitle') }}</h2>
        <div class="grid gap-6 md:grid-cols-3">
          <div v-for="(step, i) in steps" :key="i">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <component :is="step.icon" class="h-4 w-4" />
            </span>
            <h3 class="mt-3 text-lg font-semibold">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-7 text-white/70">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── 4. Featured Mentors ─── -->
    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('home.featuredTitle') }}</h2>
        <RouterLink
            to="/mentors"
            class="shrink-0 text-sm font-semibold text-brand transition hover:text-brand-hover"
        >
          {{ t('home.featuredViewAll') }}
        </RouterLink>
      </div>

      <!-- Loading skeleton -->
      <div v-if="featuredLoading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-border-brand/80">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-full bg-brand-soft" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-24 rounded bg-brand-soft" />
              <div class="h-3 w-32 rounded bg-brand-soft/60" />
            </div>
          </div>
          <div class="mt-4 h-3 w-full rounded bg-brand-soft/40" />
          <div class="mt-2 h-3 w-2/3 rounded bg-brand-soft/40" />
        </div>
      </div>

      <!-- Mentor cards -->
      <div v-else-if="featuredMentors.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RouterLink
            v-for="mentor in featuredMentors"
            :key="mentor.id"
            :to="`/mentors/${mentor.id}`"
            class="group rounded-2xl bg-white p-5 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <!-- Avatar + Name -->
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-sm font-bold text-brand">
              <img
                  v-if="mentor.avatarUrl"
                  :src="mentor.avatarUrl"
                  :alt="mentorName(mentor)"
                  class="h-full w-full object-cover"
              />
              <span v-else>{{ mentorInitials(mentor) }}</span>
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-text-primary group-hover:text-brand">
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
              <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
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
      <div v-else class="rounded-2xl bg-white p-8 text-center ring-1 ring-border-brand/80">
        <p class="text-sm text-text-secondary">{{ t('home.featuredEmpty') }}</p>
      </div>
    </section>

    <!-- ─── 5. Why JaiMentorship ─── -->
    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div class="mb-10 max-w-lg">
        <h2 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('home.whyTitle') }}</h2>
        <p class="mt-3 text-base leading-7 text-text-secondary">{{ t('home.whySubtitle') }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FeatureCard
            v-for="(feature, i) in features"
            :key="i"
            :title="feature.title"
            :description="feature.desc"
        >
          <template #icon>
            <component :is="feature.icon" class="h-5 w-5" />
          </template>
        </FeatureCard>
      </div>
    </section>

    <!-- ─── 6. Dual-path CTA ─── -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Student path -->
        <div class="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80 sm:p-8">
          <span class="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {{ t('home.studentBadge') }}
          </span>
          <h3 class="mt-4 text-xl font-bold text-text-primary">{{ t('home.studentTitle') }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ t('home.studentDesc') }}</p>
          <RouterLink
              to="/register"
              class="mt-6 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            {{ t('home.studentCta') }}
          </RouterLink>
        </div>

        <!-- Mentor path -->
        <div class="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80 sm:p-8">
          <span class="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            {{ t('home.mentorBadge') }}
          </span>
          <h3 class="mt-4 text-xl font-bold text-text-primary">{{ t('home.mentorTitle') }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ t('home.mentorDesc') }}</p>
          <RouterLink
              to="/mentor/apply"
              class="mt-6 inline-flex rounded-xl border border-border-brand px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-brand-soft"
          >
            {{ t('home.mentorCta') }}
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ─── 7. Closing CTA ─── -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="rounded-[1.75rem] bg-gradient-to-r from-brand to-brand-hover px-6 py-10 text-center text-white sm:px-10 sm:py-14">
        <h2 class="text-2xl font-bold sm:text-3xl">{{ t('home.closingTitle') }}</h2>
        <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
          {{ t('home.closingSubtitle') }}
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <RouterLink
              to="/mentors"
              class="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-brand transition hover:bg-white/90"
          >
            {{ t('home.closingCtaMentors') }}
          </RouterLink>
          <RouterLink
              to="/register"
              class="rounded-2xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
          >
            {{ t('home.closingCtaRegister') }}
          </RouterLink>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import FeatureCard from '../../shared/ui/FeatureCard.vue'
import AppResponsiveImage from '../../shared/ui/AppResponsiveImage.vue'
import { getFeaturedMentors } from '../../shared/api/mentorPublicApi'
import type { MentorDirectoryItem } from '../../shared/types/mentor'

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
import heroDesktopJpg from '../../assets/images/hero/home-hero-desktop.jpg'
import heroDesktopWebp from '../../assets/images/hero/home-hero-desktop.webp'
import heroDesktopAvif from '../../assets/images/hero/home-hero-desktop.avif'
import heroMobileJpg from '../../assets/images/hero/home-hero-mobile.jpg'
import heroMobileWebp from '../../assets/images/hero/home-hero-mobile.webp'
import heroMobileAvif from '../../assets/images/hero/home-hero-mobile.avif'

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

const mentorInitials = (m: MentorDirectoryItem) => {
  const first = m.firstName?.trim()?.[0] || ''
  const last = m.lastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'J'
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

