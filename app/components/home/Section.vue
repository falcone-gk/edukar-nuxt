<template>
  <div ref="mySection" class="flex flex-col mx-2 md:mx-0 text-center gap-12 h-full"
    :class="{ ['demo']: props.transition }" :id="props.id">
    <Typography :tag="props.tag" variant="bigger" color="primary" class="font-extrabold leading-[1.25]">
      {{ props.title }}
    </Typography>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: String,
  title: String,
  tag: {
    type: String,
    default: 'h1'
  },
  transition: {
    type: Boolean,
    default: true
  }
})

const mySection = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-delay');
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  if (mySection.value && props.transition) {
    observer.observe(mySection.value);
  }
});
</script>

<style scoped>
.animate-delay {
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-name: animate-delay;
}

@keyframes animate-delay {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.demo {
  opacity: 0;
  transform: translateY(10px);
}
</style>
