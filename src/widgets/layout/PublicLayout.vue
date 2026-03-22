<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <RouterLink to="/" class="text-2xl font-bold tracking-tight text-slate-900">
          MentorHub
        </RouterLink>

        <nav class="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <RouterLink to="/mentors" class="transition hover:text-slate-900">Менторы</RouterLink>
          <RouterLink to="/login" class="transition hover:text-slate-900">Войти</RouterLink>
          <RouterLink
              to="/register"
              class="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:opacity-90"
          >
            Регистрация
          </RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>