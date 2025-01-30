<script lang="ts" setup>
import type { ProductVideoParts } from "~/types";

definePageMeta({
  middleware: ["auth"],
});

interface Result {
  result: {
    token: string;
  };
  success: boolean;
  errors: string[];
  messages: string[];
}

const route = useRoute();
const identifier = route.params.identifier;
const { $api } = useNuxtApp();

const { data: productVideo, status } = await useAsyncData(
  "cart-discount",
  async () => {
    const [parts, signedUrl] = await Promise.all([
      $api<ProductVideoParts>(`/services/products/${identifier}/videos/`),
      $api<Result>(`/services/videos/${identifier}/signed-url/`, {
        query: {
          part: 1,
        },
      }),
    ]);

    return { parts, signedUrl };
  },
);
const currentPart = ref(1);

const { data: partVideo, refresh: getSignedUrl } = useEdukarAPI<Result>(
  `/services/videos/${identifier}/signed-url/`,
  {
    query: {
      part: currentPart,
    },
    immediate: false,
    watch: false,
  },
);

const currentVideo = computed(
  () => productVideo.value?.parts.video_parts[currentPart.value - 1],
);
const currentSignedUrl = ref(productVideo.value?.signedUrl.result.token);

const relatedVideos = computed(() => {
  return productVideo.value?.parts.video_parts.filter(
    (part) => part.part_number !== currentPart.value,
  );
});

const isVideoReady = ref(true);
async function onChangeVideoPart(part: number) {
  isVideoReady.value = false;
  // Update the current part
  currentPart.value = part;

  // Fetch the new signed URL for the selected part
  await getSignedUrl();

  // Update the current video and signed URL
  currentSignedUrl.value = partVideo.value?.result.token;
  isVideoReady.value = true;
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-[1500px]' }">
    <DataLoading :loading="status === 'pending'" :data="productVideo">
      <template #data="{ data }">
        <div class="flex w-full flex-col md:flex-row">
          <div v-if="currentVideo" class="flex flex-1 flex-col p-4 space-y-4">
            <Typography tag="h1" variant="h2" color="gray">
              {{ currentVideo.title }}
            </Typography>
            <UiVideoPlayer
              v-if="isVideoReady"
              :src="`${currentVideo.base_url}/${currentSignedUrl}/manifest/video.m3u8`"
              type="application/x-mpegURL"
            />
          </div>

          <!-- Related videos list -->
          <div class="w-80 p-4 overflow-y-auto">
            <UCard>
              <template #header>
                <Typography tag="h2" variant="h3" color="gray">
                  Videos relacionados
                </Typography>
              </template>

              <div>
                <ul>
                  <li
                    v-for="video in relatedVideos"
                    @click="onChangeVideoPart(video.part_number)"
                    :key="video.part_number"
                    class="mb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg overflow-hidden"
                  >
                    <div class="p-2">
                      <Typography tag="h2" variant="body" color="gray">
                        {{ video.title }}
                      </Typography>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        Parte {{ video.part_number }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </UCard>
          </div>
        </div>
      </template>
    </DataLoading>
  </UContainer>
</template>
