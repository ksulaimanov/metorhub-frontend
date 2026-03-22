<template>
  <PublicLayout>
    <section class="mx-auto max-w-7xl px-6 py-16">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="mb-4 inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Платформа для обучения с наставниками
          </p>

          <h1 class="max-w-2xl text-5xl font-bold leading-tight text-slate-900">
            Найдите ментора под вашу цель и учитесь в удобном формате
          </h1>

          <p class="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Выбирайте менторов по специализации, рейтингу, формату занятий и стоимости.
            Онлайн, офлайн или гибридный формат — так, как удобно именно вам.
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            <RouterLink
                to="/mentors"
                class="rounded-2xl bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
            >
              Найти ментора
            </RouterLink>

            <RouterLink
                to="/register"
                class="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Стать участником
            </RouterLink>
          </div>
        </div>

        <div class="grid gap-4">
          <AppCard>
            <h3 class="text-lg font-semibold">Проверенные профили</h3>
            <p class="mt-2 text-slate-600">
              Смотрите рейтинг, опыт, специализацию, форматы занятий и отзывы учеников.
            </p>
          </AppCard>

          <AppCard>
            <h3 class="text-lg font-semibold">Удобная запись</h3>
            <p class="mt-2 text-slate-600">
              Выбирайте свободный слот, подходящее время и записывайтесь на занятие в пару кликов.
            </p>
          </AppCard>

          <AppCard>
            <h3 class="text-lg font-semibold">Онлайн и офлайн</h3>
            <p class="mt-2 text-slate-600">
              Поддержка онлайн-ссылок, офлайн-адресов и гибридного формата обучения.
            </p>
          </AppCard>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
</script>