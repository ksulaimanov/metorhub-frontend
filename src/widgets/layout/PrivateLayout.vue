<template>
  <div class="flex h-screen bg-bg text-text-primary">
    <!-- Sidebar -->
    <SidebarNav
        :role="currentRole"
        :mobile-open="mobileMenuOpen"
        @close-mobile="mobileMenuOpen = false"
    />

    <!-- Main content area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Top header bar -->
      <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-brand/60 bg-surface/90 px-4 backdrop-blur-lg sm:px-6">
        <!-- Left: mobile menu toggle + brand on mobile -->
        <div class="flex items-center gap-3">
          <button
              class="rounded-xl p-2 text-text-secondary transition hover:bg-brand-soft hover:text-brand lg:hidden"
              @click="mobileMenuOpen = true"
          >
            <Menu class="h-5 w-5" />
          </button>

          <RouterLink to="/" class="flex items-center gap-2 lg:hidden">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">J</span>
            <span class="text-base font-extrabold tracking-tight text-text-primary">JaiMentorship</span>
          </RouterLink>
        </div>

        <!-- Right: language + user + logout -->
        <div class="flex items-center gap-2">
          <LanguageSwitcher />

          <div class="hidden items-center gap-2.5 sm:flex">
            <div class="h-5 w-px bg-border-brand/60" />
            <div class="flex items-center gap-2">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                {{ authStore.initials }}
              </div>
              <span class="max-w-[140px] truncate text-sm font-medium text-text-primary">{{ authStore.displayName }}</span>
            </div>
          </div>

          <button
              @click="logout"
              class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut class="h-4 w-4" />
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Menu, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import SidebarNav from '../../widgets/sidebar/SidebarNav.vue'
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.vue'

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