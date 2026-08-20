<template>
  <section class="relative min-h-screen w-full overflow-hidden">
    <!-- Fullscreen background image (direct section child) -->
    <img
      src="@/assets/images/hero/hero-planet.webp"
      srcset="@/assets/images/hero/hero-planet@2x.webp 2x"
      class="absolute inset-0 w-full h-full object-cover z-0 animate-slow-zoom"
      style="object-position: center"
      alt=""
    />

    <!-- Warm scrim: keeps the photo readable and ties it to the paper palette. -->
    <div class="absolute inset-0 z-[1] bg-[#16151D]/55"></div>
    <!-- Fades into the page background so there is no seam below the hero. -->
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent z-[2]"></div>
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] px-6" aria-hidden="true">
      <div class="mx-auto max-w-5xl">
        <KyrgyzDivider variant="subtle" size="md" />
      </div>
    </div>

    <!-- Content layer -->
    <div class="relative z-10 container mx-auto px-6 min-h-screen flex items-center">
      <div class="w-full py-24 lg:py-32 flex flex-col items-center text-center">
        <!-- Badge -->
        <div class="relative mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium leading-6 text-white">
          <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
          {{ t('home.heroBadge') }}
        </div>

        <!-- Headline: serif display face carries the editorial tone. -->
        <h1 class="font-display text-4xl font-medium leading-[1.08] tracking-tight text-white mb-6 sm:text-5xl lg:text-7xl">
          {{ t('home.heroTitle') }}
        </h1>

        <p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
          {{ t('home.heroSubtitle') }}
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center gap-5 w-full justify-center">
          <template v-if="auth.isAuthenticated">
            <RouterLink :to="dashboardRoute" class="w-full sm:w-auto">
              <button class="relative overflow-hidden w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-[#F8F8FC] text-[#16151D] px-8 py-4 text-base font-semibold transition-all hover:bg-white hover:-translate-y-0.5 shadow-md">
                {{ t('home.ctaDashboard') }}
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/mentors" class="w-full sm:w-auto">
              <!-- Primary CTA -->
              <button class="relative overflow-hidden w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-[#F8F8FC] text-[#16151D] px-8 py-4 text-base font-semibold transition-all hover:bg-white hover:-translate-y-0.5 shadow-md">
                {{ t('home.ctaFindMentor') }}
                <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </RouterLink>
            <RouterLink to="/register" class="w-full sm:w-auto">
              <!-- Secondary CTA -->
              <button class="relative overflow-hidden w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full border border-white/30 bg-white/10 text-white px-8 py-4 text-base font-semibold transition hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5">
                {{ t('home.ctaRegister') }}
              </button>
            </RouterLink>
          </template>
        </div>

        <!-- Social proof / Micro stats -->
        <div class="mt-14 flex flex-wrap justify-center gap-3 text-sm font-medium text-white/85">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
            <Check class="h-4 w-4 text-accent" aria-hidden="true" /> {{ t('home.proofMentors') }}
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
            <Zap class="h-4 w-4 text-accent" aria-hidden="true" /> {{ t('home.proofFormats') }}
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
            <Star class="h-4 w-4 text-accent" aria-hidden="true" /> {{ t('home.proofFree') }}
          </span>
        </div>
      </div>
    </div>

    <div class="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/80 animate-bounce" aria-hidden="true">
      <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="2" width="10" height="16" rx="5" />
        <path d="M12 7v4" />
        <path d="m8 19 4 3 4-3" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { resolveDashboardPath } from '@/shared/lib/auth/resolveDashboardPath'
import KyrgyzDivider from '@/shared/ui/KyrgyzDivider.vue'
import { Check, Zap, Star } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()

const dashboardRoute = computed(() => resolveDashboardPath(auth.roles))
</script>

<style scoped>
.animate-gradient-x {
  animation: gradient-x 6s ease infinite;
}

@keyframes gradient-x {
  0% { background-position: 0 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@keyframes slow-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

.animate-slow-zoom {
  animation: slow-zoom 25s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-gradient-x,
  .animate-slow-zoom,
  .animate-bounce {
    animation: none !important;
    transform: none !important;
  }
}
</style>
