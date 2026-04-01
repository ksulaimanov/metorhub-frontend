<template>
  <PublicLayout>
    <!-- ─── Hero ─── -->
    <section class="relative overflow-hidden bg-gradient-to-b from-brand-soft/40 to-bg">
      <div class="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 lg:pb-20 lg:pt-20">
        <div class="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-12">

          <!-- Left: copy + CTAs (dominant column) -->
          <div>
            <p class="inline-flex rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand">
              {{ t('home.heroBadge') }}
            </p>

            <h1 class="mt-5 max-w-lg text-3xl font-extrabold leading-tight text-text-primary sm:text-4xl lg:text-[2.75rem]">
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

          <!-- Right: hero image (supportive column) -->
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

    <!-- ─── Value props ─── -->
    <section class="mx-auto -mt-4 max-w-6xl px-4 sm:px-6 lg:-mt-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <div
            v-for="(item, i) in valueProps"
            :key="i"
            class="rounded-2xl bg-white p-5 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80"
        >
          <p class="text-xl font-bold text-text-primary">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-text-secondary">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ─── Steps ─── -->
    <section class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div class="rounded-[1.75rem] bg-brand px-6 py-8 text-white md:px-10 md:py-12">
        <h2 class="mb-8 text-xl font-bold sm:text-2xl">{{ t('home.stepsTitle') }}</h2>
        <div class="grid gap-6 md:grid-cols-3">
          <div v-for="(step, i) in steps" :key="i">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">
              {{ i + 1 }}
            </span>
            <h3 class="mt-3 text-lg font-semibold">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-7 text-white/70">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Why JaiMentorship ─── -->
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
        />
      </div>
    </section>

    <!-- ─── Dual-path CTA ─── -->
    <section class="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
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
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import FeatureCard from '../../shared/ui/FeatureCard.vue'
import AppResponsiveImage from '../../shared/ui/AppResponsiveImage.vue'

// Hero image assets (AVIF → WebP → JPEG fallback, art-directed desktop + mobile)
import heroDesktopJpg from '../../assets/images/hero/home-hero-desktop.jpg'
import heroDesktopWebp from '../../assets/images/hero/home-hero-desktop.webp'
import heroDesktopAvif from '../../assets/images/hero/home-hero-desktop.avif'
import heroMobileJpg from '../../assets/images/hero/home-hero-mobile.jpg'
import heroMobileWebp from '../../assets/images/hero/home-hero-mobile.webp'
import heroMobileAvif from '../../assets/images/hero/home-hero-mobile.avif'

const { t } = useI18n()

const valueProps = computed(() => [
  { title: t('home.val1Title'), desc: t('home.val1Desc') },
  { title: t('home.val2Title'), desc: t('home.val2Desc') },
  { title: t('home.val3Title'), desc: t('home.val3Desc') },
])

const steps = computed(() => [
  { title: t('home.step1Title'), desc: t('home.step1Desc') },
  { title: t('home.step2Title'), desc: t('home.step2Desc') },
  { title: t('home.step3Title'), desc: t('home.step3Desc') },
])

const features = computed(() => [
  { title: t('home.feat1Title'), desc: t('home.feat1Desc') },
  { title: t('home.feat2Title'), desc: t('home.feat2Desc') },
  { title: t('home.feat3Title'), desc: t('home.feat3Desc') },
  { title: t('home.feat4Title'), desc: t('home.feat4Desc') },
])
</script>