<template>
  <!-- Desktop sidebar -->
  <aside
      :class="[
        'sidebar-transition hidden flex-col border-r border-white/5 bg-sidebar-bg lg:flex',
        collapsed ? 'w-[68px]' : 'w-[240px]',
      ]"
  >
    <!-- Brand -->
    <div class="flex h-16 items-center gap-2.5 border-b border-white/5 px-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">J</span>
      <span v-if="!collapsed" class="text-base font-extrabold tracking-tight text-white">JaiMentorship</span>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 space-y-1 px-3 py-4">
      <SidebarNavItem
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :label="t(item.i18nKey)"
          :icon="item.icon"
          :collapsed="collapsed"
      />
    </nav>

    <!-- Bottom section -->
    <div class="space-y-1 border-t border-white/5 px-3 py-4">
      <SidebarNavItem
          to="/mentors"
          :label="t('sidebar.browseMentors')"
          :icon="Search"
          :collapsed="collapsed"
      />

      <button
          @click="toggleCollapsed"
          :class="[
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-text transition-all hover:bg-sidebar-hover hover:text-sidebar-text-active',
            collapsed ? 'justify-center' : '',
          ]"
      >
        <component :is="collapsed ? ChevronsRight : ChevronsLeft" class="h-[18px] w-[18px] shrink-0" />
        <span v-if="!collapsed">{{ t('sidebar.collapse') }}</span>
      </button>
    </div>
  </aside>

  <!-- Mobile overlay -->
  <Teleport to="body">
    <Transition name="mobile-sidebar">
      <div v-if="mobileOpen" class="fixed inset-0 z-50 flex lg:hidden">
        <div class="fixed inset-0 bg-black/40" @click="$emit('close-mobile')" />
        <aside class="relative flex w-[260px] flex-col bg-sidebar-bg shadow-xl">
          <!-- Brand -->
          <div class="flex h-16 items-center justify-between border-b border-white/5 px-4">
            <div class="flex items-center gap-2.5">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">J</span>
              <span class="text-base font-extrabold tracking-tight text-white">JaiMentorship</span>
            </div>
            <button @click="$emit('close-mobile')" class="rounded-lg p-1 text-sidebar-text hover:text-white">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Nav items -->
          <nav class="flex-1 space-y-1 px-3 py-4" @click="$emit('close-mobile')">
            <SidebarNavItem
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                :label="t(item.i18nKey)"
                :icon="item.icon"
            />
          </nav>

          <div class="space-y-1 border-t border-white/5 px-3 py-4" @click="$emit('close-mobile')">
            <SidebarNavItem
                to="/mentors"
                :label="t('sidebar.browseMentors')"
                :icon="Search"
            />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'
import { Search, ChevronsLeft, ChevronsRight, X } from 'lucide-vue-next'
import SidebarNavItem from './SidebarNavItem.vue'
import {
  studentNavItems,
  mentorNavItems,
  adminNavItems,
  type SidebarNavItem as NavItemType,
} from './sidebarNavConfig'

const props = defineProps<{
  role: 'student' | 'mentor' | 'admin'
  mobileOpen?: boolean
}>()

defineEmits<{
  'close-mobile': []
}>()

const { t } = useI18n()

const collapsed = useLocalStorage('jaim-sidebar-collapsed', false)

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const navItems = computed<NavItemType[]>(() => {
  switch (props.role) {
    case 'student': return studentNavItems
    case 'mentor': return mentorNavItems
    case 'admin': return adminNavItems
    default: return []
  }
})
</script>

<style scoped>
.mobile-sidebar-enter-active,
.mobile-sidebar-leave-active {
  transition: opacity 200ms ease;
}
.mobile-sidebar-enter-active aside,
.mobile-sidebar-leave-active aside {
  transition: transform 200ms ease;
}
.mobile-sidebar-enter-from,
.mobile-sidebar-leave-to {
  opacity: 0;
}
.mobile-sidebar-enter-from aside,
.mobile-sidebar-leave-to aside {
  transform: translateX(-100%);
}
</style>

