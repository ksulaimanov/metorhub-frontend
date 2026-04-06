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

    <!-- User identity block -->
    <div :class="['border-b border-white/5', collapsed ? 'px-3 py-3' : 'px-4 py-4']">
      <div :class="['flex items-center', collapsed ? 'justify-center' : 'gap-3']">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft/15 text-sm font-bold text-accent">
          {{ authStore.initials }}
        </div>
        <div v-if="!collapsed" class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-white">{{ authStore.displayName }}</p>
          <span class="mt-0.5 inline-block rounded bg-sidebar-active px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-text">
            {{ t(`roles.${role}`) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Grouped nav items -->
    <nav class="flex-1 overflow-y-auto px-3 py-3">
      <div v-for="(group, gi) in navGroups" :key="gi" :class="gi > 0 ? 'mt-4' : ''">
        <p v-if="!collapsed" class="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-text/40">
          {{ t(group.labelKey) }}
        </p>
        <div v-else-if="gi > 0" class="mx-auto mb-2 mt-2 h-px w-6 bg-white/10" />
        <div class="space-y-0.5">
          <SidebarNavItem
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              :label="t(item.i18nKey)"
              :icon="item.icon"
              :collapsed="collapsed"
          />
        </div>
      </div>
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

          <!-- Mobile user identity -->
          <div class="border-b border-white/5 px-4 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft/15 text-sm font-bold text-accent">
                {{ authStore.initials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-white">{{ authStore.displayName }}</p>
                <span class="mt-0.5 inline-block rounded bg-sidebar-active px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-text">
                  {{ t(`roles.${role}`) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Mobile grouped nav -->
          <nav class="flex-1 overflow-y-auto px-3 py-3" @click="$emit('close-mobile')">
            <div v-for="(group, gi) in navGroups" :key="gi" :class="gi > 0 ? 'mt-4' : ''">
              <p class="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-text/40">
                {{ t(group.labelKey) }}
              </p>
              <div class="space-y-0.5">
                <SidebarNavItem
                    v-for="item in group.items"
                    :key="item.to"
                    :to="item.to"
                    :label="t(item.i18nKey)"
                    :icon="item.icon"
                />
              </div>
            </div>
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
import { useAuthStore } from '../../stores/authStore'
import SidebarNavItem from './SidebarNavItem.vue'
import {
  studentNavGroups,
  mentorNavGroups,
  adminNavGroups,
  type SidebarNavGroup,
} from './sidebarNavConfig'

const props = defineProps<{
  role: 'student' | 'mentor' | 'admin'
  mobileOpen?: boolean
}>()

defineEmits<{
  'close-mobile': []
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const collapsed = useLocalStorage('jaim-sidebar-collapsed', false)

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const navGroups = computed<SidebarNavGroup[]>(() => {
  switch (props.role) {
    case 'student': return studentNavGroups
    case 'mentor': return mentorNavGroups
    case 'admin': return adminNavGroups
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

