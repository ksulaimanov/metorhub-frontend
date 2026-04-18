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

    <AuroraBackground
      :showRadialGradient="true"
      class="absolute inset-0 z-[1] !bg-transparent"
      auroraOpacity="opacity-20 dark:opacity-25"
    />

    <div class="absolute inset-0 bg-black/40 z-[1]"></div>
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b122b] to-transparent z-[2]"></div>
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] px-6" aria-hidden="true">
      <div class="mx-auto max-w-5xl">
        <KyrgyzDivider variant="subtle" size="md" />
      </div>
    </div>

    <!-- Content layer -->
    <div class="relative z-10 container mx-auto px-6 min-h-screen flex items-center">
      <div class="w-full py-24 lg:py-32 flex flex-col items-center text-center">
        <!-- Badge -->
        <div class="group relative inline-flex items-center justify-center p-px mb-8 text-sm font-medium leading-6 text-white bg-slate-800/60 rounded-full cursor-default border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <span class="px-4 py-1.5 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
            {{ t('home.heroBadge') }}
          </span>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-[5.5rem] font-extrabold tracking-tight text-white mb-8 leading-[1.1] drop-shadow-2xl">
          {{ t('home.heroTitle') || titlePrefix }} <br class="hidden sm:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 animate-gradient-x bg-[length:200%_auto] block mt-2 drop-shadow-lg">
            {{ titleHighlight }}
          </span>
        </h1>

        <p class="text-lg sm:text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl leading-relaxed mx-auto drop-shadow-md">
          {{ t('home.heroSubtitle') }}
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center gap-5 w-full justify-center">
          <template v-if="auth.isAuthenticated">
            <RouterLink to="/student/dashboard" class="w-full sm:w-auto">
              <button class="cta-shine relative overflow-hidden w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-white text-black px-10 py-4 text-lg font-bold transition-all hover:bg-slate-200 hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                Go to Dashboard
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/mentors" class="w-full sm:w-auto">
              <!-- Primary CTA -->
              <button class="cta-shine relative overflow-hidden w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-white text-[#0A0A0A] px-10 py-4 text-lg font-extrabold transition-all hover:bg-gray-100 hover:-translate-y-1 shadow-[0_4px_30px_rgba(255,255,255,0.4)] hover:shadow-[0_10px_50px_rgba(255,255,255,0.6)]">
                {{ t('home.ctaFindMentor') || 'Менторду табуу' }}
                <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </RouterLink>
            <RouterLink to="/register" class="w-full sm:w-auto">
              <!-- Secondary CTA -->
              <button class="cta-shine relative overflow-hidden w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-10 py-4 text-lg font-bold backdrop-blur-md transition hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5">
                {{ t('home.ctaRegister') || 'Катталуу' }}
              </button>
            </RouterLink>
          </template>
        </div>

        <!-- Social proof / Micro stats -->
        <div class="mt-14 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base font-semibold text-slate-300">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md shadow-lg">
            <span class="text-indigo-400 text-lg">✓</span> {{ t('home.proofMentors') }}
          </span>
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md shadow-lg">
            <span class="text-purple-400 text-lg">⚡</span> {{ t('home.proofFormats') }}
          </span>
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md shadow-lg">
            <span class="text-yellow-400 text-lg">★</span> {{ t('home.proofFree') }}
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
import AuroraBackground from '@/shared/ui/AuroraBackground.vue'
import KyrgyzDivider from '@/shared/ui/KyrgyzDivider.vue'

const { t, locale } = useI18n()
const auth = useAuthStore()

// Compute Title Parts mapping string from i18n
const titlePrefix = computed(() => {
  return locale.value === 'kg' ? 'Менторду табыңыз жана' : 'Найдите ментора и'
})
const titleHighlight = computed(() => {
  return locale.value === 'kg' ? 'ыңгайлуу форматта окууну баштаңыз' : 'начните обучение в удобном формате'
})
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

@keyframes cta-shine {
  0% { transform: translateX(-140%) skewX(-20deg); }
  20% { transform: translateX(240%) skewX(-20deg); }
  100% { transform: translateX(240%) skewX(-20deg); }
}

.cta-shine::before {
  content: '';
  position: absolute;
  top: -20%;
  left: 0;
  width: 35%;
  height: 140%;
  pointer-events: none;
  background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%);
  animation: cta-shine 4.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-gradient-x,
  .animate-slow-zoom,
  .animate-bounce,
  .cta-shine::before {
    animation: none !important;
    transform: none !important;
  }
}
</style>
