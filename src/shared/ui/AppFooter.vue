<template>
  <footer class="border-t border-border-brand/60 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">M</span>
            <span class="text-lg font-extrabold tracking-tight text-text-primary">MentorHub</span>
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
            <li>
              <RouterLink to="/mentor/apply" class="text-sm text-text-secondary transition hover:text-brand">
                {{ t('nav.becomeMentor') }}
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

      <!-- Bottom -->
      <div class="mt-10 border-t border-border-brand/60 pt-6">
        <p class="text-center text-xs text-text-secondary">
          © {{ new Date().getFullYear() }} MentorHub. {{ t('footer.rights') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
