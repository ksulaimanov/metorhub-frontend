<template>
  <AppModal
      v-model="showModal"
      :title="t('mentorGate.title')"
      :description="t('mentorGate.description')"
  >
    <template #icon>
      <GraduationCap class="h-7 w-7 text-brand" />
    </template>

    <!-- Benefits list -->
    <div class="space-y-3">
      <div class="flex items-start gap-3 rounded-xl bg-surface-secondary p-3.5">
        <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p class="text-sm text-text-secondary">{{ t('mentorGate.benefit1') }}</p>
      </div>
      <div class="flex items-start gap-3 rounded-xl bg-surface-secondary p-3.5">
        <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p class="text-sm text-text-secondary">{{ t('mentorGate.benefit2') }}</p>
      </div>
      <div class="flex items-start gap-3 rounded-xl bg-surface-secondary p-3.5">
        <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p class="text-sm text-text-secondary">{{ t('mentorGate.benefit3') }}</p>
      </div>
    </div>

    <template #actions>
      <div class="flex flex-col gap-3">
        <RouterLink
            :to="loginLink"
            class="flex w-full items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.98]"
        >
          {{ t('mentorGate.loginAction') }}
        </RouterLink>
        <RouterLink
            :to="registerLink"
            class="flex w-full items-center justify-center rounded-2xl border border-border-brand bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition hover:bg-brand-soft active:scale-[0.98]"
        >
          {{ t('mentorGate.registerAction') }}
        </RouterLink>
        <button
            type="button"
            class="text-sm font-medium text-text-secondary transition hover:text-text-primary"
            @click="showModal = false"
        >
          {{ t('mentorGate.cancelAction') }}
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GraduationCap, CheckCircle2 } from 'lucide-vue-next'
import AppModal from '../../shared/ui/AppModal.vue'

const { t } = useI18n()

const showModal = defineModel<boolean>({ required: true })

const REDIRECT_PATH = '/mentor/apply'

const loginLink = computed(() => ({
  path: '/login',
  query: { redirect: REDIRECT_PATH },
}))

const registerLink = computed(() => ({
  path: '/register',
  query: { redirect: REDIRECT_PATH },
}))
</script>

