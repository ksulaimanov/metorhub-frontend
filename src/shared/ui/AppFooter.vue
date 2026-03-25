<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-6 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Brand -->
        <div>
          <h3 class="text-lg font-bold text-slate-900">MentorHub</h3>
          <p class="mt-2 text-sm text-slate-600">
            Платформа для менторов и студентов
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-sm font-semibold text-slate-900">Платформа</h4>
          <ul class="mt-4 space-y-2">
            <li>
              <RouterLink to="/about" class="text-sm text-slate-600 transition hover:text-slate-900">
                О платформе
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/mentors" class="text-sm text-slate-600 transition hover:text-slate-900">
                Менторы
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Auth -->
        <div>
          <h4 class="text-sm font-semibold text-slate-900">Аккаунт</h4>
          <ul class="mt-4 space-y-2">
            <li>
              <RouterLink to="/login" class="text-sm text-slate-600 transition hover:text-slate-900">
                Войти
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/register" class="text-sm text-slate-600 transition hover:text-slate-900">
                Регистрация
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-sm font-semibold text-slate-900">Прочее</h4>
          <ul class="mt-4 space-y-2">
            <li>
              <a href="#" class="text-sm text-slate-600 transition hover:text-slate-900">
                Политика конфиденциальности
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-slate-600 transition hover:text-slate-900">
                Условия использования
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="mt-8 border-t border-slate-200 pt-8">
        <p class="text-center text-sm text-slate-600">
          © 2024 MentorHub. Все права защищены.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

