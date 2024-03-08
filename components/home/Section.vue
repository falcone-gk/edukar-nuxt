<template>
  <section ref="mySection" class="demo flex flex-col mx-2 md:mx-0 text-center gap-12 h-full" :id="props.id">
    <h1 class="text-primary font-extrabold text-[2.50rem] md:text-[3.25rem] leading-[1.25]">{{ props.title }}</h1>
    <slot />
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: String,
  title: String,
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
      threshold: 0.5,
    }
  );

  if (mySection.value) {
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