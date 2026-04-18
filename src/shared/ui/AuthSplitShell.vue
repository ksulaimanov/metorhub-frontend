<template>
  <PublicLayout footer-variant="compact">
    <AuroraBackground :showRadialGradient="false" aurora-opacity="opacity-10 dark:opacity-15" class="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] !bg-transparent before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/30">
      <KyrgyzOrnamentPattern :opacity="0.06" :scale="1.5" class="absolute inset-0 z-0 pointer-events-none mix-blend-overlay" />
      <section class="max-w-7xl mx-auto flex w-full items-start px-4 py-8 sm:px-6 lg:py-14 z-10 relative">
        <div class="grid w-full gap-10 lg:grid-cols-2 lg:gap-16 items-center">

          <!-- Left: info panel (desktop only) -->
          <div class="hidden lg:block backdrop-blur-xl bg-surface p-8 rounded-[2rem] border border-border-brand shadow-[0_0_40px_rgba(108,92,231,0.15)]">
            <p
                v-if="badge"
                class="inline-flex rounded-full bg-surface-secondary backdrop-blur-md px-4 py-1.5 text-sm font-medium text-brand-soft border border-border-subtle"
            >
              {{ badge }}
            </p>

            <h1 class="mt-5 max-w-lg text-4xl font-extrabold leading-tight text-text-primary xl:text-[2.75rem]">
              {{ title }}
            </h1>

            <p v-if="subtitle" class="mt-5 max-w-md text-base leading-7 text-text-secondary">
              {{ subtitle }}
            </p>

            <!-- Info cards -->
            <div v-if="$slots.cards" class="mt-8 grid max-w-lg gap-3">
              <slot name="cards" :is-loading="isLoading" />
            </div>
          </div>

          <!-- Right: form surface -->
          <div class="w-full max-w-xl justify-self-center lg:justify-self-end">
            <Transition name="auth-card" mode="out-in">
              <div :key="authTransitionKey" class="relative">
                <AuthCard :show-accent-glow="true" :class="isLoading ? 'pointer-events-none' : ''">
                  <slot />
                </AuthCard>

                <div
                  v-if="isLoading"
                  class="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[#2f234f]/45 backdrop-blur-[2px]"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div class="flex items-center gap-3 rounded-2xl border border-border-brand bg-surface px-4 py-2.5 text-sm font-medium text-brand-soft shadow-[0_0_20px_rgba(108,92,231,0.25)]">
                    <span class="h-4 w-4 rounded-full border-2 border-brand/30 border-t-brand animate-spin" aria-hidden="true" />
                    Загрузка...
                  </div>
                </div>

                <!-- Below-card links -->
                <AuthCard v-if="$slots.footer" compact class="mt-5 flex justify-center backdrop-blur-xl">
                  <slot name="footer" />
                </AuthCard>
              </div>
            </Transition>
          </div>
        </div>
      </section>
    </AuroraBackground>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '@/widgets/layout/PublicLayout.vue'
import AuroraBackground from '@/shared/ui/AuroraBackground.vue'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'
import AuthCard from '@/shared/ui/AuthCard.vue'

defineProps<{
  badge?: string
  title: string
  subtitle?: string
  isLoading?: boolean
}>()

const route = useRoute()
const authTransitionKey = computed(() => route.path)
</script>
