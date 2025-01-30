<template>
  <video ref="videoPlayer" class="video-js"></video>
</template>

<script setup lang="ts">
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css"; // Import video.js styles

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const videoPlayer = ref<HTMLDivElement | null>(null); // Reference to the video player container
const player = ref<Player | null>(null); // Reference to the video.js player instance

// Initialize the video.js player
onMounted(() => {
  if (videoPlayer.value) {
    player.value = videojs(videoPlayer.value, {
      fluid: true,
      controls: true,
      preload: "none",
      playbackRates: [1, 1.5, 2],
      restoreEl: true,
      sources: [
        {
          src: props.src,
          type: props.type,
        },
      ],
    });
  }
});

// Clean up the player when the component is destroyed
onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose();
  }
});
</script>
