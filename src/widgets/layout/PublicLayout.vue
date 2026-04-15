<template>
  <div class="flex min-h-screen flex-col bg-bg text-text-primary">
    <!-- ─── Header ─── -->
    <header class="sticky top-0 z-30 border-b border-border-brand/60 bg-surface/80 backdrop-blur-lg">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4">
        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand sm:text-2xl">
          <AppLogo class="h-8 w-8" />
          JaiMentorship
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-1 md:flex">
          <RouterLink
              to="/mentors"
              class="rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-brand-soft hover:text-brand"
          >
            {{ t('nav.mentors') }}
          </RouterLink>
          <RouterLink
              to="/about"
              class="rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-brand-soft hover:text-brand"
          >
            {{ t('nav.about') }}
          </RouterLink>

          <div class="mx-2 h-5 w-px bg-border-brand/60" />

          <LanguageSwitcher />

          <!-- Authenticated: show dashboard link -->
          <template v-if="authStore.isAuthenticated">
            <RouterLink
                :to="dashboardRoute"
                class="flex items-center gap-2.5 rounded-full border border-border-brand bg-surface p-1 pr-4 shadow-sm transition hover:bg-surface-secondary hover:shadow active:scale-[0.98]"
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
                class="rounded-2xl px-5 py-2.5 text-sm font-bold text-text-primary transition hover:bg-surface-secondary active:scale-[0.98]"
            >
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink
                to="/register"
                class="rounded-2xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {{ t('nav.register') }}
            </RouterLink>
          </template>
        </nav>

        <!-- Mobile: minimal actions only -->
        <div class="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />

          <template v-if="authStore.isAuthenticated">
            <RouterLink
                :to="dashboardRoute"
                class="flex items-center justify-center p-1 rounded-full bg-surface shadow-sm border border-border-brand transition hover:bg-surface-secondary active:scale-95"
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
                class="rounded-2xl px-4 py-2 text-sm font-bold text-text-primary transition hover:bg-surface-secondary"
            >
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink
                to="/register"
                class="hidden sm:inline-flex rounded-2xl bg-brand px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover hover:-translate-y-0.5"
            >
              {{ t('nav.register') }}
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <!-- ─── Main ─── -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- ─── Ornament divider above footer ─── -->
    <div class="mx-auto max-w-7xl px-4 pb-2 sm:px-6">
      <KyrgyzDivider variant="subtle" size="sm" />
    </div>

    <!-- ─── Footer ─── -->
    <AppFooter :variant="footerVariant" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/authStore'
import AppFooter from '../../shared/ui/AppFooter.vue'
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.vue'
import KyrgyzDivider from '../../shared/ui/KyrgyzDivider.vue'
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
