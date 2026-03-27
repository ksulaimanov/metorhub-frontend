<template>
  <PrivateLayout>
    <div class="space-y-6">
      <!-- Back link -->
      <router-link
        :to="{ name: 'admin-mentor-applications' }"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition"
      >
        ← {{ t('common.back') }}
      </router-link>

      <!-- Loading -->
      <AppLoadingState v-if="loading" :text="t('common.loading')" />

      <!-- Error -->
      <AppErrorState
        v-else-if="error"
        :title="t('admin.applications.loadError')"
        :description="error"
      />

      <!-- Detail content -->
      <template v-else-if="application">
        <!-- Header row -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text-primary">{{ application.fullName }}</h1>
            <p class="mt-1 text-sm text-text-secondary">{{ application.email }}</p>
          </div>
          <StatusBadge :status="application.status" />
        </div>

        <!-- Applicant information -->
        <AppCard>
          <h2 class="mb-4 text-lg font-semibold text-text-primary">
            {{ t('admin.applications.sectionApplicant') }}
          </h2>
          <dl>
            <AdminDataRow :label="t('admin.applications.fieldName')" :value="application.fullName" />
            <AdminDataRow :label="t('admin.applications.fieldEmail')" :value="application.email" />
            <AdminDataRow :label="t('admin.applications.fieldPhone')" :value="application.phone" />
            <AdminDataRow :label="t('admin.applications.fieldSpecializations')">
              {{ application.specializations.join(', ') || '—' }}
            </AdminDataRow>
            <AdminDataRow :label="t('admin.applications.fieldExperience')">
              <p class="whitespace-pre-line">{{ application.experience }}</p>
            </AdminDataRow>
            <AdminDataRow :label="t('admin.applications.fieldMotivation')">
              <p class="whitespace-pre-line">{{ application.motivation }}</p>
            </AdminDataRow>
          </dl>
        </AppCard>

        <!-- Review metadata -->
        <AppCard>
          <h2 class="mb-4 text-lg font-semibold text-text-primary">
            {{ t('admin.applications.sectionReview') }}
          </h2>
          <dl>
            <AdminDataRow
              :label="t('admin.applications.fieldSubmittedAt')"
              :value="formatDateTimeForDisplay(application.submittedAt)"
            />
            <AdminDataRow
              v-if="application.reviewedAt"
              :label="t('admin.applications.fieldReviewedAt')"
              :value="formatDateTimeForDisplay(application.reviewedAt)"
            />
            <AdminDataRow
              v-if="application.reviewerEmail"
              :label="t('admin.applications.fieldReviewer')"
              :value="application.reviewerEmail"
            />
            <AdminDataRow
              v-if="application.adminComment"
              :label="t('admin.applications.fieldAdminComment')"
              :value="application.adminComment"
            />
            <AdminDataRow
              v-if="application.rejectionReason"
              :label="t('admin.applications.fieldRejectionReason')"
              :value="application.rejectionReason"
            />
          </dl>
        </AppCard>

        <!-- Actions (only for PENDING) -->
        <AppCard v-if="application.status === 'PENDING'">
          <h2 class="mb-4 text-lg font-semibold text-text-primary">
            {{ t('admin.applications.sectionActions') }}
          </h2>

          <!-- Reject reason input (shown when rejecting) -->
          <div v-if="showRejectForm" class="mb-4 space-y-3">
            <label class="block text-sm font-medium text-text-primary">
              {{ t('admin.applications.rejectReasonLabel') }}
            </label>
            <AppTextarea
              v-model="rejectionReason"
              :placeholder="t('admin.applications.rejectReasonPlaceholder')"
              rows="3"
            />
            <p v-if="rejectValidationError" class="text-sm text-red-600">
              {{ rejectValidationError }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <template v-if="!showRejectForm">
              <AppButton
                variant="primary"
                :loading="approving"
                :disabled="rejecting"
                @click="handleApprove"
              >
                {{ t('admin.applications.actionApprove') }}
              </AppButton>
              <AppButton
                variant="danger"
                :disabled="approving"
                @click="showRejectForm = true"
              >
                {{ t('admin.applications.actionReject') }}
              </AppButton>
            </template>

            <template v-else>
              <AppButton
                variant="danger"
                :loading="rejecting"
                :disabled="approving"
                @click="handleReject"
              >
                {{ t('admin.applications.actionConfirmReject') }}
              </AppButton>
              <AppButton
                variant="ghost"
                :disabled="rejecting"
                @click="cancelReject"
              >
                {{ t('common.cancel') }}
              </AppButton>
            </template>
          </div>
        </AppCard>
      </template>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppTextarea from '@/shared/ui/AppTextarea.vue'
import AppLoadingState from '@/shared/ui/AppLoadingState.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import StatusBadge from '@/shared/ui/StatusBadge.vue'
import AdminDataRow from '@/shared/ui/AdminDataRow.vue'
import {
  getAdminMentorApplicationById,
  approveApplication,
  rejectApplication,
} from '@/shared/api/adminMentorApplicationApi'
import { formatDateTimeForDisplay } from '@/shared/lib/dateFormatter'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useToast } from '@/shared/composables/useToast'
import type { AdminMentorApplicationDetail } from '@/shared/types/adminMentorApplication'

const props = defineProps<{
  id: string | number
}>()

const { t } = useI18n()
const { handleError } = useErrorHandler()
const toast = useToast()

const application = ref<AdminMentorApplicationDetail | null>(null)
const loading = ref(false)
const error = ref('')

const approving = ref(false)
const rejecting = ref(false)
const showRejectForm = ref(false)
const rejectionReason = ref('')
const rejectValidationError = ref('')

async function loadApplication() {
  loading.value = true
  error.value = ''

  try {
    application.value = await getAdminMentorApplicationById(Number(props.id))
  } catch (err: any) {
    error.value = err?.response?.data?.message || t('admin.applications.loadError')
  } finally {
    loading.value = false
  }
}

async function handleApprove() {
  approving.value = true
  try {
    await approveApplication(Number(props.id))
    toast.success(t('admin.applications.approveSuccess'))
    await loadApplication()
  } catch (err) {
    handleError(err, t('admin.applications.approveFailed'))
  } finally {
    approving.value = false
  }
}

async function handleReject() {
  rejectValidationError.value = ''

  if (!rejectionReason.value.trim()) {
    rejectValidationError.value = t('admin.applications.rejectReasonRequired')
    return
  }

  rejecting.value = true
  try {
    await rejectApplication(Number(props.id), {
      rejectionReason: rejectionReason.value.trim(),
    })
    toast.success(t('admin.applications.rejectSuccess'))
    showRejectForm.value = false
    rejectionReason.value = ''
    await loadApplication()
  } catch (err) {
    handleError(err, t('admin.applications.rejectFailed'))
  } finally {
    rejecting.value = false
  }
}

function cancelReject() {
  showRejectForm.value = false
  rejectionReason.value = ''
  rejectValidationError.value = ''
}

onMounted(loadApplication)
</script>

