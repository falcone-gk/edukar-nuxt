<template>
  <section id="downloads" class="flex justify-center px-2">
    <UModal prevent-close v-model="isOpenAuthModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <Typography tag="h1" color="danger" variant="big">
              No autorizado!
            </Typography>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpenAuthModal = false" />
          </div>
        </template>

        <p>Para poder acceder a nuestros exámenes debes iniciar sesión o registrarte!</p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton label="Ir a iniciar sesión" to="/login" />
          </div>
        </template>

      </UCard>
    </UModal>
    <!-- Modal to show downloads description -->
    <LazyUModal v-model="isOpen" prevent-close :ui="{
      width: 'w-11/12 sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-2/5'
    }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-start justify-between">
            <h3 class="text-base font-semibold leading-6 text-primary">
              {{ examSelectData?.title }}
            </h3>
            <UButton variant="ghost" color="gray" icon="i-heroicons-x-mark-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <!-- Card Body -->
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <div class="mx-auto sm:w-1/2">
            <img :src="useImgFullPath(examSelectData?.cover as string)" alt="Book cover" class="w-full max-w-[400px]">
          </div>
          <div class="sm:w-1/2 pl-4">
            <div class="flex flex-col my-3 gap-2">
              <p>
                <strong class="text-primary">Universidad:</strong> {{ examSelectData?.root.university }}
              </p>
              <p>
                <strong class="text-primary">Tipo de examen:</strong> {{ examSelectData?.root.exam_type }}
              </p>
              <p>
                <strong class="text-primary">Area:</strong> {{ examSelectData?.root.area }}
              </p>
              <p>
                <strong class="text-primary">Año:</strong> {{ examSelectData?.year }}
              </p>
            </div>
            <div class="flex flex-wrap justify-start gap-2">
              <UButton color="black" label="Descargar" size="xs" rounded :to="examSelectData?.source_exam" target="_blank"
                :ui="customUIBtn" />

              <UButton color="black" v-if="examSelectData?.source_video_solution" label="Video solucionario" size="xs"
                rounded :to="examSelectData?.source_video_solution" target="_blank" :ui="customUIBtn">
                <template #trailing>
                  <span class="text-black px-1.5 py-0.5 rounded bg-gray-300">Free</span>
                </template>
              </UButton>

              <UButton color="black" v-if="examSelectData?.source_video_solution_premium" label="Video solucionario"
                size="xs" rounded :to="examSelectData?.source_video_solution_premium" target="_blank" :ui="customUIBtn">
                <template #trailing>
                  <span class="flex gap-1 text-black px-1.5 py-0.5 rounded bg-yellow-400">
                    <UIcon class="w-4 h-auto" name="i-ri-vip-crown-2-fill" />
                    Premium
                  </span>
                </template>
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </LazyUModal>

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
            <div class="flex gap-2">
              <UFormGroup>
                <USelect v-model="filters.year" :options="serviceStore.years" placeholder="--Seleccionar año--" />
              </UFormGroup>
              <UFormGroup>
                <USelect v-model="filters.univ" :options="serviceStore.universities"
                  placeholder="--Seleccionar universidad--" />
              </UFormGroup>
            </div>

            <div class="md:ml-auto">
              <UButton label="Limpiar filtros" variant="ghost" color="gray" @click="clearFilters" />
            </div>
          </div>

          <DataLoading :loading="pending" :data="data" :list="data?.results">

            <template #loading>
              <SkeletonCardList />
            </template>

            <template #data="{ data }">
              <div class="grid gap-4 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
                <CardResume v-for="exam in data.results" :image="exam.cover" :title="exam.title"
                  @callback="showSelectedExam(exam)" />
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

const customUIBtn = { rounded: 'rounded-full' }
const serviceStore = useServiceStore()


type ExamPagination = PaginationData<Exams>
const route = useRoute()
const filters = reactive({
  year: route.query.year as string | undefined,
  univ: route.query.university as string | undefined
})
const pageCount = ref(8)
const { data, pending, page, clearFilters } = usePaginationFilter<ExamPagination>(
  { key: 'exams', size: pageCount.value, filters: filters, url: '/services/exams-list/' }
)


const isOpen = ref(false)
const isOpenAuthModal = ref(false)

const userStore = useUserStore()

const examSelectData = ref<Exams | undefined>(undefined)
const showSelectedExam = (examData: Exams) => {
  if (userStore.isLogged) {
    examSelectData.value = examData
    isOpen.value = true
  } else {
    isOpenAuthModal.value = true
  }
}


</script>
