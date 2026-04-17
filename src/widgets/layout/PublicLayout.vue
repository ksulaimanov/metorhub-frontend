<template>
  <div class="flex min-h-screen flex-col bg-gradient-to-b from-[#0b122b] via-[#17143a] to-[#0b122b] text-text-primary">
    <!-- ”€”€”€ Header ”€”€”€ -->
    <header class="sticky top-0 z-30 border-b border-brand/20 bg-surface backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4">
        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-extrabold tracking-tight text-text-primary drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] sm:text-2xl">
          <AppLogo class="h-8 w-8 text-text-primary drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          JaiMentorship
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-1 text-sidebar-text/90 md:flex">
          <RouterLink
              to="/mentors"
              active-class="text-brand shadow-[0_0_10px_rgba(108,92,231,0.5)]"
              class="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-surface-secondary hover:text-text-primary"
          >
            {{ t('nav.mentors') }}
          </RouterLink>
          <RouterLink
              to="/about"
              active-class="text-brand shadow-[0_0_10px_rgba(108,92,231,0.5)]"
              class="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-surface-secondary hover:text-text-primary"
          >
            {{ t('nav.about') }}
          </RouterLink>

          <div class="mx-2 h-5 w-px bg-surface-secondary" />

          <LanguageSwitcher />

          <!-- Authenticated: show dashboard link -->
          <template v-if="authStore.isAuthenticated">
            <RouterLink
                :to="dashboardRoute"
                class="flex items-center gap-2.5 rounded-full border border-white/20 bg-surface-secondary p-1 pr-4 shadow-[0_0_15px_rgba(108,92,231,0.2)] transition hover:bg-surface-secondary active:scale-[0.98]"
            >
              <ProfileAvatar
                :first-name="authStore.initials"
                size="sm"
                class="!h-8 !w-8 text-xs ring-0"
              />
              <span class="text-sm font-bold text-text-primary">{{ t('nav.dashboard') }}</span>
            </RouterLink>
          </template>

          <!-- Not authenticated: login + register -->
          <template v-else>
            <RouterLink
                to="/login"
                class="rounded-2xl bg-brand px-5 py-2.5 text-sm font-bold text-text-primary shadow-[0_0_15px_rgba(108,92,231,0.35)] transition hover:bg-brand-hover hover:shadow-[0_4px_20px_rgba(108,92,231,0.55)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink
                to="/register"
                class="rounded-2xl bg-brand px-5 py-2.5 text-sm font-bold text-text-primary shadow-[0_0_15px_rgba(108,92,231,0.4)] transition hover:bg-brand-hover hover:shadow-[0_4px_20px_rgba(108,92,231,0.6)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {{ t('nav.register') }}
            </RouterLink>
          </template>
        </nav>

        <!-- Mobile: minimal actions only -->
        <div class="flex items-center gap-2 text-sidebar-text/90 md:hidden">
          <LanguageSwitcher />

          <template v-if="authStore.isAuthenticated">
            <RouterLink
                :to="dashboardRoute"
                class="flex items-center justify-center p-1 rounded-full bg-surface-secondary shadow-[0_0_15px_rgba(108,92,231,0.2)] border border-white/20 transition hover:bg-surface-secondary active:scale-95"
            >
              <ProfileAvatar
                :first-name="authStore.initials"
                size="sm"
                class="!h-9 !w-9 text-xs ring-0"
              />
            </RouterLink>
          </template>

          <template v-else>
            <RouterLink
                to="/login"
                class="rounded-2xl bg-brand px-4 py-2 text-sm font-bold text-text-primary shadow-[0_0_15px_rgba(108,92,231,0.35)] transition hover:bg-brand-hover"
            >
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink
                to="/register"
                class="hidden sm:inline-flex rounded-2xl bg-brand px-5 py-2 text-sm font-bold text-text-primary shadow-[0_0_15px_rgba(108,92,231,0.4)] transition hover:bg-brand-hover hover:-translate-y-0.5"
            >
              {{ t('nav.register') }}
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <!-- ”€”€”€ Main ”€”€”€ -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- ”€”€”€ Ornament divider above footer ”€”€”€ -->
    <div class="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 w-full flex justify-center">
      <div class="h-[1px] w-full max-w-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent border-0"></div>
    </div>

    <!-- ”€”€”€ Footer ”€”€”€ -->
    <AppFooter :variant="footerVariant" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/authStore'
import AppFooter from '../../shared/ui/AppFooter.vue'
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.vue'
import AppLogo from '../../components/AppLogo.vue'
import ProfileAvatar from '../../shared/ui/ProfileAvatar.vue'

const { t } = useI18n()
const authStore = useAuthStore()

withDefaults(defineProps<{
  footerVariant?: 'full' | 'compact'
}>(), {
  footerVariant: 'full',
})

const dashboardRoute = computed(() => {
  if (authStore.isAdmin) return '/admin/dashboard'
  if (authStore.isMentor) return '/mentor/dashboard'
  return '/student/dashboard'
})
</script>
