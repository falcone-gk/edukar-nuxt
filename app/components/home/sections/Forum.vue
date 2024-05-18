<template>
  <div class="flex flex-col justify-center items-center gap-8">
    <p class="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl">Participa en nuestro foro educacional donde podrás
      consultar con nuestra comunidad los ejercicios en los que tengas complicaciones para resolver o ayudar a otros con
      sus ejercicios.
    </p>
    <CustomButtonGradient to="/forum" size="xl" label="Ir al foro" icon="i-heroicons-chat-bubble-left-right-solid" />

    <div class="text-left flex flex-col md:flex-row gap-20 w-full">
      <div class="flex-1">
        <Typography color="gray" tag="h3" variant="h1" class="mb-12">
          Utiliza nuestro editor de texto <br> con código <span aria-label="LaTeX" class="text-primary"
            v-html="latexCode"></span>
        </Typography>
        <Typography color="gray" variant="big">
          Descubre nuestro editor con soporte para código <span aria-label="LaTeX" class="text-primary"
            v-html="latexCode"></span>, ideal
          para crear <span class="text-primary">fórmulas matemáticas</span>, además puedes subir <span
            class="text-primary">imágenes</span> de tus ejercicios. ¡Empieza a compartir tus preguntas hoy mismo!
        </Typography>
        <p></p>
      </div>
      <div class="flex-1">
        <PostEditor v-model:text="exerciseLatexCode" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import katex from 'katex';

const latexCode = katex.renderToString('\\LaTeX')
const exerciseLatexCode = ref(`
<strong><h2>Ejercicio:</h2></strong>
<p>Calcular el valor de $$ "n" $$ si el grado del producto: $$ (x+1)(x^2+2)(x^3+3)(x^4+4) \\dots (x^n+n) $$ es igual a 210.</p>
<p>Dato: $$ 1+2+3+4+\\dots+n = \\frac{n(n+1)}{2} $$</p> 
<strong><h2>Solución:</h2></strong>
<p>Grado del producto: $$1+2+3+4+\\dots+n = 210$$ </p>
<p>Por dato del problema:</p>
<ol>
<li><p>$$\\frac{n(n+1)}{2} = 210$$</p></li>
<li><p>$$n(n+1) = 420$$</p></li>
<li><p>$$n(n+1)=20 \\times 21$$</p></li>
</ol>
<p>Respuesta: $$n=20$$</p>
`)

</script>
