<template>
  <div class="mx-auto max-w-[900px] space-y-4">
    <UCard>
      <template #header>
        <Typography tag="h1" variant="h1" color="primary">
          Foro Edukar
        </Typography>
      </template>
      <div>
        <p>
          Este es el foro EDUKAR, donde podrán compartir y ayudar a otros
          estudiantes con ejercicios, dudas, consultas y resoluciones sobre
          problemas matemáticos y de ciencias.<br /><span class="text-primary"
            >Regístrate y se parte de esta comunidad estudiantil!!!</span
          >
        </p>
      </div>
    </UCard>
    <div>
      <!-- <UButton label="Crear nuevo post" icon="i-heroicons-plus-circle-solid" to="/forum/posts/create" /> -->
      <CustomButtonGradient
        label="Crear nuevo post"
        icon="i-heroicons-plus-circle-solid"
        to="/forum/posts/create"
      />
    </div>

    <DataLoading :loading="status === 'pending'" :data="sections">
      <template #loading>
        <SkeletonForumPost />
      </template>

      <template #data="{ data: sections }">
        <div class="flex flex-col gap-8">
          <UCard
            v-for="section in sections"
            :key="'section-' + section.id"
            :ui="{ body: { padding: '' } }"
          >
            <template #header>
              <Typography tag="h2" variant="h2">
                <ULink
                  @click="subsectionSelected = 0"
                  class="hover:underline"
                  :to="'/forum/' + section.slug"
                >
                  {{ section.name }}
                </ULink>
              </Typography>
            </template>
            <div
              class="flex items-center justify-between px-4 sm:px-6 border-b last:border-b-0 dark:border-gray-700 py-4"
              v-for="subsection in section.subsections"
              :key="'subsection-' + subsection.id"
            >
              <div>
                <ULink
                  @click="subsectionSelected = subsection.id"
                  :to="`/forum/${section.slug}`"
                  class="text-left hover:underline"
                  >{{ subsection.name }}</ULink
                >
              </div>
              <div v-if="subsection.last_post" class="text-right">
                <div>
                  <ULink
                    class="hidden sm:block hover:underline"
                    :to="`/forum/${section.slug}/posts/${subsection.last_post.slug}`"
                  >
                    {{ truncateText(subsection.last_post.title) }}
                  </ULink>
                  <ULink
                    class="text-sm sm:hidden hover:underline"
                    :to="`/forum/${section.slug}/posts/${subsection.last_post.slug}`"
                  >
                    {{ truncateText(subsection.last_post.title, 15) }}
                  </ULink>
                </div>
                <div class="text-xs">
                  <p>
                    <span class="text-primary">{{
                      subsection.last_post.author
                    }}</span
                    >, {{ subsection.last_post.date }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </DataLoading>
  </div>
</template>

<script lang="ts" setup>
import type { ForumData } from "~/types/forum";

const subsectionSelected = useState("subsection");

const nuxtApp = useNuxtApp();
const { data: sections, status } = useEdukarAPI<ForumData[]>(
  "/forum/home-forum",
  {
    key: FORUM_HOME_KEY,
    lazy: true,
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);
</script>
