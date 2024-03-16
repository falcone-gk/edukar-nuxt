<template>
  <div class="mx-auto max-w-[900px] space-y-4">
    <UCard>
      <template #header>
        <h1 class="title-section">Foro Edukar</h1>
      </template>
      <div>
        <p>Este es el foro EDUKAR, donde podrán compartir y ayudar a otros estudiantes con ejercicios, dudas, consultas
          y resoluciones sobre problemas matemáticos y de ciencias.<br><span class="text-primary">Regístrate y se parte de
          esta comunidad estudiantil!!!</span>
        </p>
      </div>
    </UCard>

    <SkeletonForumPost v-if="pending" />

    <div v-else>
      <UCard v-for="section in sections" :key="'section-' + section.id" :ui="{
        body: { padding: '' }
      }">
        <template #header>
          <h2 class="text-primary text-xl">
            <ULink @click="subsectionSelected = 0" class="hover:underline" :to="'/forum/' + section.slug">{{ section.name }}</ULink>
          </h2>
        </template>
        <div class="flex items-center justify-between px-4 sm:px-6 border-b last:border-b-0 dark:border-gray-700 py-4" v-for="subsection in section.subsections" :key="'subsection-' + subsection.id">
          <div>
            <ULink @click="subsectionSelected = subsection.id" :to="`/forum/${section.slug}`" class="text-left hover:underline">{{ subsection.name }}</ULink>
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
  </div>
</template>

<script lang="ts" setup>
import { truncateText } from '~/utils/text';

interface sectionData {
  id: number,
  name: string,
  slug: string,
  subsections: {
      id: number,
      name: string,
      slug: string,
      last_post: {
          title: string,
          slug: string,
          date: string,
          author: string,
      };
  }[];
}

const subsectionSelected = useState('subsection')

const { data: sections, pending } = await useLazyAsyncData<sectionData[]>(
  'forum',
  () => useApiFetch<sectionData[]>('/forum/home-forum')
)
</script>