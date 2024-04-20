<script setup lang="ts">
const socials = [
  { icon: 'i-bxl-facebook', link: '' },
  { icon: 'i-bxl-twitter', link: '' },
  { icon: 'i-bxl-youtube', link: '' },
  { icon: 'i-bxl-instagram', link: '' },
  { icon: 'i-bxl-tiktok', link: '' },
  { icon: 'i-bxl-linkedin', link: '' },
]
</script>

<template>
  <footer class="text-sm text-white bg-primary-500 p-4">
    <div class="grid text-center grid-cols-1 sm:text-left sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <h2 class="font-bold text-white">EDUKAR</h2>
        <p>Somos una empresa que brinda servicios de clases de reforzamiento y talleres psicológicos en zonas de
          influencia directa o indirecta para empresas mineras, municipalidades y también particulares.</p>
      </div>
      <div>
        <h2 class="font-bold text-white">PRODUCTOS</h2>
        <ul>
          <li>
            <ULink class="hover:underline">Exámenes</ULink>
          </li>
          <li>
            <ULink class="text-left hover:underline">Clases particulares y grupos de estudio</ULink>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="font-bold text-white">COMPAÑÍA</h2>
        <ul>
          <li>
            <ULink class="hover:underline">Sobre nosotros</ULink>
          </li>
          <li>
            <ULink class="hover:underline">Términos y condiciones</ULink>
          </li>
          <li>
            <ULink class="hover:underline">Políticas de privacidad</ULink>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="font-bold text-white">CONTACTO</h2>
        <p>
          <UIcon class="mr-1" name="i-heroicons-home-solid"></UIcon>
          <span>Urb. Juan XXIII LT. 10 Mz. B Dpto. C3</span>
        </p>
        <p>
          <UIcon class="mr-1" name="i-heroicons-envelope-solid"></UIcon>
          <span>aedukar@gmail.com</span>
        </p>
        <p>
          <UIcon class="mr-1" name="i-heroicons-phone-solid"></UIcon>
          <span>+51 924 271 370</span>
        </p>
      </div>
    </div>
    <hr class="my-4">
    <div class="flex gap-4 md:justify-between items-center flex-col md:flex-row">
      <span>© 2020 Copyright: aedukar.com</span>
      <div class="space-x-1">
        <UButton v-for="social in socials" :icon="social.icon" size="sm" color="white" square variant="solid" />
      </div>
    </div>
  </footer>
</template>