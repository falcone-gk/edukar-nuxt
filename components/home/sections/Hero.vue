<template>
  <div class="flex flex-col gap-12">
    <p class="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl">Averigua la nueva forma de aprender que está haciendo
      que los estudiantes aprueben sus exámenes e ingresen a la universidad.</p>
    <div class="flex flex-col md:flex-row justify-center gap-20 md:gap-4">
      <div v-for="info in information" :key="info.id" class="flex flex-col items-center gap-4 md:w-1/3">
        <div class="w-12 h-12 rounded-full border border-primary flex items-center justify-center -my-1">
          <UIcon class="w-6 h-6 text-primary" :name="info.icon" />
        </div>
        <Typography tag="h2" variant="big" class="font-bold">{{ info.name }}</Typography>
        <ul class="dark:text-gray-300 list-inside">
          <li class="checks" v-for="c in info.content">{{ c }}</li>
        </ul>
      </div>
    </div>
    <div class="space-x-4">
      <!-- <UButton to="https://bit.ly/2Wv9hHP" target="_blank" icon="i-ri-whatsapp-fill" size="xl"> -->
      <!--   Más información -->
      <!-- </UButton> -->
      <CustomButtonGradient to="https://bit.ly/2Wv9hHP" target="_blank" icon="i-ri-whatsapp-fill" size="xl"
        label="Más información" />
      <UButton
        to="https://www.google.com/maps/dir/-16.4040524,-71.5390114/-16.3890574,-71.5644157/@-16.3925951,-71.5598581,15.35z/data=!4m4!4m3!1m1!4e1!1m0?entry=ttu"
        target="_blank" icon="i-ri-map-pin-2-fill" size="xl" color="gray">
        Ubícanos
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const information = [
  {
    id: 1,
    name: 'Cursos',
    icon: 'i-heroicons-book-open-solid',
    content: [
      'Clases presenciales y virtuales a todo nivel.',
      'Clases de reforzamiento y preparación para universidades.',
      'Apoyo con tareas y reforzamiento escolar.',
    ]
  },
  {
    id: 2,
    name: 'Talleres',
    icon: 'i-heroicons-wrench-screwdriver-solid',
    content: [
      'Talleres recreativos',
      'Lectoescritura',
      'Talleres para empresas',
      'Terapia de lenguaje',
      'Terapias psicológicas',
      'Escuela para padres'
    ]
  }
]
</script>

<style scoepd>
.checks::marker {
  content: '✓ ';
}
</style>
