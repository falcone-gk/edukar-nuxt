<template>
  <header class="sticky top-0 z-10 h-16 p-4 shadow-xl md:hidden bg-white dark:bg-secondary">
    <div class="flex  justify-between items-center h-full">
      <div class="flex my-auto">
        <NuxtLink to="/">
          <LogoEdukar />
        </NuxtLink>
      </div>
      <UButton
      v-show="!isOpen"
      icon="i-heroicons-bars-3-20-solid"
      color="primary"
      variant="link"
      @click="isOpen = true"/>
    </div>
  </header>
  <USlideover class="fixed top-0 z-30 md:hidden" v-model="isOpen" side="left">
    <UCard class="fixed top-0 h-screen w-5/6">
      <template #header>
        <ul>
          <li>
            <div class="flex justify-between px-2.5 py-1.5">
              <div class="flex items-center gap-1.5">
                <UIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" name="i-heroicons-moon-solid" />
                <span>Dark Mode</span>
              </div>
              <div class="flex items-center">
                <UToggle v-model="selected" @click="toggleColorMode"/>
              </div>
            </div>
          </li>
        </ul>
      </template>
      <UVerticalNavigation :links="links"
      :ui="{
        active: 'bg-primary dark:before:bg-primary-500'
      }"
    />
    </UCard>
  </USlideover>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const selected = ref<boolean>(colorMode.preference === 'dark' ? true : false)

const toggleColorMode = () => {
  const colorSwitcher = {
    light: 'dark',
    dark: 'light'
  }
  colorMode.preference = colorSwitcher[colorMode.value as 'light' | 'dark']
}

const isOpen = ref(false)

const userLinks = [
  { label: 'Iniciar sesión', to: '/login', icon: 'i-heroicons-user-20-solid' },
  { label: 'Registrarse', to: '/signup', icon: 'i-heroicons-user-plus-20-solid' }
]

const navLinks = [
  { label: 'Inicio', to: '/', icon: 'i-heroicons-home'},
  { label: 'Cursos', to: '/courses', icon: 'i-heroicons-book-open-20-solid' },
  { label: 'Foro', to: '/forum', icon: 'i-heroicons-chat-bubble-left-right-20-solid' },
  { label: 'Descargas', to: '/downloads', icon: 'i-heroicons-arrow-down-circle-20-solid' },
]

const links = [
  userLinks,
  navLinks
]
</script>