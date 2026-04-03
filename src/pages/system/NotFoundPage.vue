<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="flex w-full flex-col items-center justify-center text-center">
        <p class="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
          {{ t('notFound.badge') }}
        </p>

        <h1 class="mt-6 text-5xl font-bold tracking-tight text-text-primary md:text-6xl">
          {{ t('notFound.title') }}
        </h1>

        <p class="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">
          {{ t('notFound.description') }}
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <RouterLink
              to="/"
              class="rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-hover"
          >
            {{ t('notFound.goHome') }}
          </RouterLink>

          <RouterLink
              to="/mentors"
              class="rounded-2xl border border-border-brand bg-white px-6 py-3 text-base font-semibold text-text-primary transition hover:bg-brand-soft"
          >
            {{ t('notFound.goMentors') }}
          </RouterLink>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'

const { t } = useI18n()
</script>
