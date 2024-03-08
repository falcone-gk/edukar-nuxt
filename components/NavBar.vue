<script setup lang="ts">
const colorMode = useColorMode()

const toggleColorMode = () => {
  const colorSwitcher = {
    light: 'dark',
    dark: 'light'
  }
  colorMode.preference = colorSwitcher[colorMode.value as 'light' | 'dark']
}

const links = [
  { text: 'Inicio', path: '/', name: 'home', id: 1 },
  { text: 'Cursos', path: '/courses', name: 'course', id: 2 },
  { text: 'Foro', path: '/forum', name: 'forum', id: 3 },
  { text: 'Descargas', path: '/downloads', name: 'download', id: 4 },
]
</script>

<template>
  <header class="sticky top-0 px-4 h-12 hidden md:block shadow-xl z-10 bg-white dark:bg-secondary">
    <div class="flex justify-between h-full items-stretch">
      <div class="flex my-auto">
        <NuxtLink to="/">
          <LogoEdukar />
        </NuxtLink>
      </div>
      <nav>
        <ul class="h-full">
          <li class="inline-flex w-full h-12 justify-center items-center md:h-full md:w-24 [&>a]:w-full [&>a]:h-full [&>a]:grid [&>a]:place-items-center"" v-for="link in links" :key="link.id">
            <ULink :to="link.path" active-class="h-full w-full border-b-2 border-b-primary"
              inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{{ link.text}}
            </ULink>
          </li>
        </ul>
      </nav>
      <div class="flex flex-grow-0 my-auto gap-4">
        <UButton to="/login" type="button" label="Iniciar sesión"/>
        <UButton to="/signup" type="button" variant="outline" label="Registrarse" />
        <ColorScheme>
          <UButton
          :icon="colorMode.preference === 'light' ? 'i-heroicons-sun-solid' : 'i-heroicons-moon-solid'"
          size="sm"
          square
          variant="ghost"
          @click="toggleColorMode"
          />
        </ColorScheme>
      </div>
    </div>
  </header>
</template>