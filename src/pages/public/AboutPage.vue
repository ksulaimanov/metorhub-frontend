<template>
  <PublicLayout>
    <section class="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      <div class="space-y-12">
        <!-- Header -->
        <div class="text-center">
          <p
              class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            О платформе
          </p>

          <h1 class="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            MentorHub — платформа ментора и студента
          </h1>

          <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate-600">
            Мы создали удобное пространство, где опытные менторы делятся знаниями, а студенты достигают своих целей
            обучения в удобном формате.
          </p>
        </div>

        <!-- Features -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <svg class="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Быстрая поиск</h3>
            </div>
            <p class="mt-3 text-slate-600">
              Найдите идеального ментора по специализации, опыту и рейтингу за считанные секунды.
            </p>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <svg class="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Прозрачность</h3>
            </div>
            <p class="mt-3 text-slate-600">
              Профили, рейтинги, отзывы и стоимость — всё открыто. Никаких скрытых платежей.
            </p>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <svg class="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Удобный формат</h3>
            </div>
            <p class="mt-3 text-slate-600">
              Онлайн, офлайн или гибридно — выбирайте формат, который подходит именно вам.
            </p>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <svg class="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Гибкое расписание</h3>
            </div>
            <p class="mt-3 text-slate-600">
              Менторы сами устанавливают доступные слоты. Вы выбираете удобное время.
            </p>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <svg class="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Безопасность</h3>
            </div>
            <p class="mt-3 text-slate-600">
              Верификация менторов, защита данных и честная система оценок и отзывов.
            </p>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <svg class="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Поддержка</h3>
            </div>
            <p class="mt-3 text-slate-600">
              Команда всегда готова помочь с вопросами и проблемами.
            </p>
          </div>
        </div>

        <!-- CTA -->
        <div class="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-center text-white">
          <h2 class="text-3xl font-bold">Готовы начать?</h2>
          <p class="mt-3 text-slate-300">
            Присоединитесь к сотням студентов и менторов, которые уже развивают свои навыки на MentorHub.
          </p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
            <RouterLink
                to="/mentors"
                class="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:opacity-90"
            >
              Найти ментора
            </RouterLink>

            <RouterLink
                to="/register"
                class="rounded-2xl border border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Зарегистрироваться
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
</script>

