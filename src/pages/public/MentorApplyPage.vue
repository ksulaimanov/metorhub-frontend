<template>
  <AuthSplitShell
      :badge="t('mentorApplication.heroBadge')"
      :title="t('mentorApplication.heroTitle')"
      :subtitle="t('mentorApplication.heroSubtitle')"
  >
    <!-- Left info cards -->
    <template #cards>
      <FeatureCard :title="t('mentorApplication.heroCard1Title')" :description="t('mentorApplication.heroCard1Desc')" />
      <FeatureCard :title="t('mentorApplication.heroCard2Title')" :description="t('mentorApplication.heroCard2Desc')" />
    </template>

    <!-- Authenticated: show form -->
    <template v-if="isAuthenticated">
      <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('mentorApplication.pageTitle') }}</h1>
      <p class="mt-2 text-sm text-text-secondary">{{ t('mentorApplication.pageSubtitle') }}</p>

      <div class="mt-8">
        <MentorApplyForm />
      </div>
    </template>

    <!-- Guest: show teaser + gate modal -->
    <template v-else>
      <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('mentorApplication.pageTitle') }}</h1>
      <p class="mt-2 text-sm text-text-secondary">{{ t('mentorGate.pageHint') }}</p>

      <div class="mt-8 space-y-5">
        <div class="rounded-2xl border border-border-brand bg-surface-secondary p-6 text-center">
          <GraduationCap class="mx-auto h-10 w-10 text-brand" />
          <p class="mt-3 text-sm font-medium text-text-primary">{{ t('mentorGate.teaserTitle') }}</p>
          <p class="mt-1 text-xs text-text-secondary">{{ t('mentorGate.teaserDesc') }}</p>
          <button
              type="button"
              class="mt-5 inline-flex rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.98]"
              @click="showGate = true"
          >
            {{ t('mentorGate.startAction') }}
          </button>
        </div>
      </div>

      <MentorApplyGate v-model="showGate" />
    </template>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GraduationCap } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import AuthSplitShell from '../../shared/ui/AuthSplitShell.vue'
import FeatureCard from '../../shared/ui/FeatureCard.vue'
import MentorApplyForm from '../../features/mentor-application/MentorApplyForm.vue'
import MentorApplyGate from '../../features/mentor-application/MentorApplyGate.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showGate = ref(false)

// Auto-show gate modal for guests after a brief moment
onMounted(() => {
  if (!isAuthenticated.value) {
    setTimeout(() => { showGate.value = true }, 600)
  }
})
</script>
