<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="flex w-full flex-col items-center justify-center text-center">
        <p class="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
          Ошибка 404
        </p>

        <h1 class="mt-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Страница не найдена
        </h1>

        <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Похоже, страница, которую вы ищите, не существует или была удалена.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <RouterLink
              to="/"
              class="rounded-2xl bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
          >
            На главную
          </RouterLink>

          <RouterLink
              to="/mentors"
              class="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Каталог менторов
          </RouterLink>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
</script>

