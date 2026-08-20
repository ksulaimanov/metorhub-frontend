<template>
  <div class="flex h-screen bg-bg text-text-primary">
    <KyrgyzOrnamentPattern :opacity="0.05" :scale="1.5" class="fixed inset-0 z-0 pointer-events-none" />

    <!-- Sidebar -->
    <SidebarNav
        :role="currentRole"
        :mobile-open="mobileMenuOpen"
        @close-mobile="mobileMenuOpen = false"
        class="relative z-20"
    />

    <!-- Main content area -->
    <div class="flex flex-1 flex-col overflow-hidden relative z-10">
      <!-- Top header bar -->
      <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-subtle bg-bg/85 backdrop-blur px-4 sm:px-6">
        <!-- Left: mobile menu toggle + brand on mobile -->
        <div class="flex items-center gap-3">
          <button
              class="rounded-xl p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary lg:hidden"
              @click="mobileMenuOpen = true"
          >
            <Menu class="h-5 w-5" />
          </button>

          <RouterLink to="/" class="flex items-center gap-2 lg:hidden">
            <AppLogo class="h-7 w-7 shrink-0" />
            <span class="text-base font-semibold tracking-tight text-text-primary">JaiMentorship</span>
          </RouterLink>
        </div>

        <!-- Right: language + user + logout -->
        <div class="flex items-center gap-2">
          <NotificationBell v-if="authStore.isStudent" />
          <LanguageSwitcher />

          <div class="hidden items-center gap-2.5 sm:flex">
            <div class="h-5 w-px bg-border-default" />
            <div class="flex items-center gap-2">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-on-brand">
                {{ authStore.initials }}
              </div>
              <span class="max-w-[140px] truncate text-sm font-medium text-text-primary">{{ authStore.displayName }}</span>
            </div>
          </div>

          <button
              @click="logout"
              class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-danger-soft hover:text-danger group"
          >
            <LogOut class="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">{{ t('privateNav.logout') }}</span>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
          <slot />
        </div>
      </main>
    </div>
    <StudentReviewModal />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Menu, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/entities/auth/model/authStore'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'
import SidebarNav from '@/widgets/sidebar/SidebarNav.vue'
import LanguageSwitcher from '@/shared/ui/LanguageSwitcher.vue'
import AppLogo from '@/shared/ui/AppLogo.vue'
import NotificationBell from '@/widgets/header/NotificationBell.vue'
import StudentReviewModal from '@/features/reviews/StudentReviewModal.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

const currentRole = computed<'student' | 'mentor' | 'admin'>(() => {
  if (authStore.isAdmin) return 'admin'
  if (authStore.isMentor) return 'mentor'
  return 'student'
})


const logout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
