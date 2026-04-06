<template>
  <RouterLink
      :to="to"
      :class="[
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
        isActive
            ? 'bg-sidebar-active text-sidebar-text-active shadow-sm'
            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active',
        collapsed ? 'justify-center' : '',
      ]"
      :title="collapsed ? label : undefined"
  >
    <!-- Active accent bar -->
    <span
        v-if="isActive && !collapsed"
        class="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent"
    />

    <component
        :is="icon"
        :class="[
          'h-[18px] w-[18px] shrink-0 transition-colors',
          isActive ? 'text-accent' : 'text-sidebar-text group-hover:text-sidebar-text-active',
        ]"
    />
    <span v-if="!collapsed" class="truncate">{{ label }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'

const props = defineProps<{
  to: string
  label: string
  icon: Component
  collapsed?: boolean
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>

