<template>
  <PublicLayout>
    <!-- ─── Hero ─── -->
    <section class="relative overflow-hidden bg-gradient-to-b from-brand-soft/40 to-bg">
      <div class="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pb-24 lg:pt-20">
         <div class="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

          <!-- Left: copy + CTAs -->
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

          <!-- Right: hero image area -->
          <div class="relative">
            <!--
              ┌─────────────────────────────────────────────────────┐
              │  HERO IMAGE SLOT                                    │
              │                                                     │
              │  When approved photography is ready, replace the    │
              │  placeholder below with:                            │
              │                                                     │
              │  <AppResponsiveImage                                │
              │    desktop-src="..."                                 │
              │    desktop-webp="..."                                │
              │    desktop-avif="..."                                │
              │    mobile-src="..."                                  │
              │    mobile-webp="..."                                 │
              │    mobile-avif="..."                                 │
              │    alt="..."                                         │
              │    loading="eager"                                   │
              │    fetchpriority="high"                              │
              │    :width="540"                                      │
              │    :height="675"                                     │
              │    img-class="h-full w-full object-cover"            │
              │  />                                                  │
              └─────────────────────────────────────────────────────┘
            -->
            <div
              class="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-brand-soft/60 to-white ring-1 ring-border-brand/60 lg:aspect-[4/5]"
              aria-hidden="true"
            >
              <!-- Temporary branded placeholder — removed when real image is added -->
              <div class="flex h-full flex-col items-center justify-center p-8 text-center">
                <!-- Abstract icon cluster -->
                <div class="mb-6 flex items-center gap-3">
                  <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </span>
                  <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </span>
                  <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                  </span>
                </div>

                <p class="text-base font-semibold text-brand/70">MentorHub</p>
                <p class="mt-1 text-sm text-text-secondary/60">
                  {{ t('home.heroSubtitle') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Value props ─── -->
    <section class="mx-auto -mt-6 max-w-6xl px-4 sm:px-6 lg:-mt-10">
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

    <!-- ─── Why MentorHub ─── -->
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