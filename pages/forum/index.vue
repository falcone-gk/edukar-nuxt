<template>
  <div class="mx-auto max-w-[900px] space-y-4">
    <UCard>
      <template #header>
        <Typography tag="h1" variant="h1" color="primary">
          Foro Edukar
        </Typography>
      </template>
      <div>
        <p>Este es el foro EDUKAR, donde podrán compartir y ayudar a otros estudiantes con ejercicios, dudas, consultas
          y resoluciones sobre problemas matemáticos y de ciencias.<br><span class="text-primary">Regístrate y se parte
            de
            esta comunidad estudiantil!!!</span>
        </p>
      </div>
    </UCard>
    <div>
      <UButton label="Crear nuevo post" icon="i-heroicons-plus-circle-solid" to="/forum/new-post" />
    </div>

    <SkeletonForumPost v-if="pending" />

    <div v-else class="flex flex-col gap-8">
      <UCard v-for="section in sections" :key="'section-' + section.id" :ui="{
      body: { padding: '' }
    }">
        <template #header>
          <h2 class="text-primary text-xl">
            <ULink @click="subsectionSelected = 0" class="hover:underline" :to="'/forum/' + section.slug">{{
      section.name }}
            </ULink>
          </h2>
        </template>
        <div class="flex items-center justify-between px-4 sm:px-6 border-b last:border-b-0 dark:border-gray-700 py-4"
          v-for="subsection in section.subsections" :key="'subsection-' + subsection.id">
          <div>
            <ULink @click="subsectionSelected = subsection.id" :to="`/forum/${section.slug}`"
              class="text-left hover:underline">{{ subsection.name }}</ULink>
          </div>
          <div v-if="subsection.last_post" class="text-right">
            <div>
              <ULink class="hidden sm:block hover:underline"
                :to="`/forum/${section.slug}/posts/${subsection.last_post.slug}`">
                {{ truncateText(subsection.last_post.title) }}
              </ULink>
              <ULink class="text-sm sm:hidden hover:underline"
                :to="`/forum/${section.slug}/posts/${subsection.last_post.slug}`">
                {{ truncateText(subsection.last_post.title, 15) }}
              </ULink>
            </div>
            <div class="text-xs">
              <p><span class="text-primary">{{ subsection.last_post.author }}</span>, {{ subsection.last_post.date }}
              </p>
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
  () => useApiFetch<sectionData[]>('/forum/home-forum'),
  {
    server: false
  }
)
</script>