<template>
  <section id="downloads" class="flex justify-center px-2">

    <!-- Downloads content -->
    <UContainer :ui="{
      base: 'w-full max-w-[900px]',
    }">
      <UCard class="flex-grow flex-shrink-0 basis-full">
        <template #header>
          <Typography tag="h1" variant="h1" color="primary">
            Exámenes
          </Typography>
        </template>

        <div>
          <div class="flex flex-col-reverse md:flex-row gap-2 px-3 py-3.5">
            <div class="flex flex-col md:flex-row gap-2">
              <UFormGroup>
                <USelect v-model="filters.year" :options="serviceStore.years" @change="updateQueryUrl"
                  placeholder="--Seleccionar año--" />
              </UFormGroup>
              <UFormGroup>
                <USelect v-model="filters.univ" :options="serviceStore.universities" @change="updateQueryUrl"
                  placeholder="--Seleccionar universidad--" />
              </UFormGroup>
              <UFormGroup>
                <USelect v-model="filters.video" :options="serviceStore.videos" @change="updateQueryUrl"
                  placeholder="--Seleccionar video solucionario--" />
              </UFormGroup>
            </div>

            <div class="md:ml-auto">
              <UButton label="Limpiar filtros" variant="ghost" color="gray" @click="onClearFilters" />
            </div>
          </div>

          <DataLoading :loading="pending" :data="data" :list="data?.results">

            <template #loading>
              <SkeletonCardList />
            </template>

            <template #data="{ data }">
              <div class="grid gap-4 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
                <CardResume v-for="exam in data.results" :image="exam.cover" :title="exam.title"
                  :to="`/downloads/exams/${exam.slug}`" />
              </div>
            </template>

          </DataLoading>

        </div>
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
import type { Exams } from '~/types/resultApiTypes';

useSeoMeta({
  title: 'Lista de Exámenes de Admisión',
  description: 'Lista de exámenes de admisión de distintas universidades del Perú y solucionarios descargables.'
})

// const customUIBtn = { rounded: 'rounded-full' }
const serviceStore = useServiceStore()
// const { getAbsoluteApiUrl } = useAbsoluteApiUrl()

type ExamPagination = PaginationData<Exams>
const route = useRoute()
const filters = reactive({
  year: route.query.year as string | undefined,
  univ: route.query.university as string | undefined,
  video: undefined as string | undefined
})
const pageCount = ref(8)
const { data, pending, page, clearFilters } = usePaginationFilter<ExamPagination>(
  { key: 'exams', size: pageCount.value, filters: filters, url: '/services/exams/' }
)


// const isOpen = ref(false)
// const isOpenAuthModal = ref(false)
//
// const userStore = useUserStore()
//
// const examSelectData = ref<Exams | undefined>(undefined)
// const showSelectedExam = (examData: Exams) => {
//   if (userStore.isLogged) {
//     examSelectData.value = examData
//     isOpen.value = true
//   } else {
//     isOpenAuthModal.value = true
//   }
// }

const router = useRouter()
const updateQueryUrl = () => {
  router.push({
    path: route.path, query: {
      year: filters.year,
      university: filters.univ,
      video: filters.video
    }
  })
}

const onClearFilters = () => {
  clearFilters()
  updateQueryUrl()
}

</script>
