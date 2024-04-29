<template>
  <section id="courses" class="flex justify-center px-2">
    <UContainer :ui="{
      base: 'w-full max-w-[900px]',
    }">
      <UCard class="flex-grow flex-shrink-0 basis-full">
        <template #header>
          <Typography tag="h1" variant="h1" color="primary">
            Cursos
          </Typography>
        </template>

        <DataLoading :loading="pending" :data="data">
          <template #loading>
            <SkeletonCardList />
          </template>

          <template #data="{ data: courses }">
            <div class="grid gap-4 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
              <CardResume v-for="course in courses.results" :image="course.image" :title="course.name"
                @callback="openURL(course.url)" />
            </div>
          </template>

        </DataLoading>
        <template v-if="!pending && data" #footer>
          <div class="flex justify-center">
            <UPagination :total="data?.count" :page-count="pageCount" v-model="page" />
          </div>
        </template>
      </UCard>
    </UContainer>
  </section>
</template>

<script lang="ts" setup>
import type { Courses } from '~/types/resultApiTypes';

type CoursePagination = PaginationData<Courses>

const page = ref(1)
const pageCount = ref(8)

const { data, pending } = await useLazyAsyncData<CoursePagination>(
  'courses',
  () => useApiFetch<CoursePagination>('/services/courses', {
    query: {
      page: page.value,
      size: pageCount.value
    }
  }),
  {
    server: false,
    watch: [page,]
  }
)

const openURL = async (url: string) => {
  await navigateTo(url, {
    open: { target: '_blank' }
  })
}

</script>