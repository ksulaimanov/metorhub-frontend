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
              <slot name="cards" />
            </div>
          </div>

          <!-- Right: form surface -->
          <div class="w-full max-w-xl justify-self-center lg:justify-self-end">
            <div class="rounded-[2rem] bg-surface backdrop-blur-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-border-brand sm:p-10 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />
              <div class="relative z-10">
                <slot />
              </div>
            </div>

            <!-- Below-card links -->
            <div v-if="$slots.footer" class="mt-5 backdrop-blur-xl rounded-2xl p-4 bg-surface border border-border-brand flex justify-center shadow-sm">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </section>
    </AuroraBackground>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AuroraBackground from '../../components/ui/AuroraBackground.vue'
import KyrgyzOrnamentPattern from '../../components/ui/KyrgyzOrnamentPattern.vue'

defineProps<{
  badge?: string
  title: string
  subtitle?: string
}>()
</script>
