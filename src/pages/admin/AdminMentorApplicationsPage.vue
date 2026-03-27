<template>
  <PrivateLayout>
    <div class="space-y-6">
      <!-- Header -->
      <AdminPageHeader
        :title="t('admin.applications.pageTitle')"
        :description="t('admin.applications.pageSubtitle')"
      />

      <!-- Filters -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AppSelect
          :model-value="statusFilter"
          @update:model-value="onStatusChange"
          class="max-w-[220px]"
        >
          <option value="">{{ t('admin.applications.filterAll') }}</option>
          <option value="PENDING">{{ t('admin.applications.statusPending') }}</option>
          <option value="APPROVED">{{ t('admin.applications.statusApproved') }}</option>
          <option value="REJECTED">{{ t('admin.applications.statusRejected') }}</option>
        </AppSelect>
      </div>

      <!-- Loading -->
      <AppLoadingState v-if="loading" :text="t('common.loading')" />

      <!-- Error -->
      <AppErrorState
        v-else-if="error"
        :title="t('admin.applications.loadError')"
        :description="error"
      />

      <!-- Empty -->
      <AppEmptyState
        v-else-if="items.length === 0"
        :title="t('admin.applications.emptyTitle')"
        :description="t('admin.applications.emptyDescription')"
      />

      <!-- Table (desktop) / Cards (mobile) -->
      <template v-else>
        <!-- Desktop table -->
        <div class="hidden md:block">
          <AppCard padding="none" radius="lg">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-border-brand text-xs uppercase tracking-wide text-text-secondary">
                  <th class="px-5 py-3 font-medium">{{ t('admin.applications.colName') }}</th>
                  <th class="px-5 py-3 font-medium">{{ t('admin.applications.colEmail') }}</th>
                  <th class="px-5 py-3 font-medium">{{ t('admin.applications.colSpecializations') }}</th>
                  <th class="px-5 py-3 font-medium">{{ t('admin.applications.colDate') }}</th>
                  <th class="px-5 py-3 font-medium">{{ t('admin.applications.colStatus') }}</th>
                  <th class="px-5 py-3 font-medium sr-only">{{ t('admin.applications.colActions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  class="border-b border-border-brand last:border-b-0 hover:bg-brand-soft/30 transition cursor-pointer"
                  @click="goToDetail(item.id)"
                >
                  <td class="px-5 py-4 font-medium text-text-primary">{{ item.fullName }}</td>
                  <td class="px-5 py-4 text-text-secondary">{{ item.email }}</td>
                  <td class="px-5 py-4 text-text-secondary">
                    {{ item.specializations.join(', ') || '—' }}
                  </td>
                  <td class="px-5 py-4 text-text-secondary whitespace-nowrap">
                    {{ formatDateTimeForDisplay(item.submittedAt, false) }}
                  </td>
                  <td class="px-5 py-4">
                    <StatusBadge :status="item.status" />
                  </td>
                  <td class="px-5 py-4 text-right">
                    <span class="text-brand text-xs font-medium">{{ t('admin.applications.view') }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </AppCard>
        </div>

        <!-- Mobile cards -->
        <div class="flex flex-col gap-3 md:hidden">
          <AppCard
            v-for="item in items"
            :key="item.id"
            padding="sm"
            radius="md"
            class="cursor-pointer transition hover:ring-brand/40"
            @click="goToDetail(item.id)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="font-medium text-text-primary truncate">{{ item.fullName }}</p>
                <p class="mt-0.5 text-xs text-text-secondary truncate">{{ item.email }}</p>
              </div>
              <StatusBadge :status="item.status" />
            </div>
            <div class="mt-2 flex flex-wrap gap-1 text-xs text-text-secondary">
              <span>{{ formatDateTimeForDisplay(item.submittedAt, false) }}</span>
              <span v-if="item.specializations.length">
                · {{ item.specializations.join(', ') }}
              </span>
            </div>
          </AppCard>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-2">
          <AppButton
            variant="ghost"
            size="sm"
            :disabled="currentPage === 0"
            @click="goToPage(currentPage - 1)"
          >
            {{ t('common.back') }}
          </AppButton>

          <span class="text-sm text-text-secondary">
            {{ currentPage + 1 }} / {{ totalPages }}
          </span>

          <AppButton
            variant="ghost"
            size="sm"
            :disabled="currentPage >= totalPages - 1"
            @click="goToPage(currentPage + 1)"
          >
            {{ t('common.next') }}
          </AppButton>
        </div>
      </template>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AdminPageHeader from '@/shared/ui/AdminPageHeader.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import AppSelect from '@/shared/ui/AppSelect.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppLoadingState from '@/shared/ui/AppLoadingState.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import AppEmptyState from '@/shared/ui/AppEmptyState.vue'
import StatusBadge from '@/shared/ui/StatusBadge.vue'
import { getAdminMentorApplications } from '@/shared/api/adminMentorApplicationApi'
import { formatDateTimeForDisplay } from '@/shared/lib/dateFormatter'
import type { AdminMentorApplicationListItem } from '@/shared/types/adminMentorApplication'
import type { MentorApplicationStatus } from '@/shared/types/mentorApplication'

const router = useRouter()
const { t } = useI18n()

const items = ref<AdminMentorApplicationListItem[]>([])
const loading = ref(false)
const error = ref('')
const statusFilter = ref<MentorApplicationStatus | ''>('')
const currentPage = ref(0)
const totalPages = ref(0)
const PAGE_SIZE = 10

async function loadApplications() {
  loading.value = true
  error.value = ''

  try {
    const page = await getAdminMentorApplications({
      status: statusFilter.value || undefined,
      page: currentPage.value,
      size: PAGE_SIZE,
    })
    items.value = page.content
    totalPages.value = page.totalPages
    currentPage.value = page.number
  } catch (err: any) {
    error.value = err?.response?.data?.message || t('admin.applications.loadError')
  } finally {
    loading.value = false
  }
}

function onStatusChange(val: string) {
  statusFilter.value = val as MentorApplicationStatus | ''
  currentPage.value = 0
  loadApplications()
}

function goToPage(page: number) {
  currentPage.value = page
  loadApplications()
}

function goToDetail(id: number) {
  router.push({ name: 'admin-mentor-application-detail', params: { id } })
}

onMounted(loadApplications)
</script>

