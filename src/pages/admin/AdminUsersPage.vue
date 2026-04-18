<template>
  <PrivateLayout role="admin">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Users Management</h1>
          <p class="mt-1 text-sm text-slate-400">Manage registered users, their roles, and access.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative w-full sm:w-72">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              class="w-full rounded-xl border border-border-subtle bg-white/5 backdrop-blur-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              v-model="searchQuery"
              @input="onSearch"
            />
          </div>
        </div>
      </div>

      <div class="grid gap-4">
        <!-- Mock Data for Display purposes as per requirements -->
        <AppCard v-for="user in users" :key="user.id" class="backdrop-blur-xl bg-surface/80 hover:shadow-md transition-all">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <ProfileAvatar
                :src="user.avatarUrl"
                :first-name="user.firstName"
                :last-name="user.lastName"
                size="md"
              />
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-text-primary">{{ user.firstName }} {{ user.lastName }}</h3>
                  <span v-if="user.username" class="text-xs text-brand/80 bg-brand-soft px-2 py-0.5 rounded-md">@{{ user.username }}</span>
                </div>
                <p class="text-sm text-text-secondary">{{ user.email }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs uppercase tracking-wider font-semibold text-text-muted">{{ user.role }}</span>
                  <AppBadge :variant="getStatusVariant(user.status)" size="sm">{{ user.status }}</AppBadge>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <AppButton variant="secondary" size="sm" class="flex-1 sm:flex-none" @click="resetPhoto(user.id)">
                <ImageOff class="h-4 w-4" />
                Reset
              </AppButton>
              <AppButton
                :variant="user.status === 'Banned' ? 'secondary' : 'danger'"
                size="sm"
                class="flex-1 sm:flex-none"
                @click="toggleBlock(user)"
              >
                <Ban class="h-4 w-4" />
                {{ user.status === 'Banned' ? 'Unblock' : 'Block' }}
              </AppButton>
              <RouterLink :to="`/admin/users/${user.id}`" class="inline-flex min-h-[44px] sm:min-h-0 items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 text-text-secondary hover:bg-surface-secondary hover:text-brand px-4 py-2.5 sm:px-3 sm:py-1.5 text-sm sm:text-xs">
                <ChevronRight class="h-4 w-4" />
              </RouterLink>
            </div>
          </div>
        </AppCard>

        <AppEmptyState v-if="users.length === 0" title="No users found" description="Try adjusting your search filters." />
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Ban, ImageOff, ChevronRight } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppBadge from '@/shared/ui/AppBadge.vue'
import AppEmptyState from '@/shared/ui/AppEmptyState.vue'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { adminUsersApi } from '@/shared/api/adminService'
import type { AdminUser } from '@/shared/api/adminService'

const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'success'
    case 'PENDING': return 'warning'
    case 'BANNED': return 'danger'
    default: return 'default'
  }
}

const users = ref<AdminUser[]>([])
const searchQuery = ref('')

const fetchUsers = async () => {
  try {
    const response = await adminUsersApi.getUsers(searchQuery.value)
    users.value = Array.isArray(response) ? response : (response as any).content || []
  } catch (e: any) {
    handleError(e)
    if (e.response?.status === 403) {
      toastStore.error('Access denied. Admin privileges required.')
    } else if (e.response?.status >= 500) {
      toastStore.error('Server error while loading users.')
    }
  }
}

const onSearch = useDebounceFn(() => {
  fetchUsers()
}, 300)

const resetPhoto = async (userId: number) => {
  try {
    await adminUsersApi.resetPhoto(userId)
    toastStore.success(`Photo reset for user ${userId}`)
    await fetchUsers()
  } catch (e: any) {
    handleError(e)
  }
}

const toggleBlock = async (user: AdminUser) => {
  try {
    const newStatus = user.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
    await adminUsersApi.toggleBlock(user.id, newStatus)

    if (newStatus === 'BANNED') {
      toastStore.warning(`User ${user.firstName} is now ${newStatus}`)
    } else {
      toastStore.success(`User ${user.firstName} is now ${newStatus}`)
    }
    await fetchUsers()
  } catch (e: any) {
    handleError(e)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

