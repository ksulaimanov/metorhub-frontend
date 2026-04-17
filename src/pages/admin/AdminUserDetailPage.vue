<template>
  <PrivateLayout role="admin">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div class="mb-6 flex items-center gap-4">
        <RouterLink to="/admin/users" class="inline-flex min-h-[44px] sm:min-h-[36px] min-w-[44px] sm:min-w-[36px] items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] text-slate-400 hover:bg-white/5 backdrop-blur-xl-secondary hover:text-brand">
          <ArrowLeft class="h-5 w-5" />
        </RouterLink>
        <h1 class="text-2xl font-bold text-white">User Details</h1>
      </div>

      <div v-if="loading" class="animate-pulse flex flex-col gap-6">
        <div class="h-32 w-full bg-surface-secondary rounded-2xl" />
        <div class="h-48 w-full bg-surface-secondary rounded-2xl" />
      </div>
      <div v-else-if="user" class="space-y-6">
        <!-- User Profile Header -->
        <AppCard class="backdrop-blur-xl bg-surface/90 shadow-lg ring-1 ring-border-brand/40">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ProfileAvatar
              :src="user.avatarUrl"
              :first-name="user.firstName"
              :last-name="user.lastName"
              size="xl"
            />
            <div class="flex-1 space-y-2 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-3">
                <h2 class="text-2xl font-bold text-text-primary">{{ user.firstName }} {{ user.lastName }}</h2>
                <AppBadge :variant="getStatusVariant(user.status)">{{ user.status }}</AppBadge>
              </div>
              <p class="text-sm font-medium text-brand">@{{ user.username }} &middot; {{ user.role }}</p>
              <p class="text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-2">
                <Mail class="h-4 w-4" /> {{ user.email }}
              </p>
              <div class="flex items-center gap-3 pt-4 justify-center sm:justify-start">
                <AppButton variant="secondary" size="sm" @click="resetPhoto">Reset Photo</AppButton>
                <AppButton :variant="user.status === 'Banned' ? 'secondary' : 'danger'" size="sm" @click="toggleBlock">
                  {{ user.status === 'Banned' ? 'Unblock Account' : 'Block Account' }}
                </AppButton>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Stats Grid (Glassmorphism layout) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="rounded-2xl p-4 bg-brand-soft/50 ring-1 ring-border-brand backdrop-blur-sm text-center">
            <p class="text-sm font-medium text-text-secondary mb-1">Total Bookings</p>
            <p class="text-2xl font-extrabold text-brand">{{ user.bookingsCount }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-emerald-50/50 ring-1 ring-emerald-100 backdrop-blur-sm text-center">
            <p class="text-sm font-medium text-text-secondary mb-1">Completed</p>
            <p class="text-2xl font-extrabold text-emerald-600">{{ user.completedCount }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-amber-50/50 ring-1 ring-amber-100 backdrop-blur-sm text-center">
            <p class="text-sm font-medium text-text-secondary mb-1">Canceled</p>
            <p class="text-2xl font-extrabold text-amber-600">{{ user.canceledCount }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-surface/80 ring-1 ring-border-subtle backdrop-blur-sm text-center">
            <p class="text-sm font-medium text-text-secondary mb-1">Joined</p>
            <p class="text-sm font-semibold text-text-primary mt-2">{{ user.joinedAt }}</p>
          </div>
        </div>

        <!-- Applications History -->
        <AppCard class="backdrop-blur-xl bg-surface/90">
          <h3 class="text-lg font-bold text-text-primary border-b border-border-subtle pb-3 mb-4">Mentor Applications</h3>
          <div v-if="user.applications.length" class="space-y-4">
            <div v-for="app in user.applications" :key="app.id" class="flex justify-between items-center bg-surface-secondary/50 p-4 rounded-xl">
              <div>
                <p class="text-sm font-semibold text-text-primary">Application #{{ app.id }}</p>
                <p class="text-xs text-text-secondary mt-1">Submitted on {{ app.date }}</p>
              </div>
              <AppBadge :variant="app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'">
                {{ app.status }}
              </AppBadge>
            </div>
          </div>
          <div v-else class="text-center py-6 text-text-muted text-sm italic">
            No mentor applications found.
          </div>
        </AppCard>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeft, Mail } from 'lucide-vue-next'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppButton from '../../shared/ui/AppButton.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import ProfileAvatar from '../../shared/ui/ProfileAvatar.vue'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'

const props = defineProps<{
  id: string
}>()

const toastStore = useToastStore()
const loading = ref(true)

// Mock detail data
const user = ref<any>(null)

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active': return 'success'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'default'
  }
}

const toggleBlock = () => {
  if (!user.value) return
  user.value.status = user.value.status === 'Banned' ? 'Active' : 'Banned'
  if (user.value.status === 'Banned') {
    toastStore.warning('User status dynamically changed.')
  } else {
    toastStore.success('User status dynamically changed.')
  }
}

const resetPhoto = () => {
  toastStore.success('Avatar profile successfully reset.')
}

onMounted(() => {
  setTimeout(() => {
    user.value = {
      id: props.id,
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      avatarUrl: '',
      role: 'MENTOR',
      status: 'Active',
      joinedAt: 'May 14, 2026',
      bookingsCount: 24,
      completedCount: 20,
      canceledCount: 4,
      applications: [
        { id: 1045, date: 'May 15, 2026', status: 'APPROVED' }
      ]
    }
    loading.value = false
  }, 600)
})
</script>

