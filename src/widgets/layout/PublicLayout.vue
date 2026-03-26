<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <RouterLink to="/" class="text-2xl font-bold tracking-tight text-slate-900">
          MentorHub
        </RouterLink>

        <nav class="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <RouterLink to="/about" class="transition hover:text-slate-900">{{ t('nav.about') }}</RouterLink>
          <RouterLink to="/mentors" class="transition hover:text-slate-900">{{ t('nav.mentors') }}</RouterLink>
          <RouterLink to="/mentor/apply" class="transition hover:text-slate-900">{{ t('nav.becomeMentor') }}</RouterLink>
          <RouterLink to="/login" class="transition hover:text-slate-900">{{ t('nav.login') }}</RouterLink>
          <RouterLink
              to="/register"
              class="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:opacity-90"
          >
            {{ t('nav.register') }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-2 md:hidden">
          <RouterLink
              to="/login"
              class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            {{ t('nav.login') }}
          </RouterLink>
          <RouterLink
              to="/register"
              class="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            {{ t('nav.register') }}
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppFooter from '../../shared/ui/AppFooter.vue'

const { t } = useI18n()
</script>
