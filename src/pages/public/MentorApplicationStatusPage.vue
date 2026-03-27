<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-start px-4 py-10 sm:items-center sm:px-6 lg:py-16">
      <div class="mx-auto w-full max-w-lg">
        <div class="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80 sm:p-8">
          <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('mentorApplication.statusPageTitle') }}</h1>
          <p class="mt-2 text-sm text-text-secondary">
            {{ t('mentorApplication.statusPageSubtitle') }}
          </p>

          <div class="mt-8">
            <MentorApplicationStatus />
          </div>
        </div>

        <p class="mt-5 text-center text-sm text-text-secondary">
          <RouterLink to="/mentor/apply" class="font-semibold text-brand transition hover:text-brand-hover">
            {{ t('mentorApplication.submit') }}
          </RouterLink>
        </p>
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

