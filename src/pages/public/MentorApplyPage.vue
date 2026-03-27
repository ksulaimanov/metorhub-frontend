<template>
  <AuthSplitShell
      :badge="t('mentorApplication.heroBadge')"
      :title="t('mentorApplication.heroTitle')"
      :subtitle="t('mentorApplication.heroSubtitle')"
  >
    <!-- Left info cards -->
    <template #cards>
      <FeatureCard :title="t('mentorApplication.heroCard1Title')" :description="t('mentorApplication.heroCard1Desc')" />
      <FeatureCard :title="t('mentorApplication.heroCard2Title')" :description="t('mentorApplication.heroCard2Desc')" />
    </template>

    <!-- Form -->
    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('mentorApplication.pageTitle') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">{{ t('mentorApplication.pageSubtitle') }}</p>

    <div class="mt-8">
      <MentorApplyForm />
    </div>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AuthSplitShell from '../../shared/ui/AuthSplitShell.vue'
import FeatureCard from '../../shared/ui/FeatureCard.vue'
import MentorApplyForm from '../../features/mentor-application/MentorApplyForm.vue'

const { t } = useI18n()
</script>

