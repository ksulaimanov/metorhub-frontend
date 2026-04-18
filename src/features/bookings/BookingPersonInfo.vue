<template>
  <div class="flex items-center gap-3.5">
    <ProfileAvatar
        :src="avatarUrl"
        :first-name="firstName"
        :last-name="lastName"
        :alt="displayName"
        size="sm"
    />
    <div class="min-w-0">
      <p class="truncate text-base font-semibold text-white">{{ displayName }}</p>
      <p v-if="subtitle" class="text-sm text-slate-400">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'

const { t } = useI18n()

const props = defineProps<{
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
  subtitle?: string
}>()

const displayName = computed(() => {
  const full = `${props.firstName || ''} ${props.lastName || ''}`.trim()
  return full || t('common.unknownUser')
})
</script>

