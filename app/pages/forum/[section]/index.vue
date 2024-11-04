<template>
  <div class="mx-auto w-full max-w-[900px]">
    <div
      class="justify-center w-full mx-auto flex flex-col-reverse md:flex-row gap-4"
    >
      <UCard class="w-full">
        <template #header>
          <div class="flex justify-between">
            <Typography tag="h1" variant="h1">
              {{ sectionName }}:
              <span class="text-black dark:text-white">{{
                subsectionName
              }}</span>
            </Typography>
          </div>
        </template>
        <div class="space-y-4">
          <UFormGroup class="flex items-center">
            <USelect
              v-model="filters.subsection"
              :options="subsections"
              option-attribute="name"
              value-attribute="id"
            />
          </UFormGroup>

          <DataLoading :loading="pending" :data="data" :list="data?.results">
            <template #loading>
              <SkeletonForumPost />
            </template>

            <template #data="{ data }">
              <div
                v-for="post in data?.results"
                @click="navigateTo(`/forum/${sectionSlug}/posts/${post.slug}`)"
                class="flex items-center rounded w-full dark:border dark:border-slate-800 py-2 shadow-md cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-600"
              >
                <div class="px-2">
                  <img
                    class="rounded-full w-[48px] h-[48px] max-w-none"
                    :src="getAbsoluteApiUrl(post.author.picture)"
                    alt="picture"
                  />
                </div>
                <div class="w-full pr-4">
                  <div
                    class="flex flex-col sm:flex-row justify-between sm:items-center"
                  >
                    <h2 :title="post.title" class="hidden lg:block mr-auto">
                      {{ truncateText(post.title) }}
                    </h2>
                    <h2 :title="post.title" class="lg:hidden mr-auto">
                      {{ truncateText(post.title, 20) }}
                    </h2>
                    <p class="text-xs">
                      Publicación:
                      <span class="text-primary dark:text-primary-200">
                        {{ post.time_difference }}
                      </span>
                    </p>
                  </div>
                  <div class="hidden sm:flex justify-between items-center">
                    <p class="text-xs">
                      De
                      <span class="text-primary dark:text-primary-200">{{
                        post.author.username
                      }}</span>
                      en
                      <span class="text-primary dark:text-primary-200">{{
                        post.subsection
                      }}</span>
                    </p>
                    <div>
                      <UIcon
                        class="mr-2 text-slate-700"
                        name="i-heroicons-chat-bubble-oval-left-solid"
                      />
                      <span>{{ post.num_comments }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataLoading>
        </div>
        <template v-if="data && data.results.length > 0" #footer>
          <div class="flex justify-center">
            <UPagination
              :total="data.count"
              :page-count="pageCount"
              v-model="page"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { truncateText } from "~/utils/text";
import type { Section, Subsection } from "~/types/forum";
import type { Post } from "~/types/resultApiTypes";

useHead({
  title: "Secciones",
});

const { getAbsoluteApiUrl } = useAbsoluteApiUrl();
type PostPagination = PaginationData<Post>;

const filters = reactive({
  subsection: useState("subsection", () => 0),
});
const subsections = reactive<Subsection[]>([{ id: 0, name: "Todos" }]);
const pageCount = ref(5);

const route = useRoute();
const forumStore = useForumStore();
const sectionSlug = route.params.section;

const { getFilteredData, page } = usePaginationFilter({
  size: pageCount.value,
  filters,
  url: `/forum/sections/${sectionSlug}/`,
});
const { data, status } = getFilteredData<PostPagination>({ lazy: true });
const pending = computed(() => status.value === "pending");

const {
  data: sectionList,
  status: statusList,
  execute: getSections,
} = useEdukarAPI("/forum/section-list", {
  immediate: false,
});

if (!forumStore.sections) {
  await getSections();
}

if (statusList.value === "success") {
  forumStore.setSections(sectionList.value as Section[]);
}

const sectionName = forumStore.getSectionBySlug(sectionSlug as string);
const subsectionName = computed(() => {
  const subsectionSelected = subsections.find(
    (el) => el.id === Number(filters.subsection),
  );
  if (subsectionSelected) {
    return subsectionSelected.name;
  }
  return "";
});
subsections.push(
  ...(forumStore.getSubsectionsBySectionSlug(
    sectionSlug as string,
  ) as Subsection[]),
);
</script>
