<template>
  <section>
    <div>
    </div>
    <UContainer class="w-full max-w-[1200px]">
      <div class="mb-4">
        <UButton size="sm" color="gray" icon="i-mdi-chevron-left" variant="link" to="/downloads/exams">
          Volver
        </UButton>
      </div>
      <div class="w-full">
        <DataLoading :loading="pending" :data="exam">

          <template #data="{ data }">
            <div class="flex flex-col-reverse md:flex-row gap-24">
              <div class="flex flex-col gap-8">
                <Typography tag="h1" variant="h2">
                  {{ data.title }}
                </Typography>

                <div class="flex flex-col my-3 gap-1">
                  <p>
                    <strong class="text-primary">Universidad:</strong> {{ data.root.university }}
                  </p>
                  <p>
                    <strong class="text-primary">Tipo de examen:</strong> {{ data.root.exam_type }}
                  </p>
                  <p>
                    <strong class="text-primary">Area:</strong> {{ data.root.area }}
                  </p>
                  <p>
                    <strong class="text-primary">Año:</strong> {{ data.year }}
                  </p>
                </div>

                <div class="flex flex-wrap justify-start gap-2">
                  <UButton color="gray" label="Descargar Examen" size="lg" rounded :to="exam?.source_exam" target="_blank"
                    :ui="customUIBtn" />

                  <UButton color="gray" v-if="exam?.source_video_solution" label="Video solucionario" size="lg" rounded
                    :to="exam?.source_video_solution" target="_blank" :ui="customUIBtn">
                    <template #trailing>
                      <span class="text-black px-1.5 py-0.5 rounded bg-gray-300">Free</span>
                    </template>
                  </UButton>

                  <UButton color="gray" v-if="exam?.source_video_solution_premium" label="Video solucionario" size="lg"
                    rounded :to="exam?.source_video_solution_premium" target="_blank" :ui="customUIBtn">
                    <template #trailing>
                      <span class="flex gap-1 text-black px-1.5 py-0.5 rounded bg-yellow-400">
                        <UIcon class="w-4 h-auto" name="i-ri-vip-crown-2-fill" />
                        Premium
                      </span>
                    </template>
                  </UButton>
                </div>
              </div>
              <div>
                <div class="book-container">
                  <div class="book">
                    <img alt="Imagen de portada" :src="getAbsoluteApiUrl(exam?.cover as string)" />
                  </div>
                </div>
              </div>
            </div>
          </template>

        </DataLoading>

        <div class="space-y-2 mt-8" v-if="recommendExams?.results">
          <Typography tag="h2">
            Exámenes Relacionados:
          </Typography>
          <div class="grid gap-4 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
            <CardResume v-for="exam in recommendExams.results" :image="exam.cover" :title="exam.title"
              :to="`/downloads/exams/${exam.slug}`" />
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script lang="ts" setup>
import type { Exams } from '~/types/resultApiTypes';

definePageMeta({
  middleware: ['auth']
})

const filters = reactive<{
  year: number | undefined
  univ: string | undefined
}>({
  year: undefined,
  univ: undefined
})

const examId = ref<undefined | number>()

type ExamsPagination = PaginationData<Exams>
const { data: recommendExams, execute: getRecommendedExams } = await useAsyncData(
  'recommendExams',
  () => useApiFetch<ExamsPagination>(`/services/exams/`, {
    query: {
      ...filters,
      page: 1,
      size: 4
    },
  }), {
  // server: false,
  immediate: false,
  transform: (exams) => {
    exams.results = exams.results.filter((exam) => exam.id !== examId.value)
    return exams
  }
})


// Fetch exam data
const route = useRoute()
const examSlug = route.params.slug
const { data: exam, pending } = useLazyAsyncData(
  'examData',
  async () => useApiFetch<Exams>(`/services/exams/${examSlug}/`, {
    onResponse({ response }) {
      const data = response._data
      filters.year = data.year
      filters.univ = data.univ
      examId.value = data.id
      getRecommendedExams()
    }
  })
)


// Filling SEO data
const { getAbsoluteUrl } = useAbsoluteUrl()
const { getAbsoluteApiUrl } = useAbsoluteApiUrl()
useSeoMeta({
  title: () => exam.value?.title ? `${exam.value?.title}` : 'Examen',
  description: () => `${exam.value?.title}`,

  // Social media
  ogImage: () => `${getAbsoluteApiUrl(exam.value?.cover as string)}`,
  ogImageAlt: () => 'Portada de examen',
  ogDescription: () => `${exam.value?.title}`,
  ogTitle: () => `${exam.value?.title}`,
  ogUrl: () => getAbsoluteUrl(`/downloads/exams/${examSlug}`),

  // Twitter
  twitterImage: () => `${getAbsoluteApiUrl(exam.value?.cover as string)}`,
  twitterDescription: () => `${exam.value?.title}`,
  twitterTitle: () => `${exam.value?.title}`
})

const customUIBtn = { rounded: 'rounded-full' }

</script>

<style scoped>
.book-container {
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 600px;
}

@keyframes initAnimation {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(-25deg);
  }
}

.book {
  width: 300px;
  height: 450px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateY(-25deg);
  transition: 1s ease;
  animation: 1s ease 0s 1 initAnimation;
}

.book-container:hover .book,
.book-container:focus .book {
  transform: rotateY(0deg);
}

.book> :first-child {
  position: absolute;
  top: 0;
  left: 0;
  background-color: red;
  width: 300px;
  height: 450px;
  transform: translateZ(17.5px);
  background-color: #01060f;
  border-radius: 0 2px 2px 0;
  box-shadow: 5px 5px 20px #666;
}

.book::before {
  position: absolute;
  content: ' ';
  background-color: blue;
  left: 0;
  top: 1px;
  width: 33px;
  height: 448px;
  transform: translateX(281.5px) rotateY(90deg);
  background: linear-gradient(90deg,
      #fff 0%,
      #f9f9f9 5%,
      #fff 10%,
      #f9f9f9 15%,
      #fff 20%,
      #f9f9f9 25%,
      #fff 30%,
      #f9f9f9 35%,
      #fff 40%,
      #f9f9f9 45%,
      #fff 50%,
      #f9f9f9 55%,
      #fff 60%,
      #f9f9f9 65%,
      #fff 70%,
      #f9f9f9 75%,
      #fff 80%,
      #f9f9f9 85%,
      #fff 90%,
      #f9f9f9 95%,
      #fff 100%);
}

.book::after {
  position: absolute;
  top: 0;
  left: 0;
  content: ' ';
  width: 300px;
  height: 450px;
  transform: translateZ(-17.5px);
  background-color: #01060f;
  border-radius: 0 2px 2px 0;
  box-shadow: -10px 0 50px 10px #666;
}
</style>
