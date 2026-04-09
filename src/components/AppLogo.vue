<template>
  <div class="app-logo">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Jaidem-style ornamented icon, purple fill -->
      <circle cx="24" cy="24" r="22" fill="#7B3FE4" stroke="#5B3FD3" stroke-width="2"/>
      <path d="M24 12C18 12 14 18 14 24C14 30 18 36 24 36C30 36 34 30 34 24C34 18 30 12 24 12ZM24 32C20.6863 32 18 28.4183 18 24C18 19.5817 20.6863 16 24 16C27.3137 16 30 19.5817 30 24C30 28.4183 27.3137 32 24 32Z" fill="#fff"/>
      <!-- Ornament pattern -->
      <path d="M24 8L26 14H32L27 18L29 24L24 20L19 24L21 18L16 14H22L24 8Z" fill="#fff" opacity="0.18"/>
    </svg>
    <span class="app-logo__text">Jaidem</span>
  </div>
</template>

<script setup lang="ts">
// No logic needed
</script>

<style scoped>
.app-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Montserrat', 'Inter', system-ui, sans-serif;
}
.app-logo__text {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--color-brand, #7B3FE4);
  font-family: 'Montserrat', 'Inter', system-ui, sans-serif;
}
</style>
