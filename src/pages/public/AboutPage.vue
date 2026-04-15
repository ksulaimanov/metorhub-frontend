<template>
  <PublicLayout>
    <section class="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      <div class="space-y-12">
        <!-- Header -->
        <div class="text-center">
          <p class="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand">
            {{ t('about.badge') }}
          </p>

          <h1 class="mt-5 text-4xl font-bold leading-tight text-text-primary md:text-5xl">
            {{ t('about.title') }}
          </h1>

          <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-text-secondary">
            {{ t('about.subtitle') }}
          </p>
        </div>

        <!-- Kyrgyz ornament -->
        <KyrgyzDivider variant="subtle" />

        <!-- Features -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border-brand">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft">
                <svg class="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureIcons[i - 1]" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-text-primary">{{ t(`about.feat${i}Title`) }}</h3>
            </div>
            <p class="mt-3 text-text-secondary">{{ t(`about.feat${i}Desc`) }}</p>
          </div>
        </div>

        <!-- CTA -->
        <div class="rounded-2xl bg-gradient-to-r from-brand to-brand-hover p-8 text-center text-white">
          <h2 class="text-3xl font-bold">{{ t('about.ctaTitle') }}</h2>
          <p class="mt-3 text-white/80">{{ t('about.ctaSubtitle') }}</p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
            <RouterLink
                to="/mentors"
                class="rounded-2xl bg-surface px-6 py-3 text-base font-semibold text-brand transition hover:bg-surface/90"
            >
              {{ t('about.ctaFindMentor') }}
            </RouterLink>

            <RouterLink
                to="/register"
                class="rounded-2xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-surface/10"
            >
              {{ t('about.ctaRegister') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import KyrgyzDivider from '../../shared/ui/KyrgyzDivider.vue'

const { t } = useI18n()

const featureIcons = [
  'M13 10V3L4 14h7v7l9-11h-7z',
  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
  'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
]
</script>

