<template>
  <header class="sticky top-0 z-10 h-16 p-4 shadow-xl md:hidden bg-white dark:bg-secondary">
    <div class="flex  justify-between items-center h-full">
      <div class="flex my-auto">
        <NuxtLink to="/">
          <LogoEdukar />
        </NuxtLink>
      </div>
      <UButton v-show="!isOpen" icon="i-heroicons-bars-3-20-solid" color="primary" variant="link"
        @click="isOpen = true" />
    </div>
  </header>
  <USlideover class="md:hidden" v-model="isOpen" side="left" :ui="{
    width: 'relative w-5/6 max-w-md',
    base: ''
  }">
    <UCard class="h-screen" :ui="{ base: 'flex flex-col', footer: { base: 'mt-auto' } }">
      <template v-if="userStore.user" #header>
        <ul>
          <li>
            <div class="flex justify-between px-2.5 py-1.5">
              <div class="flex items-center gap-1.5">
                <UAvatar img-class="object-cover" :src="userStore.getPicturePath()" />
                <span>{{ userStore.user.username }}</span>
              </div>
            </div>
          </li>
        </ul>
      </template>
      <UVerticalNavigation :links="links" :ui="{
        active: 'bg-primary dark:before:bg-primary-500',
      }">
        <template #badge="{ link }">
          <div v-if="link.input" class="flex items-center ml-auto">
            <UToggle v-model="selected" @click="toggleColorMode" />
          </div>
        </template>
      </UVerticalNavigation>
      <template v-if="userStore.isLogged" #footer>
        <UButton icon="i-heroicons-arrow-right-end-on-rectangle-solid" label="Cerrar sesión" variant="ghost"
          @click="userStore.logout" />
      </template>
    </UCard>
  </USlideover>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
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
  { label: 'Iniciar sesión', to: '/login', icon: 'i-heroicons-user-solid', click: () => isOpen.value = false },
  { label: 'Registrarse', to: '/signup', icon: 'i-heroicons-user-plus-solid', click: () => isOpen.value = false }
]

const userLoggedLinks = [{
  label: 'Perfil',
  icon: 'i-heroicons-user-solid',
  to: '/account/me',
  exact: true,
  click: () => isOpen.value = false
}, {
  label: 'Mis Publicaciones',
  icon: 'i-heroicons-chat-bubble-left-right-solid',
  to: '/account/me/posts',
  exact: true,
  click: () => isOpen.value = false
}, {
  label: 'Notificaciones',
  icon: 'i-heroicons-envelope-solid',
  to: '/account/me/notifications',
  exact: true,
  click: () => isOpen.value = false
}]

const navLinks = [
  { label: 'Inicio', to: '/', icon: 'i-heroicons-home', click: () => isOpen.value = false },
  { label: 'Cursos', to: '/courses', icon: 'i-heroicons-book-open-20-solid', click: () => isOpen.value = false },
  { label: 'Foro', to: '/forum', icon: 'i-heroicons-chat-bubble-left-right-20-solid', click: () => isOpen.value = false },
  { label: 'Descargas', to: '/downloads/exams', icon: 'i-heroicons-arrow-down-circle-20-solid', click: () => isOpen.value = false },
]

const darkMode = [
  { label: 'Dark mode', icon: 'i-heroicons-moon-solid', input: true }
]

const links = computed(() => [
  navLinks,
  userStore.isLogged ? userLoggedLinks : userLinks,
  darkMode
])
</script>
