<template>
  <div class="flex min-h-screen flex-col bg-bg text-text-primary">
    <!-- ─── Header ─── -->
    <header class="sticky top-0 z-30 border-b border-border-brand/60 bg-white/80 backdrop-blur-lg">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4">
        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand sm:text-2xl">
          <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">M</span>
          MentorHub
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-1 md:flex">
          <RouterLink
              to="/about"
              class="rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-brand-soft hover:text-brand"
          >
            {{ t('nav.about') }}
          </RouterLink>
          <RouterLink
              to="/mentors"
              class="rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-brand-soft hover:text-brand"
          >
            {{ t('nav.mentors') }}
          </RouterLink>
          <RouterLink
              to="/mentor/apply"
              class="rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-brand-soft hover:text-brand"
          >
            {{ t('nav.becomeMentor') }}
          </RouterLink>

          <div class="mx-2 h-5 w-px bg-border-brand/60" />

          <RouterLink
              to="/login"
              class="rounded-xl px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-brand-soft"
          >
            {{ t('nav.login') }}
          </RouterLink>
          <RouterLink
              to="/register"
              class="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-hover"
          >
            {{ t('nav.register') }}
          </RouterLink>
        </nav>

        <!-- Mobile: minimal actions only -->
        <div class="flex items-center gap-2 md:hidden">
          <RouterLink
              to="/login"
              class="rounded-xl px-3 py-2 text-sm font-semibold text-text-primary transition hover:bg-brand-soft"
          >
            {{ t('nav.login') }}
          </RouterLink>
          <RouterLink
              to="/register"
              class="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-hover"
          >
            {{ t('nav.register') }}
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- ─── Main ─── -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- ─── Footer ─── -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppFooter from '../../shared/ui/AppFooter.vue'

const { t } = useI18n()
</script>
