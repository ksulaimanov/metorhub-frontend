<template>
  <PublicLayout>
    <!-- ─── Hero intro ─── -->
    <section class="bg-gradient-to-b from-brand-soft/30 to-bg">
      <div class="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:pt-14">
        <p class="inline-flex rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand">
          {{ t('mentorDirectory.heroBadge') }}
        </p>
        <h1 class="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-text-primary sm:text-4xl">
          {{ t('mentorDirectory.title') }}
        </h1>
        <p class="mt-3 max-w-lg text-base leading-7 text-text-secondary">
          {{ t('mentorDirectory.description') }}
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <!-- ─── Filters ─── -->
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border-brand/80 md:p-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-text-primary">{{ t('mentorDirectory.searchLabel') }}</label>
            <input
                v-model="query"
                type="text"
                :placeholder="t('mentorDirectory.searchPlaceholder')"
                class="w-full rounded-xl border border-border-brand bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-text-primary">{{ t('mentorDirectory.cityLabel') }}</label>
            <input
                v-model="city"
                type="text"
                :placeholder="t('mentorDirectory.cityPlaceholder')"
                class="w-full rounded-xl border border-border-brand bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-text-primary">{{ t('mentorDirectory.sortLabel') }}</label>
            <select
                v-model="sortBy"
                class="w-full rounded-xl border border-border-brand bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">{{ t('mentorDirectory.sortDefault') }}</option>
              <option value="ratingDesc">{{ t('mentorDirectory.sortRating') }}</option>
              <option value="priceAsc">{{ t('mentorDirectory.sortPriceAsc') }}</option>
              <option value="priceDesc">{{ t('mentorDirectory.sortPriceDesc') }}</option>
              <option value="experienceDesc">{{ t('mentorDirectory.sortExperience') }}</option>
              <option value="newest">{{ t('mentorDirectory.sortNewest') }}</option>
            </select>
          </div>
        </div>

        <!-- Format filter chips -->
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <label
              :class="[
                'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition',
                online ? 'bg-brand-soft text-brand ring-brand/30' : 'bg-white text-text-secondary ring-border-brand hover:bg-brand-soft/50',
              ]"
          >
            <input v-model="online" type="checkbox" class="sr-only" />
            {{ t('common.lessonFormat.ONLINE') }}
          </label>

          <label
              :class="[
                'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition',
                offline ? 'bg-brand-soft text-brand ring-brand/30' : 'bg-white text-text-secondary ring-border-brand hover:bg-brand-soft/50',
              ]"
          >
            <input v-model="offline" type="checkbox" class="sr-only" />
            {{ t('common.lessonFormat.OFFLINE') }}
          </label>

          <label
              :class="[
                'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition',
                hybrid ? 'bg-brand-soft text-brand ring-brand/30' : 'bg-white text-text-secondary ring-border-brand hover:bg-brand-soft/50',
              ]"
          >
            <input v-model="hybrid" type="checkbox" class="sr-only" />
            {{ t('common.lessonFormat.HYBRID') }}
          </label>

          <button
              v-if="hasActiveFilters"
              type="button"
              class="rounded-full border border-border-brand px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-brand-soft/50"
              @click="resetFilters"
          >
            {{ t('mentorDirectory.resetFilters') }}
          </button>
        </div>
      </div>

      <!-- ─── Results meta ─── -->
      <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p v-if="!loading" class="text-sm text-text-secondary">
          {{ t('mentorDirectory.foundMentors') }}:
          <span class="font-semibold text-text-primary">{{ totalElements }}</span>
        </p>
        <p class="text-sm text-text-secondary">{{ t('mentorDirectory.foundHint') }}</p>
      </div>

      <!-- ─── Content ─── -->
      <div class="mt-6">
        <!-- Skeleton loading -->
        <div v-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-border-brand/80">
            <div class="flex items-start gap-3.5">
              <div class="h-14 w-14 rounded-full bg-brand-soft" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-28 rounded bg-brand-soft" />
                <div class="h-3 w-36 rounded bg-brand-soft/60" />
              </div>
            </div>
            <div class="mt-4 h-3 w-full rounded bg-brand-soft/40" />
            <div class="mt-2 h-3 w-2/3 rounded bg-brand-soft/40" />
            <div class="mt-4 flex gap-2">
              <div class="h-6 w-16 rounded-full bg-brand-soft/50" />
              <div class="h-6 w-14 rounded-full bg-brand-soft/50" />
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-surface-secondary p-3">
              <div class="space-y-1">
                <div class="h-2.5 w-10 rounded bg-brand-soft/40" />
                <div class="h-3.5 w-16 rounded bg-brand-soft" />
              </div>
              <div class="space-y-1">
                <div class="h-2.5 w-10 rounded bg-brand-soft/40" />
                <div class="h-3.5 w-20 rounded bg-brand-soft" />
              </div>
              <div class="space-y-1">
                <div class="h-2.5 w-10 rounded bg-brand-soft/40" />
                <div class="h-3.5 w-14 rounded bg-brand-soft" />
              </div>
              <div class="space-y-1">
                <div class="h-2.5 w-10 rounded bg-brand-soft/40" />
                <div class="h-3.5 w-8 rounded bg-brand-soft" />
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <AppErrorState
            v-else-if="error"
            :title="t('mentorDirectory.loadError')"
            :description="error"
        />

        <!-- Empty -->
        <div v-else-if="mentors.length === 0" class="rounded-2xl bg-white p-10 text-center ring-1 ring-border-brand/80">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
            <Search class="h-6 w-6 text-brand" />
          </div>
          <h3 class="mt-4 text-lg font-semibold text-text-primary">{{ t('mentorDirectory.emptyTitle') }}</h3>
          <p class="mt-2 text-sm text-text-secondary">{{ t('mentorDirectory.emptyDesc') }}</p>
          <button
              v-if="hasActiveFilters"
              type="button"
              class="mt-5 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
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
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search } from 'lucide-vue-next'
import { getPublicMentors } from '../../shared/api/mentorPublicApi'
import type { MentorDirectoryItem } from '../../shared/types/mentor'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import MentorCard from '../../features/mentor-directory/MentorCard.vue'

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