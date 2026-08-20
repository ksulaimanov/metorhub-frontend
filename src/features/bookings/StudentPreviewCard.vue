<template>
  <div class="h-full flex flex-col bg-surface border border-white/10 shadow-md overflow-hidden rounded-2xl ring-1 ring-border-brand/50 shadow-xl relative">
    <div class="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-brand/10 to-transparent pointer-events-none" />

    <div class="relative z-10 flex flex-col items-center p-6 text-center border-b border-border-subtle">
      <ProfileAvatar
        :src="student.avatarUrl"
        :first-name="student.firstName"
        :last-name="student.lastName"
        size="lg"
        class="mb-3 ring-4 ring-surface shadow-sm"
      />
      <h3 class="text-xl font-bold text-white">{{ student.firstName }} {{ student.lastName }}</h3>
      <p class="text-sm font-medium text-brand/80 mt-1">@{{ student.username || 'student' }}</p>
    </div>

    <div class="flex-1 overflow-y-auto p-6 space-y-6">
      <!-- Goals -->
      <div>
        <h4 class="text-xs uppercase tracking-wider font-bold text-text-muted mb-3 flex items-center gap-2">
          <Target class="h-4 w-4" />
          Learning Goals
        </h4>
        <p class="text-sm text-text-secondary leading-relaxed">
          {{ student.learningGoals || 'Student hasn\'t specified their goals yet, this is a great topic to discuss during your first call!' }}
        </p>
      </div>

      <!-- Stats -->
      <div>
        <h4 class="text-xs uppercase tracking-wider font-bold text-text-muted mb-3 flex items-center gap-2">
          <BarChart2 class="h-4 w-4" />
          Platform Stats
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-surface-secondary rounded-xl p-3 text-center">
            <span class="block text-2xl font-bold text-text-primary">{{ student.completedLessons || 0 }}</span>
            <span class="block text-xs font-medium text-text-secondary mt-1">Lessons Done</span>
          </div>
          <div class="bg-surface-secondary rounded-xl p-3 text-center">
            <span class="block text-2xl font-bold text-brand">{{ student.activeCourses || 0 }}</span>
            <span class="block text-xs font-medium text-text-secondary mt-1">Active Courses</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Target, BarChart2 } from 'lucide-vue-next'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'

defineProps<{
  student: {
    firstName?: string
    lastName?: string
    username?: string
    avatarUrl?: string
    learningGoals?: string
    completedLessons?: number
    activeCourses?: number
  }
}>()
</script>

