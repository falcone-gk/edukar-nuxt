<template>
  <section id="courses" class="flex justify-center px-2">
    <UContainer>
      <UCard>
        <template #header>
          <h1 class="title-section">Cursos</h1>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <CardResume v-for="course in data?.results" :image="course.image" :title="course.name"
            @callback="openURL(course.url)" />
        </div>
        <template #footer>
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

const { data } = await useAsyncData<CoursePagination>(
  'courses',
  () => useApiFetch<CoursePagination>('/services/courses', {
    query: {
      page: page.value,
      size: pageCount.value
    }
  }),
  { watch: [page,] }
)

const openURL = async (url: string) => {
  await navigateTo(url, {
    open: { target: '_blank' }
  })
}

</script>