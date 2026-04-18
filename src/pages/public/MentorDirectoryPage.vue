<template>
  <PublicLayout>
    <div class="relative bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen text-text-primary pb-10">
      <KyrgyzOrnamentPattern :opacity="0.05" :scale="1.5" class="fixed inset-0 z-0 pointer-events-none mix-blend-overlay" />

      <!-- ”€”€”€ Hero intro ”€”€”€ -->
      <AuroraBackground :showRadialGradient="true" aurora-opacity="opacity-10 dark:opacity-20" class="relative !bg-transparent h-auto overflow-hidden">
        <div class="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:pt-14">
          <p class="inline-flex rounded-full bg-brand-soft/20 px-4 py-1.5 text-sm font-medium text-brand-soft border border-brand/30">
            {{ t('mentorDirectory.heroBadge') }}
          </p>
          <h1 class="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-text-primary sm:text-4xl">
            {{ t('mentorDirectory.title') }}
          </h1>
          <p class="mt-3 max-w-lg text-base leading-7 text-text-secondary">
            {{ t('mentorDirectory.description') }}
          </p>
        </div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[1px] w-full max-w-6xl bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
      </AuroraBackground>

      <section class="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 mt-8">
        <!-- ”€”€”€ Filters ”€”€”€ -->
        <div class="rounded-2xl bg-surface backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border-brand md:p-6">
          <div class="grid gap-4 md:grid-cols-4">
            <div class="md:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-text-secondary">{{ t('mentorDirectory.searchLabel') }}</label>
              <input
                  v-model="query"
                  type="text"
                  :placeholder="t('mentorDirectory.searchPlaceholder')"
                  class="w-full rounded-xl border border-border-brand bg-black/20 text-text-primary px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-brand/50 focus:bg-surface focus:ring-2 focus:ring-brand/30 focus:shadow-[0_0_15px_rgba(108,92,231,0.3)]"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-text-secondary">{{ t('mentorDirectory.cityLabel') }}</label>
              <input
                  v-model="city"
                  type="text"
                  :placeholder="t('mentorDirectory.cityPlaceholder')"
                  class="w-full rounded-xl border border-border-brand bg-black/20 text-text-primary px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-brand/50 focus:bg-surface focus:ring-2 focus:ring-brand/30 focus:shadow-[0_0_15px_rgba(108,92,231,0.3)]"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-text-secondary">{{ t('mentorDirectory.sortLabel') }}</label>
              <select
                  v-model="sortBy"
                  class="w-full rounded-xl border border-border-brand bg-black/20 text-text-primary px-4 py-2.5 text-sm outline-none transition focus:border-brand/50 focus:bg-surface focus:ring-2 focus:ring-brand/30 focus:shadow-[0_0_15px_rgba(108,92,231,0.3)]"
              >
                <option value="" class="text-black">{{ t('mentorDirectory.sortDefault') }}</option>
                <option value="ratingDesc" class="text-black">{{ t('mentorDirectory.sortRating') }}</option>
                <option value="priceAsc" class="text-black">{{ t('mentorDirectory.sortPriceAsc') }}</option>
                <option value="priceDesc" class="text-black">{{ t('mentorDirectory.sortPriceDesc') }}</option>
                <option value="experienceDesc" class="text-black">{{ t('mentorDirectory.sortExperience') }}</option>
                <option value="newest" class="text-black">{{ t('mentorDirectory.sortNewest') }}</option>
              </select>
            </div>
          </div>

          <!-- Format filter chips -->
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <label
                :class=" [
                  'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all',
                  online ? 'bg-brand/20 text-brand-soft border-brand/50 shadow-[0_0_10px_rgba(108,92,231,0.3)]' : 'bg-black/20 text-text-secondary border-border-brand hover:bg-surface',
                ]"
            >
              <input v-model="online" type="checkbox" class="sr-only" />
              {{ t('common.lessonFormat.ONLINE') }}
            </label>

            <label
                :class=" [
                  'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all',
                  offline ? 'bg-brand/20 text-brand-soft border-brand/50 shadow-[0_0_10px_rgba(108,92,231,0.3)]' : 'bg-black/20 text-text-secondary border-border-brand hover:bg-surface',
                ]"
            >
              <input v-model="offline" type="checkbox" class="sr-only" />
              {{ t('common.lessonFormat.OFFLINE') }}
            </label>

            <label
                :class=" [
                  'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all',
                  hybrid ? 'bg-brand/20 text-brand-soft border-brand/50 shadow-[0_0_10px_rgba(108,92,231,0.3)]' : 'bg-black/20 text-text-secondary border-border-brand hover:bg-surface',
                ]"
            >
              <input v-model="hybrid" type="checkbox" class="sr-only" />
              {{ t('common.lessonFormat.HYBRID') }}
            </label>

            <button
                v-if="hasActiveFilters"
                type="button"
                class="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
                @click="resetFilters"
            >
              {{ t('mentorDirectory.resetFilters') }}
            </button>
          </div>
        </div>

        <!-- ”€”€”€ Results meta ”€”€”€ -->
        <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p v-if="!loading" class="text-sm text-text-secondary">
            {{ t('mentorDirectory.foundMentors') }}:
            <span class="font-semibold text-text-primary">{{ totalElements }}</span>
          </p>
          <p class="text-sm text-text-muted">{{ t('mentorDirectory.foundHint') }}</p>
        </div>

        <!-- ”€”€”€ Content ”€”€”€ -->
        <div class="mt-6">
          <div class="absolute -z-10 top-20 left-1/4 w-96 h-96 bg-brand/20 blur-[120px] rounded-full pointer-events-none" />
          <div class="absolute -z-10 top-40 right-1/4 w-96 h-96 bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

          <!-- Skeleton loading -->
          <div v-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-surface p-5 border border-border-brand">
              <div class="flex items-start gap-3.5">
                <div class="h-14 w-14 rounded-full bg-surface-secondary" />
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-28 rounded bg-surface-secondary" />
                  <div class="h-3 w-36 rounded bg-surface-secondary" />
                </div>
              </div>
              <div class="mt-4 h-3 w-full rounded bg-surface-secondary" />
              <div class="mt-2 h-3 w-2/3 rounded bg-surface-secondary" />
              <div class="mt-4 flex gap-2">
                <div class="h-6 w-16 rounded-full bg-surface-secondary" />
                <div class="h-6 w-14 rounded-full bg-surface-secondary" />
              </div>
              <div class="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-black/20 p-3 border border-border-subtle">
                <div class="space-y-1">
                  <div class="h-2.5 w-10 rounded bg-surface-secondary" />
                  <div class="h-3.5 w-16 rounded bg-surface-secondary" />
                </div>
                <div class="space-y-1">
                  <div class="h-2.5 w-10 rounded bg-surface-secondary" />
                  <div class="h-3.5 w-20 rounded bg-surface-secondary" />
                </div>
                <div class="space-y-1">
                  <div class="h-2.5 w-10 rounded bg-surface-secondary" />
                  <div class="h-3.5 w-14 rounded bg-surface-secondary" />
                </div>
                <div class="space-y-1">
                  <div class="h-2.5 w-10 rounded bg-surface-secondary" />
                  <div class="h-3.5 w-8 rounded bg-surface-secondary" />
                </div>
              </div>
            </div>
          </div>

          <!-- Error -->
          <AppErrorState
              v-else-if="error"
              :title="t('mentorDirectory.loadError')"
              :description="error"
              class="!bg-red-500/10 !border-red-500/20"
          />

          <!-- Empty -->
          <div v-else-if="mentors.length === 0" class="rounded-2xl bg-surface backdrop-blur-xl p-10 text-center border border-border-brand">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 shadow-[0_0_20px_rgba(108,92,231,0.4)]">
              <Search class="h-6 w-6 text-brand-soft" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-text-primary">{{ t('mentorDirectory.emptyTitle') }}</h3>
            <p class="mt-2 text-sm text-text-muted">{{ t('mentorDirectory.emptyDesc') }}</p>
            <button
                v-if="hasActiveFilters"
                type="button"
                class="mt-5 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-text-primary shadow-[0_0_20px_rgba(108,92,231,0.4)] transition hover:bg-brand-hover hover:-translate-y-0.5"
                @click="resetFilters"
            >
              {{ t('mentorDirectory.resetFilters') }}
            </button>
          </div>

          <!-- Mentor cards -->
          <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <MentorCard
                v-for="mentor in mentors"
                :key="mentor.id"
                :mentor="mentor"
            />
          </div>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search } from 'lucide-vue-next'
