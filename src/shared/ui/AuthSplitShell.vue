<template>
  <PublicLayout footer-variant="compact">
    <div class="relative min-h-screen">
      <!-- Ornament as a faint paper texture, not a coloured wash. -->
      <KyrgyzOrnamentPattern :opacity="0.04" :scale="1.5" class="absolute inset-0 z-0 pointer-events-none" />
      <section class="max-w-7xl mx-auto flex w-full items-start px-4 py-8 sm:px-6 lg:py-14 z-10 relative">
        <div class="grid w-full gap-10 lg:grid-cols-2 lg:gap-16 items-center">

          <!-- Left: info panel (desktop only) -->
          <div class="hidden lg:block bg-surface p-8 rounded-2xl border border-border-subtle shadow-sm">
            <p
                v-if="badge"
                class="inline-flex rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand border border-brand-border"
            >
              {{ badge }}
            </p>

            <h1 class="mt-5 max-w-lg font-display text-4xl font-medium leading-[1.1] tracking-tight text-text-primary">
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
                  class="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#16151D]/45"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div class="flex items-center gap-3 rounded-2xl border border-border-default bg-surface px-4 py-2.5 text-sm font-medium text-text-primary shadow-md">
                    <span class="h-4 w-4 rounded-full border-2 border-brand/30 border-t-brand animate-spin" aria-hidden="true" />
                    {{ t('common.loading') }}
                  </div>
                </div>

                <!-- Below-card links -->
                <AuthCard v-if="$slots.footer" compact class="mt-5 flex justify-center">
                  <slot name="footer" />
                </AuthCard>
              </div>
            </Transition>
          </div>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import PublicLayout from '@/widgets/layout/PublicLayout.vue'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'
import AuthCard from '@/shared/ui/AuthCard.vue'

const { t } = useI18n()

defineProps<{
  badge?: string
  title: string
  subtitle?: string
  isLoading?: boolean
}>()

const route = useRoute()
const authTransitionKey = computed(() => route.path)
</script>
