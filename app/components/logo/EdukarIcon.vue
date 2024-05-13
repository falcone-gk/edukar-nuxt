<template>
  <svg class="dark:[&_.flower]:fill-none dark:[&_.flower]:stroke-primary dark:[&_.flower]:stroke-[15px]"
    :class="props.size + ' w-auto'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 638.35 638.35">
    <g id="Capa_2" data-name="Capa 2">
      <g id="Capa_1-2" data-name="Capa 1">
        <path class="cls-1 flower"
          d="M353.83,292.9V505.66H215.55a132.61,132.61,0,0,1-17.48-1.15c-37.67-5-70.81-25.72-93.66-56-20.32-26.9-32.52-61.3-32.52-98.79V172.56c0-19.66,16.73-35.59,37.34-35.59H212.88C290.71,137,353.83,206.78,353.83,292.9Z"
          transform="translate(0 -109.89)" />
        <path class="cls-2 flower"
          d="M575.76,242.39V354.86c0,83.28-79.21,150.8-176.91,150.8H221.93V354.86c0-83.29,79.21-150.81,176.92-150.81h136.7C557.75,204.05,575.76,221.21,575.76,242.39Z"
          transform="translate(0 -109.89)" />
        <path class="cls-3 flower"
          d="M0,643.15V530.69c0-83.29,79.21-150.8,176.91-150.8H353.83v150.8c0,83.28-79.21,150.81-176.92,150.81H40.21C18,681.5,0,664.33,0,643.15Z"
          transform="translate(0 -109.89)" />
        <path class="cls-4 flower"
          d="M221.93,592.31V379.56H360.21a132.62,132.62,0,0,1,17.48,1.14c37.67,5,70.81,25.72,93.66,56,20.32,26.9,32.52,61.3,32.52,98.8V712.66c0,19.65-16.74,35.58-37.34,35.58H362.88C285.05,748.24,221.93,678.43,221.93,592.31Z"
          transform="translate(0 -109.89)" />
        <path class="cls-5 flower"
          d="M353.83,292.9V505.66H221.93V354.85c0-64,46.74-118.65,112.69-140.56A167.93,167.93,0,0,1,353.83,292.9Z"
          transform="translate(0 -109.89)" />
        <path class="cls-6 flower"
          d="M353.83,379.89V505.65H215.56a132.77,132.77,0,0,1-17.49-1.15c-37.66-4.95-70.8-25.72-93.66-56A159.44,159.44,0,0,1,80.87,404c27.66-15.27,60.64-24.14,96-24.14Z"
          transform="translate(0 -109.89)" />
        <path class="cls-7 flower"
          d="M353.83,379.56v150.8c0,63.92-46.66,118.56-112.53,140.51A167.93,167.93,0,0,1,221.94,592V379.56Z"
          transform="translate(0 -109.89)" />
        <rect class="cls-8 flower" x="221.93" y="269.67" width="131.9" height="126.1" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">

const props = defineProps({
  size: {
    type: String,
    default: 'h-8',
  },
})

</script>

<style scoped>
.cls-1 {
  fill: #7a9fc3;
}

.cls-2 {
  fill: #e52329;
}

.cls-3 {
  fill: #4cb692;
}

.cls-4 {
  fill: #e8e11d;
}

.cls-5 {
  fill: #f19ec4;
}

.cls-6 {
  fill: #8fd0da;
}

.cls-7 {
  fill: #ececa2;
}

.cls-8 {
  fill: #fdfced;
}

.cls-9 {
  fill: #121a2d;
}

.cls-10 {
  fill: #6ea1c6;
}
</style>