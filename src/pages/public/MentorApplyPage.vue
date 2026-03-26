<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            {{ t('mentorApplication.heroBadge') }}
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            {{ t('mentorApplication.heroTitle') }}
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            {{ t('mentorApplication.heroSubtitle') }}
          </p>

          <div class="mt-8 grid max-w-xl gap-4">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('mentorApplication.heroCard1Title') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ t('mentorApplication.heroCard1Desc') }}
              </p>
            </div>

            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('mentorApplication.heroCard2Title') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ t('mentorApplication.heroCard2Desc') }}
              </p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-xl justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">{{ t('mentorApplication.pageTitle') }}</h1>
          <p class="mt-2 text-sm text-slate-600">
            {{ t('mentorApplication.pageSubtitle') }}
          </p>

          <div class="mt-8">
            <MentorApplyForm />
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import MentorApplyForm from '../../features/mentor-application/MentorApplyForm.vue'

const { t } = useI18n()
</script>

