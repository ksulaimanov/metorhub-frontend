<template>
  <div class="relative flex min-h-screen flex-col bg-bg text-text-primary">
    <!-- Header -->
    <header
      class="fixed inset-x-0 top-0 z-50 border-b transition-all duration-300"
      :class="isHeaderScrolled
        ? 'border-border-subtle bg-bg/90 backdrop-blur shadow-sm'
        : 'border-transparent bg-transparent shadow-none'"
    >

      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4 relative z-10">
        <!-- Brand -->
        <RouterLink to="/" class="relative flex items-center gap-2 text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full">
          <AppLogo class="h-8 w-8 text-brand" />
          JaiMentorship
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-6 md:flex">
          <RouterLink
              to="/mentors"
              active-class="text-brand"
              class="relative px-2 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary after:content-[''] after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-[calc(100%-1rem)]"
          >
            {{ t('nav.mentors') }}
          </RouterLink>
          <RouterLink
              to="/about"
              active-class="text-brand"
              class="relative px-2 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary after:content-[''] after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-[calc(100%-1rem)]"
          >
            {{ t('nav.about') }}
          </RouterLink>

          <div class="mx-2 h-5 w-px bg-surface" />

          <LanguageSwitcher />

          <!-- Authenticated: show dashboard link -->
          <template v-if="authStore.isAuthenticated">
            <button
                type="button"
                @click="debugNav"
                class="relative flex items-center gap-2.5 rounded-full border border-border-default bg-surface-secondary p-1 pr-4 shadow-sm transition hover:bg-surface-secondary active:scale-[0.98] after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)]"
            >
              <ProfileAvatar
                :first-name="authStore.initials"
                size="sm"
                class="!h-8 !w-8 text-xs ring-0"
              />
              <span class="text-sm font-bold text-text-primary">{{ t('nav.dashboard') }}</span>
            </button>
          </template>

          <!-- Not authenticated: login + register -->
          <template v-else>
            <RouterLink
                to="/login"
                class="relative rounded-full border border-border-default bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface-hover hover:border-border-strong after:content-[''] after:absolute after:left-5 after:right-5 after:bottom-1.5 after:h-[2px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-[calc(100%-2.5rem)]"
            >
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink
                to="/register"
                class="relative rounded-full bg-brand text-on-brand px-5 py-2.5 text-sm font-bold transition hover:bg-brand-hover hover:-translate-y-0.5 shadow-sm after:content-[''] after:absolute after:left-5 after:right-5 after:bottom-1.5 after:h-[2px] after:w-0 after:bg-on-brand after:transition-all after:duration-300 hover:after:w-[calc(100%-2.5rem)]"
            >
              {{ t('nav.register') }}
            </RouterLink>
          </template>
        </nav>

        <!-- Mobile: minimal actions only -->
        <div class="flex items-center gap-2 text-text-secondary md:hidden">
          <LanguageSwitcher />

          <template v-if="authStore.isAuthenticated">
            <RouterLink
                :to="dashboardRoute"
                class="flex items-center justify-center p-1 rounded-full bg-surface-secondary shadow-sm border border-border-default transition hover:bg-surface-secondary active:scale-95"
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
                class="relative rounded-2xl bg-brand px-4 py-2 text-sm font-bold text-on-brand shadow-sm transition hover:bg-brand-hover after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-1 after:h-[2px] after:w-0 after:bg-on-brand after:transition-all after:duration-300 hover:after:w-[calc(100%-2rem)]"
            >
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink
                to="/register"
                class="relative hidden sm:inline-flex rounded-2xl bg-brand px-5 py-2 text-sm font-bold text-on-brand shadow-sm transition hover:bg-brand-hover hover:-translate-y-0.5 after:content-[''] after:absolute after:left-5 after:right-5 after:bottom-1 after:h-[2px] after:w-0 after:bg-on-brand after:transition-all after:duration-300 hover:after:w-[calc(100%-2.5rem)]"
            >
              {{ t('nav.register') }}
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Ornament divider above footer -->
    <div class="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 w-full flex justify-center">
      <div class="h-[1px] w-full max-w-3xl bg-gradient-to-r from-transparent via-border-default to-transparent border-0"></div>
    </div>

    <!-- Footer -->
    <AppFooter :variant="footerVariant" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/auth/model/authStore'
import AppFooter from '@/shared/ui/AppFooter.vue'
import LanguageSwitcher from '@/shared/ui/LanguageSwitcher.vue'
import AppLogo from '@/shared/ui/AppLogo.vue'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'
import { resolveDashboardPath } from '@/shared/lib/auth/resolveDashboardPath'

const { t } = useI18n()
const authStore = useAuthStore()

withDefaults(defineProps<{
  footerVariant?: 'full' | 'compact'
}>(), {
  footerVariant: 'full',
})

const dashboardRoute = computed(() => resolveDashboardPath(authStore.roles))

const debugNav = () => {
  console.log('AUTH_USER:', authStore.user)
  console.log('DASHBOARD_PATH:', resolveDashboardPath(authStore.roles))
}

const isHeaderScrolled = ref(false)

const handleScroll = () => {
  isHeaderScrolled.value = window.scrollY > 50
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