import { getPublicMentors } from '@/shared/api/mentorPublicApi'
import type { MentorDirectoryItem } from '@/shared/types/mentor'
import PublicLayout from '@/widgets/layout/PublicLayout.vue'
import AuroraBackground from '@/shared/ui/AuroraBackground.vue'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import MentorCard from '@/features/mentor-directory/MentorCard.vue'

const { t } = useI18n()

const mentors = ref<MentorDirectoryItem[]>([])
const totalElements = ref(0)
const loading = ref(false)
const error = ref('')

const query = ref('')
const debouncedQuery = ref('')
const city = ref('')
const sortBy = ref('')
const online = ref(false)
const offline = ref(false)
const hybrid = ref(false)

let searchTimer: number | undefined

const hasActiveFilters = computed(() =>
    !!debouncedQuery.value || !!city.value || !!sortBy.value || online.value || offline.value || hybrid.value,
)

const resetFilters = () => {
  query.value = ''
  debouncedQuery.value = ''
  city.value = ''
  sortBy.value = ''
  online.value = false
  offline.value = false
  hybrid.value = false
}

const loadMentors = async () => {
  loading.value = true
  error.value = ''

  try {
    const page = await getPublicMentors({
      query: debouncedQuery.value || undefined,
      city: city.value || undefined,
      sortBy: sortBy.value || undefined,
      online: online.value || undefined,
      offline: offline.value || undefined,
      hybrid: hybrid.value || undefined,
      size: 50,
    })
    mentors.value = page.content
    totalElements.value = page.totalElements
  } catch (e) {
    console.error(e)
    error.value = t('mentorDirectory.pageLoadError')
  } finally {
    loading.value = false
  }
}

onMounted(loadMentors)

watch(query, (value) => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    debouncedQuery.value = value
  }, 350)
})

watch([debouncedQuery, city, sortBy, online, offline, hybrid], () => {
  loadMentors()
})
</script>
