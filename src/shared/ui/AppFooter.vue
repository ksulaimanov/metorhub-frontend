<template>
  <footer class="border-t border-border-brand/60 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
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
              <a href="#" class="text-sm text-text-secondary transition hover:text-brand">
                {{ t('footer.privacy') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-text-secondary transition hover:text-brand">
                {{ t('footer.terms') }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Support -->
      <div class="mt-10 flex flex-col items-center gap-2 border-t border-border-brand/60 pt-6 sm:flex-row sm:justify-between">
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

      <!-- Bottom -->
      <div class="mt-6 border-t border-border-brand/60 pt-6">
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

const { t } = useI18n()
</script>
