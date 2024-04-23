<template>
  <AppHeader />
  <main class="grid place-items-center min-h-[calc(100vh-var(--header-height))] -translate-y-16">
    <slot />
  </main>
  <AppFooter />
</template>