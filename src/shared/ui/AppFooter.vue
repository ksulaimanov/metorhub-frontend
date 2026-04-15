<template>
  <footer class="relative overflow-hidden border-t border-sidebar-hover bg-sidebar-bg">
    <!-- Deeper purple background specifically for the footer to make it stand out -->
    <KyrgyzOrnamentPattern :opacity="0.08" :scale="1.5" class="text-sidebar-text mix-blend-screen" />

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6" :class="variant === 'full' ? 'py-10 lg:py-14' : 'py-6'">

      <!-- Full footer: public pages -->
      <template v-if="variant === 'full'">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 items-start">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2">
              <AppLogo class="h-7 w-7 shrink-0 text-white" />
              <span class="text-lg font-extrabold tracking-tight text-white">JaiMentorship</span>
            </div>
            <p class="mt-4 text-sm leading-relaxed text-sidebar-text/80">
              {{ t('footer.tagline') }}
            </p>
          </div>

          <!-- Platform -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-white uppercase tracking-wider">{{ t('footer.platform') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <RouterLink to="/about" class="text-sm text-sidebar-text transition hover:text-white">
                  {{ t('nav.about') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/mentors" class="text-sm text-sidebar-text transition hover:text-white">
                  {{ t('nav.mentors') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Account -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-white uppercase tracking-wider">{{ t('footer.account') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <RouterLink to="/login" class="text-sm text-sidebar-text transition hover:text-white">
                  {{ t('nav.login') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/register" class="text-sm text-sidebar-text transition hover:text-white">
                  {{ t('nav.register') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- For Mentors -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-white uppercase tracking-wider">{{ t('footer.forMentors') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <RouterLink to="/mentor/apply" class="text-sm text-sidebar-text transition hover:text-white">
                  {{ t('nav.becomeMentor') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/mentor/application/status" class="text-sm text-sidebar-text transition hover:text-white">
                  {{ t('nav.applicationStatus') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="mt-1 text-sm font-semibold text-white uppercase tracking-wider">{{ t('footer.legal') }}</h4>
            <ul class="mt-4 space-y-3">
              <li>
                <span class="cursor-default text-sm text-sidebar-text/50 transition hover:text-sidebar-text/80">
                  {{ t('footer.privacy') }}
                </span>
              </li>
              <li>
                <span class="cursor-default text-sm text-sidebar-text/50 transition hover:text-sidebar-text/80">
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
          <p class="text-sm text-sidebar-text font-medium">{{ t('support.title') }}</p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a
                href="https://t.me/ksulaimanov"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-sidebar-text transition hover:text-white hover:bg-surface/10 px-3 py-1.5 rounded-lg"
            >
              <Send class="h-4 w-4" />
              Telegram
            </a>
            <a
                :href="`mailto:${SUPPORT_EMAIL}`"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-sidebar-text transition hover:text-white hover:bg-surface/10 px-3 py-1.5 rounded-lg"
                aria-label="Contact support via email"
            >
              <Mail class="h-4 w-4" />
              {{ SUPPORT_EMAIL }}
            </a>
            <button
                type="button"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-sidebar-text transition hover:text-white hover:bg-surface/10 px-3 py-1.5 rounded-lg"
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
            <RouterLink to="/" class="flex items-center gap-1.5 text-sm font-semibold text-white transition hover:text-sidebar-text">
              <AppLogo class="h-5 w-5 shrink-0 text-white" />
              JaiMentorship
            </RouterLink>
            <span class="hidden h-3.5 w-px bg-sidebar-hover sm:block" />
            <div class="hidden items-center gap-3 sm:flex">
              <RouterLink to="/about" class="text-xs text-sidebar-text transition hover:text-white">{{ t('nav.about') }}</RouterLink>
              <RouterLink to="/mentors" class="text-xs text-sidebar-text transition hover:text-white">{{ t('nav.mentors') }}</RouterLink>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a
                href="https://t.me/ksulaimanov"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-xs text-sidebar-text transition hover:text-white p-1"
            >
              <Send class="h-3.5 w-3.5" />
              Telegram
            </a>
            <a
                :href="`mailto:${SUPPORT_EMAIL}`"
                class="inline-flex items-center gap-1 text-xs text-sidebar-text transition hover:text-white p-1 hover:underline"
                aria-label="Contact support via email"
            >
              <Mail class="h-3.5 w-3.5" />
              {{ SUPPORT_EMAIL }}
            </a>
             <button
                type="button"
                class="inline-flex items-center gap-1 text-xs text-sidebar-text hover:text-white p-1"
                @click="copyEmail"
            >
              <Copy class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </template>

      <!-- Bottom copyright — always shown -->
      <div :class="variant === 'full' ? 'mt-8 border-t border-sidebar-hover pt-6' : 'mt-4 border-t border-sidebar-hover pt-4'">
        <p class="text-center text-[11px] font-medium tracking-wide text-sidebar-text/40 opacity-70">
          © {{ new Date().getFullYear() }} JaiMentorship. Бардык укуктар корголгон.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Send, Mail, Copy } from 'lucide-vue-next'
import AppLogo from '../../components/AppLogo.vue'
import OrnamentDivider from '../../components/ui/OrnamentDivider.vue'
import KyrgyzOrnamentPattern from '../../components/ui/KyrgyzOrnamentPattern.vue'
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
