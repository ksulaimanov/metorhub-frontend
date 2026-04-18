<template>
  <footer class="relative overflow-hidden bg-surface backdrop-blur-xl">
    <div class="pointer-events-none absolute inset-x-0 top-0 z-20 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <KyrgyzOrnamentPattern :opacity="0.08" :scale="1.5" class="text-sidebar-text mix-blend-screen" />

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6" :class="variant === 'full' ? 'py-10 lg:py-14' : 'py-6'">

      <!-- Full footer: public pages -->
      <template v-if="variant === 'full'">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 items-start">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2">
              <AppLogo class="h-7 w-7 shrink-0 text-text-primary" />
              <span class="text-lg font-extrabold tracking-tight text-text-primary">JaiMentorship</span>
            </div>
            <p class="mt-4 text-sm leading-relaxed text-sidebar-text/90">
              {{ t('footer.tagline') }}
            </p>
          </div>

          <!-- Platform -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-text-primary uppercase tracking-wider">{{ t('footer.platform') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <RouterLink to="/about" class="text-sm text-sidebar-text/90 transition hover:text-text-primary">
                  {{ t('nav.about') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/mentors" class="text-sm text-sidebar-text/90 transition hover:text-text-primary">
                  {{ t('nav.mentors') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Account -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-text-primary uppercase tracking-wider">{{ t('footer.account') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <RouterLink to="/login" class="text-sm text-sidebar-text/90 transition hover:text-text-primary">
                  {{ t('nav.login') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/register" class="text-sm text-sidebar-text/90 transition hover:text-text-primary">
                  {{ t('nav.register') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- For Mentors -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-text-primary uppercase tracking-wider">{{ t('footer.forMentors') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <RouterLink to="/mentor/apply" class="text-sm text-sidebar-text/90 transition hover:text-text-primary">
                  {{ t('nav.becomeMentor') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/mentor/application/status" class="text-sm text-sidebar-text/90 transition hover:text-text-primary">
                  {{ t('nav.applicationStatus') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-text-primary uppercase tracking-wider">{{ t('footer.legal') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <span class="cursor-default text-sm text-sidebar-text/75 transition hover:text-sidebar-text/95">
                  {{ t('footer.privacy') }}
                </span>
              </li>
              <li>
                <span class="cursor-default text-sm text-sidebar-text/75 transition hover:text-sidebar-text/95">
                  {{ t('footer.terms') }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Ornamental separator -->
        <div class="mt-12 mb-8">
          <OrnamentDivider :opacity="0.3" class="text-brand-soft" />
        </div>

        <!-- Support -->
        <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p class="text-sm font-medium text-sidebar-text/90">{{ t('support.title') }}</p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a
                href="https://t.me/ksulaimanov"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-text/90 transition hover:bg-surface/10 hover:text-text-primary"
            >
              <Send class="h-4 w-4" />
              Telegram
            </a>
            <a
                :href="`mailto:${SUPPORT_EMAIL}`"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-text/90 transition hover:bg-surface/10 hover:text-text-primary"
                aria-label="Contact support via email"
            >
              <Mail class="h-4 w-4" />
              {{ SUPPORT_EMAIL }}
            </a>
            <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-sidebar-text/90 transition hover:bg-surface/10 hover:text-text-primary"
                @click="copyEmail"
                aria-label="Copy support email"
            >
              <Copy class="h-4 w-4" />
              Копировать
            </button>
          </div>
        </div>
      </template>

      <!-- Compact footer: lighter for auth/secondary pages -->
      <template v-else>
        <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div class="flex items-center gap-4">
            <RouterLink to="/" class="flex items-center gap-1.5 text-sm font-semibold text-text-primary transition hover:text-sidebar-text">
              <AppLogo class="h-5 w-5 shrink-0 text-text-primary" />
              JaiMentorship
            </RouterLink>
            <span class="hidden h-3.5 w-px bg-sidebar-hover sm:block" />
            <div class="hidden items-center gap-3 sm:flex">
              <RouterLink to="/about" class="text-xs text-sidebar-text transition hover:text-text-primary">{{ t('nav.about') }}</RouterLink>
              <RouterLink to="/mentors" class="text-xs text-sidebar-text transition hover:text-text-primary">{{ t('nav.mentors') }}</RouterLink>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a
                href="https://t.me/ksulaimanov"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-xs text-sidebar-text transition hover:text-text-primary p-1"
            >
              <Send class="h-3.5 w-3.5" />
              Telegram
            </a>
            <a
                :href="`mailto:${SUPPORT_EMAIL}`"
                class="inline-flex items-center gap-1 text-xs text-sidebar-text transition hover:text-text-primary p-1 hover:underline"
                aria-label="Contact support via email"
            >
              <Mail class="h-3.5 w-3.5" />
              {{ SUPPORT_EMAIL }}
            </a>
             <button
                type="button"
                class="inline-flex items-center gap-1 text-xs text-sidebar-text hover:text-text-primary p-1"
                @click="copyEmail"
            >
              <Copy class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </template>

      <!-- Bottom copyright — always shown -->
      <div :class="variant === 'full' ? 'mt-8 pt-6' : 'mt-4 pt-4'">
        <div class="mx-auto mb-4 h-[1px] w-full max-w-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
        <p class="text-center text-[11px] font-medium tracking-wide text-sidebar-text/60">
          © {{ new Date().getFullYear() }} JaiMentorship. Бардык укуктар корголгон.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Send, Mail, Copy } from 'lucide-vue-next'
import AppLogo from '@/shared/ui/AppLogo.vue'
import OrnamentDivider from '@/shared/ui/OrnamentDivider.vue'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'

const { t } = useI18n()
const toastStore = useToastStore()

const SUPPORT_EMAIL = 'ksulaimanov.dev@gmail.com'

const copyEmail = () => {
  navigator.clipboard.writeText(SUPPORT_EMAIL)
  toastStore.success('Email copied to clipboard')
}

withDefaults(defineProps<{
  variant?: 'full' | 'compact'
}>(), {
  variant: 'full',
})
</script>
