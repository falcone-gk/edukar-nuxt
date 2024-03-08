<template>
  <section class="flex flex-col mx-2" id="forum">
    <div class="space-y-4 mx-auto max-w-[900px]">
      <UCard>
        <template #header>
          <h1 class="text-primary text-4xl">Foro Edukar</h1>
        </template>
        <div>
          <p>Este es el foro EDUKAR, donde podrán compartir y ayudar a otros estudiantes con ejercicios, dudas, consultas
            y resoluciones sobre problemas matemáticos y de ciencias.<br><span class="text-primary">Regístrate y se parte de
            esta comunidad estudiantil!!!</span>
          </p>
        </div>
      </UCard>
      <UCard v-for="section in sections" :key="'section-' + section.id" :ui="{
        body: { padding: '' }
      }">
        <template #header>
          <h1 class="text-primary text-xl">{{ section.name }}</h1>
        </template>
        <div class="flex items-center justify-between px-4 sm:px-6 border-b dark:border-gray-700 py-4" v-for="subsection in section.subsections" :key="'subsection-' + subsection.id">
          <div>
            <ULink class="text-left hover:underline">{{ subsection.name }}</ULink>
          </div>
          <div class="text-right">
            <div>
              <ULink class="hidden sm:block hover:underline">{{ truncateText(subsection.last_post.title) }}</ULink>
              <ULink class="text-sm sm:hidden hover:underline">{{ truncateText(subsection.last_post.title, 15) }}</ULink>
            </div>
            <div class="text-xs">
              <p><span class="text-primary">{{ subsection.last_post.author }}</span>, {{ subsection.last_post.date }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </section>
</template>

<script lang="ts" setup>
import truncateText from '~/utils/text';

const { data: sections } = await useFetch('/api/forum')
</script>