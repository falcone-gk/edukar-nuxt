<script setup lang="ts">
const socials = [
  { icon: 'i-ri-facebook-fill', link: 'https://www.facebook.com/edukar1/', ariaLabel: 'Edukar Facebook' },
  { icon: 'i-ri-twitter-fill', link: 'https://twitter.com/aedukar', ariaLabel: 'Edukar Twitter' },
  { icon: 'i-ri-youtube-fill', link: 'https://www.youtube.com/c/Edukar1', ariaLabel: 'Edukar Youtube' },
  { icon: 'i-ri-instagram-fill', link: 'https://www.instagram.com/aedukar', ariaLabel: 'Edukar Instagram' },
  { icon: 'i-ri-tiktok-fill', link: 'https://www.tiktok.com/@aedukar?_t=8Y9ayI4Tzvh&_r=1', ariaLabel: 'Edukar Tiktok' },
  { icon: 'i-ri-linkedin-box-fill', link: 'https://www.linkedin.com/company/aedukar/', ariaLabel: 'Edukar Linkedin' },
]
</script>

<template>
  <footer class="text-sm text-white bg-primary-600 dark:bg-primary-500 p-4" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="grid text-center grid-cols-1 sm:text-left sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Typography tag="h3" color="white">SOBRE NOSOTROS</Typography>
        <p>Somos una empresa que brinda servicios de clases de reforzamiento y talleres psicológicos en zonas de
          influencia directa o indirecta para empresas mineras, municipalidades y también particulares.</p>
      </div>
      <div>
        <Typography tag="h3" color="white">PRODUCTOS</Typography>
        <ul>
          <li>
            <ULink class="hover:underline" to="/downloads/exams">Exámenes</ULink>
          </li>
          <li>
            <ULink class="text-left hover:underline" to="https://bit.ly/2Wv9hHP" target="_blank">
              Clases particulares y grupos de estudio
            </ULink>
          </li>
        </ul>
      </div>
      <div>
        <Typography tag="h3" color="white">COMPAÑÍA</Typography>
        <ul>
          <li>
            <ULink class="hover:underline" to="/company/about-us">Sobre nosotros</ULink>
          </li>
          <li>
            <ULink class="hover:underline" to="/company/terms-and-conditions">Términos y condiciones</ULink>
          </li>
          <li>
            <ULink class="hover:underline" to="/company/privacy-policy">Políticas de privacidad</ULink>
          </li>
        </ul>
      </div>
      <div>
        <Typography tag="h3" color="white">CONTACTO</Typography>
        <address>
          <p>
            <UIcon class="mr-1" name="i-heroicons-home-solid" aria-hidden="true"></UIcon>
            Urb. Juan XXIII LT. 10 Mz. B Dpto. C3
          </p>
          <p>
            <UIcon class="mr-1" name="i-heroicons-envelope-solid" aria-hidden="true"></UIcon>
            aedukar@gmail.com
          </p>
          <p>
            <UIcon class="mr-1" name="i-heroicons-phone-solid" aria-hidden="true"></UIcon>
            +51 924 271 370
          </p>
        </address>
      </div>
    </div>
    <hr class="my-4">
    <div class="flex gap-4 md:justify-between items-center flex-col md:flex-row">
      <span>© 2020 Copyright: aedukar.com</span>
      <div class="space-x-1">
        <UButton v-for="social in socials" :icon="social.icon" :to="social.link" target="_blank" size="sm" square
          variant="solid" :arial-label="social.ariaLabel" />
      </div>
    </div>
  </footer>
</template>
