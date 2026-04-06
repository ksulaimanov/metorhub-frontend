<template>
  <footer class="border-t border-border-brand/60 bg-white">
    <div class="mx-auto max-w-6xl px-4 sm:px-6" :class="variant === 'full' ? 'py-10 lg:py-14' : 'py-6'">

      <!-- Full footer: public pages -->
      <template v-if="variant === 'full'">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-brand text-xs font-bold text-white">J</span>
              <span class="text-lg font-extrabold tracking-tight text-text-primary">JaiMentorship</span>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-text-secondary">
              {{ t('footer.tagline') }}
            </p>
          </div>

          <!-- Platform -->
          <div>
            <h4 class="text-sm font-semibold text-text-primary">{{ t('footer.platform') }}</h4>
            <ul class="mt-3 space-y-2">
              <li>
                <RouterLink to="/about" class="text-sm text-text-secondary transition hover:text-brand">
                  {{ t('nav.about') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/mentors" class="text-sm text-text-secondary transition hover:text-brand">
                  {{ t('nav.mentors') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Account -->
          <div>
            <h4 class="text-sm font-semibold text-text-primary">{{ t('footer.account') }}</h4>
            <ul class="mt-3 space-y-2">
              <li>
                <RouterLink to="/login" class="text-sm text-text-secondary transition hover:text-brand">
                  {{ t('nav.login') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/register" class="text-sm text-text-secondary transition hover:text-brand">
                  {{ t('nav.register') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- For Mentors -->
          <div>
            <h4 class="text-sm font-semibold text-text-primary">{{ t('footer.forMentors') }}</h4>
            <ul class="mt-3 space-y-2">
              <li>
                <RouterLink to="/mentor/apply" class="text-sm text-text-secondary transition hover:text-brand">
                  {{ t('nav.becomeMentor') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/mentor/application/status" class="text-sm text-text-secondary transition hover:text-brand">
                  {{ t('nav.applicationStatus') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-sm font-semibold text-text-primary">{{ t('footer.legal') }}</h4>
            <ul class="mt-3 space-y-2">
              <li>
                <span class="cursor-default text-sm text-text-muted">
                  {{ t('footer.privacy') }}
                </span>
              </li>
              <li>
                <span class="cursor-default text-sm text-text-muted">
                  {{ t('footer.terms') }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Ornamental separator -->
        <div class="mt-10 mb-6">
          <KyrgyzDivider variant="subtle" size="sm" />
        </div>

        <!-- Support -->
        <div class="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p class="text-sm text-text-secondary">{{ t('support.title') }}</p>
          <div class="flex items-center gap-3">
            <a
                href="https://t.me/ksulaimanov"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-brand"
            >
              <Send class="h-4 w-4" />
              Telegram
            </a>
            <a
                href="mailto:ksulaimanov.dev@gmail.com"
                class="inline-flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-brand"
            >
              <Mail class="h-4 w-4" />
              Email
            </a>
          </div>
        </div>
      </template>

      <!-- Compact footer: lighter for auth/secondary pages -->
      <template v-else>
        <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div class="flex items-center gap-4">
            <RouterLink to="/" class="flex items-center gap-1.5 text-sm font-semibold text-text-primary transition hover:text-brand">
              <span class="flex h-5 w-5 items-center justify-center rounded-md bg-brand text-[10px] font-bold text-white">J</span>
              JaiMentorship
            </RouterLink>
            <span class="hidden h-3.5 w-px bg-border-brand/60 sm:block" />
            <div class="hidden items-center gap-3 sm:flex">
              <RouterLink to="/about" class="text-xs text-text-secondary transition hover:text-brand">{{ t('nav.about') }}</RouterLink>
              <RouterLink to="/mentors" class="text-xs text-text-secondary transition hover:text-brand">{{ t('nav.mentors') }}</RouterLink>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a
                href="https://t.me/ksulaimanov"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-xs text-text-secondary transition hover:text-brand"
            >
              <Send class="h-3.5 w-3.5" />
              Telegram
            </a>
            <a
                href="mailto:ksulaimanov.dev@gmail.com"
                class="inline-flex items-center gap-1 text-xs text-text-secondary transition hover:text-brand"
            >
              <Mail class="h-3.5 w-3.5" />
              Email
            </a>
          </div>
        </div>
      </template>

      <!-- Bottom copyright — always shown -->
      <div :class="variant === 'full' ? 'mt-6 border-t border-border-brand/60 pt-6' : 'mt-4 border-t border-border-brand/40 pt-4'">
        <p class="text-center text-xs text-text-secondary">
          © {{ new Date().getFullYear() }} JaiMentorship. {{ t('footer.rights') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Send, Mail } from 'lucide-vue-next'
import KyrgyzDivider from './KyrgyzDivider.vue'

const { t } = useI18n()

withDefaults(defineProps<{
  variant?: 'full' | 'compact'
}>(), {
  variant: 'full',
})
</script>
