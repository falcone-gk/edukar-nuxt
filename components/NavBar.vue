<script setup lang="ts">
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

const iconColorMode = computed(() => {
  return colorMode.value === 'dark' ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'
})

const links = [
  { text: 'Inicio', path: '/', name: 'home', id: 1 },
  { text: 'Cursos', path: '/courses', name: 'course', id: 2 },
  { text: 'Foro', path: '/forum', name: 'forum', id: 3 },
  { text: 'Descargas', path: '/downloads', name: 'download', id: 4 },
]

/* const darkModeItem = [
  { icon: 'i-heroicons-moon-solid', label: 'Dark mode', slot: 'theme' }
] */

const menuItems = [
  [
    { icon: 'i-heroicons-user-solid', label: 'Ver perfil', click: () => navigateTo('/account/me') },
    { icon: 'i-heroicons-chat-bubble-left-right-solid', label: 'Mis publicaciones', click: () => navigateTo('/account/me/posts') },
    { icon: 'i-heroicons-envelope-solid', label: 'Notificaciones', click: () => navigateTo('/account/me/notifications') },
  ],
  [
    { icon: 'i-heroicons-arrow-right-end-on-rectangle-solid', label: 'Cerrar sesión', click: userStore.logout }
  ]
]
</script>

<template>
  <header class="sticky top-0 px-4 h-[var(--header-height)] hidden md:block shadow-xl z-10 bg-white dark:bg-secondary">
    <div class="flex justify-between h-full items-stretch">
      <div class="flex my-auto">
        <NuxtLink to="/">
          <LogoEdukar />
        </NuxtLink>
      </div>
      <nav>
        <ul class="h-full">
          <li
            class="inline-flex w-full h-12 justify-center items-center md:h-full md:w-24 [&>a]:w-full [&>a]:h-full [&>a]:grid [&>a]:place-items-center"" v-for="
            link in links" :key="link.id">
            <ULink :to="link.path" active-class="h-full w-full border-b-2 border-b-primary"
              inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{{
              link.text }}
            </ULink>
          </li>
        </ul>
      </nav>
      <div class="flex flex-grow-0 my-auto gap-4">
        <UButton v-if="!userStore.isLogged" to="/login" type="button" label="Iniciar sesión" />
        <UButton v-if="!userStore.isLogged" to="/signup" type="button" variant="outline" label="Registrarse" />
        <div>
          <ColorScheme>
            <UButton :icon="iconColorMode" color="gray" variant="ghost" @click="toggleColorMode" />
          </ColorScheme>
        </div>
        <div v-if="userStore.user" class="flex gap-2">
          <UDropdown :items="menuItems" :popper="{ placement: 'bottom-start' }">
            <template #theme="{ item }">
              <UIcon class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500" :name="item.icon" />
              <span class="truncate">{{ item.label }}</span>
              <div class="flex items-center ml-auto">
                <UToggle v-model="selected" @click="toggleColorMode" />
              </div>
            </template>
            <UAvatar :src="userStore.getPicturePath()" />
          </UDropdown>
        </div>
      </div>
    </div>
  </header>
</template>