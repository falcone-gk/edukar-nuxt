<template>
  <div class="flex flex-col justify-center items-center gap-8">
    <p class="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl">
      Participa en nuestro foro educacional donde podrás consultar con nuestra
      comunidad los ejercicios en los que tengas complicaciones para resolver o
      ayudar a otros con sus ejercicios.
    </p>
    <CustomButtonGradient
      to="/forum"
      size="xl"
      label="Ir al foro"
      icon="i-heroicons-chat-bubble-left-right-solid"
    />

    <div class="text-left flex flex-col md:flex-row gap-20 w-full">
      <div class="flex-1">
        <Typography color="gray" tag="h3" variant="h1" class="mb-12">
          Utiliza nuestro editor de texto <br />
          con código <LogoLatex class="inline-block" />
        </Typography>
        <Typography color="gray" variant="big">
          Descubre nuestro editor con soporte para código
          <LogoLatex class="inline-block" height="h-6" />, ideal para crear
          <span class="text-primary">fórmulas matemáticas</span>, además puedes
          subir <span class="text-primary">imágenes</span> de tus ejercicios.
          ¡Empieza a compartir tus preguntas hoy mismo!
        </Typography>
        <p></p>
      </div>
      <div class="flex-1">
        <!-- <PostEditor v-model:text="exerciseLatexCode" :show-tips="false" /> -->
        <img src="/images/text-editor.webp" loading="lazy" alt="text-editor" />
      </div>
    </div>
  </div>
</template>
