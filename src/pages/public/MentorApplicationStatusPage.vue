<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="w-full max-w-lg mx-auto">
        <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">{{ t('mentorApplication.statusPageTitle') }}</h1>
          <p class="mt-2 text-sm text-slate-600">
            {{ t('mentorApplication.statusPageSubtitle') }}
          </p>

          <div class="mt-8">
            <MentorApplicationStatus />
          </div>
        </div>

        <div class="mt-6 text-center text-sm text-slate-600">
          <RouterLink to="/mentor/apply" class="font-semibold text-slate-900 transition hover:opacity-70">
            {{ t('mentorApplication.submit') }}
          </RouterLink>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import MentorApplicationStatus from '../../features/mentor-application/MentorApplicationStatus.vue'

const { t } = useI18n()
</script>

