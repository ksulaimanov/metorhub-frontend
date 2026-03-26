<template>
  <PublicLayout>
    <section class="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p
              class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            MentorHub — платформа поиска менторов и записи на занятия
          </p>

          <h1 class="mt-5 max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Найдите ментора под свою цель и начните обучение в удобном формате
          </h1>

          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Выбирайте менторов по специализации, рейтингу, стоимости и формату занятий.
            Онлайн, офлайн или гибридно — так, как удобно именно вам.
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
              Зарегистрироваться
            </RouterLink>

            <RouterLink
                to="/mentor/apply"
                class="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Стать ментором
            </RouterLink>
          </div>

          <div class="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p class="text-2xl font-bold text-slate-900">Удобно</p>
              <p class="mt-1 text-sm text-slate-600">
                Быстрый поиск, фильтры и запись на занятия
              </p>
            </div>

            <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p class="text-2xl font-bold text-slate-900">Прозрачно</p>
              <p class="mt-1 text-sm text-slate-600">
                Профили, рейтинг, формат работы и стоимость
              </p>
            </div>

            <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p class="text-2xl font-bold text-slate-900">Гибко</p>
              <p class="mt-1 text-sm text-slate-600">
                Онлайн, офлайн и гибридный формат обучения
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-4">
          <AppCard>
            <h3 class="text-lg font-semibold text-slate-900">Проверенные профили</h3>
            <p class="mt-2 text-slate-600">
              Смотрите рейтинг, опыт, специализацию, форматы занятий и отзывы учеников.
            </p>
          </AppCard>

          <AppCard>
            <h3 class="text-lg font-semibold text-slate-900">Удобная запись</h3>
            <p class="mt-2 text-slate-600">
              Выбирайте свободный слот, подходящее время и записывайтесь на занятие в пару кликов.
            </p>
          </AppCard>

          <AppCard>
            <h3 class="text-lg font-semibold text-slate-900">Формат под вас</h3>
            <p class="mt-2 text-slate-600">
              Поддержка онлайн-ссылок, офлайн-адресов и гибридного формата обучения.
            </p>
          </AppCard>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 pb-6">
      <div class="rounded-[2rem] bg-slate-900 px-6 py-8 text-white md:px-8 md:py-10">
        <div class="grid gap-6 md:grid-cols-3">
          <div>
            <p class="text-sm uppercase tracking-wide text-slate-300">Шаг 1</p>
            <h3 class="mt-2 text-xl font-semibold">Выберите ментора</h3>
            <p class="mt-2 text-sm leading-7 text-slate-300">
              Найдите наставника по специализации, стоимости, рейтингу и формату занятий.
            </p>
          </div>

          <div>
            <p class="text-sm uppercase tracking-wide text-slate-300">Шаг 2</p>
            <h3 class="mt-2 text-xl font-semibold">Выберите время</h3>
            <p class="mt-2 text-sm leading-7 text-slate-300">
              Посмотрите свободные слоты ментора и забронируйте удобное время.
            </p>
          </div>

          <div>
            <p class="text-sm uppercase tracking-wide text-slate-300">Шаг 3</p>
            <h3 class="mt-2 text-xl font-semibold">Начните обучение</h3>
            <p class="mt-2 text-sm leading-7 text-slate-300">
              Подключайтесь онлайн или приходите офлайн, в зависимости от формата занятий.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div class="mb-8 max-w-2xl">
        <h2 class="text-3xl font-bold text-slate-900">Почему MentorHub</h2>
        <p class="mt-3 text-slate-600">
          Платформа помогает ученикам быстро находить наставников, а менторам — удобно управлять профилем,
          слотами и записями.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AppCard>
          <h3 class="text-lg font-semibold text-slate-900">Каталог менторов</h3>
          <p class="mt-2 text-sm leading-7 text-slate-600">
            Удобный список менторов с фильтрами, карточками и переходом в подробный профиль.
          </p>
        </AppCard>

        <AppCard>
          <h3 class="text-lg font-semibold text-slate-900">Профили с доверием</h3>
          <p class="mt-2 text-sm leading-7 text-slate-600">
            Опыт, рейтинг, форматы занятий, специализация и полезная информация для выбора.
          </p>
        </AppCard>

        <AppCard>
          <h3 class="text-lg font-semibold text-slate-900">Бронирование занятий</h3>
          <p class="mt-2 text-sm leading-7 text-slate-600">
            Ученик выбирает слот, а ментор подтверждает, отменяет или завершает занятие.
          </p>
        </AppCard>

        <AppCard>
          <h3 class="text-lg font-semibold text-slate-900">Личный кабинет</h3>
          <p class="mt-2 text-sm leading-7 text-slate-600">
            Отдельные private pages для ученика и ментора с нужными рабочими сценариями.
          </p>
        </AppCard>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
</script>