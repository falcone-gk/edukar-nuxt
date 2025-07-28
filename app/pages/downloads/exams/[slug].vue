<template>
  <section>
    <UContainer class="w-full max-w-[1200px]">
      <div class="mb-4">
        <UButton
          size="sm"
          color="gray"
          icon="i-mdi-chevron-left"
          variant="link"
          :to="backTo"
        >
          Volver
        </UButton>
      </div>
      <div class="w-full">
        <div class="flex flex-col-reverse md:flex-row gap-24">
          <div class="flex flex-col gap-8">
            <Typography tag="h1" variant="h2">
              {{ exam?.title }}
            </Typography>

            <div class="flex flex-col my-3 gap-1">
              <p>
                <strong class="text-primary">Universidad:</strong>
                {{ exam?.university }}
              </p>
              <p>
                <strong class="text-primary">Tipo de examen:</strong>
                {{ exam?.type }}
              </p>
              <p>
                <strong class="text-primary">Area:</strong> {{ exam?.area }}
              </p>
              <p><strong class="text-primary">Año:</strong> {{ exam?.year }}</p>
            </div>

            <div class="flex flex-wrap justify-start gap-2">
              <UButton
                color="gray"
                label="Descargar Examen"
                size="lg"
                rounded
                :ui="customUIBtn"
                @click="onDownload"
                :loading="pendingDownload"
              />

              <UButton
                color="gray"
                v-if="exam?.source_video_solution"
                label="Video solucionario"
                size="lg"
                rounded
                :to="exam?.source_video_solution"
                target="_blank"
                :ui="customUIBtn"
              >
                <template #trailing>
                  <span class="text-black px-1.5 py-0.5 rounded bg-gray-300"
                    >Free</span
                  >
                </template>
              </UButton>

              <UButton
                color="gray"
                v-if="exam?.source_video_product"
                label="Video solucionario"
                size="lg"
                rounded
                @click="onAddToCart"
                :loading="pending"
                :ui="customUIBtn"
              >
                <template #trailing>
                  <span
                    class="flex gap-1 text-black px-1.5 py-0.5 rounded bg-yellow-400"
                  >
                    <UIcon class="w-4 h-auto" name="i-mdi-cart" />
                    Comprar
                  </span>
                </template>
              </UButton>
            </div>
          </div>
          <div class="ml-auto">
            <div class="book-container">
              <div class="book">
                <img alt="Imagen de portada" :src="exam?.cover" />
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-2 mt-8">
          <Typography tag="h2"> Exámenes Relacionados: </Typography>
          <DataLoading
            :data="recommendExams"
            :list="recommendExams?.results"
            :loading="recommendStatus === 'pending'"
          >
            <template #loading>
              <SkeletonCardList />
            </template>

            <template #data="{ data }">
              <DisplayGrid>
                <CardResume
                  v-for="exam in data.results"
                  :image="exam.cover"
                  :title="exam.title"
                  :to="`/downloads/exams/${exam.slug}`"
                />
              </DisplayGrid>
            </template>
          </DataLoading>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script lang="ts" setup>
import type { Exam } from "~/types/resultApiTypes";

// definePageMeta({
//   middleware: ["auth"],
// });

const router = useRouter();
const backTo = computed(() => {
  const from = router.options.history.state.back;
  const defaultBackTo = "/downloads/exams";

  if (!from) return defaultBackTo;
  if (typeof from !== "string") return defaultBackTo;

  if (from.includes(defaultBackTo)) {
    return from;
  }
});

type ExamsPagination = PaginationData<Exam>;

// Fetch exam data
const route = useRoute();
const examSlug = route.params.slug as string;

const nuxtApp = useNuxtApp();
const { data: exam } = await useEdukarAPI<Exam>(
  `/services/exams/${examSlug}/`,
  {
    key: examSlug,
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

if (!exam.value) {
  throw showError({
    statusCode: 404,
    statusMessage: "No existe el examen",
  });
}

const { pending, onAddToCart } = useAddToCArt(exam.value.source_video_product)

const filters = reactive({
  year: exam.value.year,
  univ: exam.value.univ,
});

const examId = ref(exam.value.id);

const { data: recommendExams, status: recommendStatus } =
  useEdukarAPI<ExamsPagination>("/services/exams/", {
    key: `recommend-${filters.year}-${filters.univ}`,
    query: {
      ...filters,
      page: 1,
      size: 4,
    },
    lazy: true,
    transform: (exams) => {
      exams.results = exams.results.filter((exam) => exam.id !== examId.value);
      return exams;
    },
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  });

// Filling SEO data
const { getAbsoluteUrl } = useAbsoluteUrl();
const { getAbsoluteApiUrl } = useAbsoluteApiUrl();
useSeoMeta({
  title: () => (exam.value?.title ? `${exam.value?.title}` : "Examen"),
  description: () => `${exam.value?.title}`,

  // Social media
  ogImage: () => `${getAbsoluteApiUrl(exam.value?.cover as string)}`,
  ogImageAlt: () => "Portada de examen",
  ogDescription: () => `${exam.value?.title}`,
  ogTitle: () => `${exam.value?.title}`,
  ogUrl: () => getAbsoluteUrl(`/downloads/exams/${examSlug}`),

  // Twitter
  twitterImage: () => `${getAbsoluteApiUrl(exam.value?.cover as string)}`,
  twitterDescription: () => `${exam.value?.title}`,
  twitterTitle: () => `${exam.value?.title}`,
});

const customUIBtn = { rounded: "rounded-full" };

const {
  data: examFile,
  error,
  status: downloadStatus,
  execute: downloadExam,
} = useEdukarAPI<Blob>(
  () => getAbsoluteApiUrl(`/services/exams/download/${examSlug}/`),
  { immediate: false },
);

const pendingDownload = computed(() => downloadStatus.value === "pending");

const { showNotification } = useNotification();
async function onDownload() {
  await downloadExam();
  if (!exam.value || !examFile.value) {
    const errorMsg = error.value?.statusCode === 401 ? "Debes inciar sesión o registrate para poder descargar este examen" : "Hubo un error al descargar el examen. Por favor contactar con soporte de Edukar.";
    showNotification({
      title: "Error al descargar examen",
      type: "error",
      message: errorMsg
    });
  } else {
    downloadFile(examFile.value, exam.value.title);
  }
}
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

.book > :first-child {
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
  content: " ";
  background-color: blue;
  left: 0;
  top: 1px;
  width: 33px;
  height: 448px;
  transform: translateX(281.5px) rotateY(90deg);
  background: linear-gradient(
    90deg,
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
    #fff 100%
  );
}

.book::after {
  position: absolute;
  top: 0;
  left: 0;
  content: " ";
  width: 300px;
  height: 450px;
  transform: translateZ(-17.5px);
  background-color: #01060f;
  border-radius: 0 2px 2px 0;
  box-shadow: -10px 0 50px 10px #666;
}
</style>
