<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-start px-4 py-8 sm:px-6 lg:items-center lg:py-14">
      <div class="grid w-full gap-10 lg:grid-cols-2 lg:gap-16">

        <!-- Left: info panel (desktop only) -->
        <div class="hidden lg:block">
          <p
              v-if="badge"
              class="inline-flex rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand"
          >
            {{ badge }}
          </p>

          <h1 class="mt-5 max-w-lg text-4xl font-extrabold leading-tight text-text-primary xl:text-[2.75rem]">
            {{ title }}
          </h1>

          <p v-if="subtitle" class="mt-5 max-w-md text-base leading-7 text-text-secondary">
            {{ subtitle }}
          </p>

          <!-- Info cards -->
          <div v-if="$slots.cards" class="mt-8 grid max-w-lg gap-3">
            <slot name="cards" />
          </div>
        </div>

        <!-- Right: form surface -->
        <div class="w-full max-w-xl justify-self-center lg:justify-self-end">
          <div class="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80 sm:p-8">
            <slot />
          </div>

          <!-- Below-card links -->
          <div v-if="$slots.footer" class="mt-5">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '../../widgets/layout/PublicLayout.vue'

defineProps<{
  badge?: string
  title: string
  subtitle?: string
}>()
</script>

