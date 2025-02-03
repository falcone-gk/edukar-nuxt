<script setup lang="ts">
import JSConfetti from "js-confetti";
import { ModalStorePresentation } from "#components";

const isModalAlreadyOpen = useState("isModalAlreadyOpen", () => false);

const modal = useModal();
onMounted(() => {
  if (isModalAlreadyOpen.value) return;
  modal.open(ModalStorePresentation, {
    onClose: () => {
      modal.close();
    },
  });

  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ["🎉", "🎊", "🎈", "🎇", "🥳", "🎉", "🎊", "🎈", "🎇", "🥳"],
    emojiSize: 30,
    confettiNumber: 100,
  });
  isModalAlreadyOpen.value = true;
});
</script>

<template>
  <div
    class="flex flex-col gap-24 mb-24 md:gap-56 md:mt-20 md:mb-56 mx-auto h-full max-w-6xl"
  >
    <ClientOnly>
      <template #fallback>
        <!-- this will be rendered on server side -->
      </template>
      <Teleport to="main">
        <CanvasBackground />
      </Teleport>
    </ClientOnly>
    <HomeSection
      id="hero"
      :transition="false"
      title="Conviértete en todo un experto en la materia que quieras."
    >
      <HomeSectionsHero />
    </HomeSection>

    <UDivider
      :ui="{
        border: {
          base: 'flex border-primary dark:border-gray-200',
        },
      }"
    >
      <LogoEdukarIcon />
    </UDivider>
    <HomeSection id="forum" title="Foro Edukar" tag="h2">
      <HomeSectionsForum />
    </HomeSection>

    <UDivider
      :ui="{
        border: {
          base: 'flex border-primary dark:border-gray-200',
        },
      }"
    >
      <LogoEdukarIcon />
    </UDivider>
    <HomeSection id="downloads" title="Descargar Exámenes de Admisión" tag="h2">
      <HomeSectionsDownloads />
    </HomeSection>
  </div>
</template>
