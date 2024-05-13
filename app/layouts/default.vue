<template>
  <AppHeader />
  <main class="relative py-12 min-h-[calc(100vh-var(--header-height))] flex-1">
    <slot />
  </main>
  <AppFooter />
</template>