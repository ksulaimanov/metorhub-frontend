<template>
  <!--
    AppResponsiveImage — reusable <picture> component with:
    • AVIF → WebP → JPEG format fallback
    • Art-direction via separate desktop/mobile sources
    • CLS-safe rendering via explicit width/height + aspect-ratio
    • Configurable loading/fetchpriority for LCP optimization
  -->
  <picture>
    <!-- ─── Desktop sources (≥ 768px) ─── -->
    <template v-if="desktopAvif">
      <source :media="mediaDesktop" type="image/avif" :srcset="desktopAvif" />
    </template>
    <template v-if="desktopWebp">
      <source :media="mediaDesktop" type="image/webp" :srcset="desktopWebp" />
    </template>
    <template v-if="desktopSrc">
      <source :media="mediaDesktop" :srcset="desktopSrc" />
    </template>

    <!-- ─── Mobile sources (< 768px, only if art-directed) ─── -->
    <template v-if="mobileAvif">
      <source :media="mediaMobile" type="image/avif" :srcset="mobileAvif" />
    </template>
    <template v-if="mobileWebp">
      <source :media="mediaMobile" type="image/webp" :srcset="mobileWebp" />
    </template>
    <template v-if="mobileSrc">
      <source :media="mediaMobile" :srcset="mobileSrc" />
    </template>

    <!-- ─── Fallback <img> ─── -->
    <img
      :src="fallbackSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :decoding="decoding"
      :class="imgClass"
      class="block max-w-full"
    />
  </picture>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props follow a convention where each viewport can provide up to 3 formats:
 *   AVIF (best compression) → WebP (wide support) → JPEG/PNG (universal fallback)
 *
 * For art direction:
 *   - desktopSrc / desktopWebp / desktopAvif — shown at ≥ 768px
 *   - mobileSrc / mobileWebp / mobileAvif   — shown at < 768px
 *
 * For single-source (no art direction):
 *   - Just pass desktopSrc / desktopWebp / desktopAvif — they apply at all sizes
 */
interface Props {
  /** Desktop JPEG/PNG fallback source (also used as universal fallback) */
  desktopSrc: string
  /** Desktop WebP source */
  desktopWebp?: string
  /** Desktop AVIF source */
  desktopAvif?: string

  /** Mobile JPEG/PNG source (art-directed variant) */
  mobileSrc?: string
  /** Mobile WebP source */
  mobileWebp?: string
  /** Mobile AVIF source */
  mobileAvif?: string

  /** Alt text — required for accessibility */
  alt: string
  /** Intrinsic width for CLS prevention */
  width?: number | string
  /** Intrinsic height for CLS prevention */
  height?: number | string
  /** Loading strategy: 'eager' for above-fold LCP, 'lazy' for everything else */
  loading?: 'eager' | 'lazy'
  /** Fetch priority hint for the browser */
  fetchpriority?: 'high' | 'low' | 'auto'
  /** Decoding hint */
  decoding?: 'async' | 'sync' | 'auto'
  /** CSS class(es) applied to the <img> element */
  imgClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  desktopWebp: undefined,
  desktopAvif: undefined,
  mobileSrc: undefined,
  mobileWebp: undefined,
  mobileAvif: undefined,
  width: undefined,
  height: undefined,
  loading: 'lazy',
  fetchpriority: 'auto',
  decoding: 'async',
  imgClass: '',
})

/** Whether art direction is enabled (mobile sources provided) */
const hasArtDirection = computed(
  () => !!(props.mobileSrc || props.mobileWebp || props.mobileAvif),
)

/** Media queries — only applied when art-directed */
const mediaDesktop = computed(() =>
  hasArtDirection.value ? '(min-width: 768px)' : undefined,
)
const mediaMobile = computed(() =>
  hasArtDirection.value ? '(max-width: 767px)' : undefined,
)

/** The <img> src uses mobile fallback if art-directed, otherwise desktop */
const fallbackSrc = computed(() => props.mobileSrc || props.desktopSrc)
</script>

