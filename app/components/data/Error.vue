<template>
  <div class="text-center py-8">
    <div class="flex items-center justify-center flex-col px-4 py-8">
      <div class="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
        <svg class="h-8 w-8 fill-red-500 dark:fill-red-400" viewBox="0 0 512 512" x="0px" y="0px">
          <g id="_x30_7_x2C__dead_x2C__emoji_x2C__emotion_x2C__smiley_x2C__feelings">
            <g id="XMLID_3333_">
              <g id="XMLID_3355_">
                <g id="XMLID_3368_">
                  <path
                    d="M256,511C115.07,511,1,396.951,1,256C1,115.071,115.049,1,256,1c140.931,0,255,114.05,255,255&#xD;&#xA;					C511,396.932,396.951,511,256,511z M256,31C131.935,31,31,131.935,31,256s100.935,225,225,225s225-100.935,225-225&#xD;&#xA;					S380.065,31,256,31z"
                    id="XMLID_3369_" />
                </g>
                <g id="XMLID_3366_">

                  <rect height="84.853" id="XMLID_3367_"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 176.6066 -64.3661)" width="30" x="151" y="138.574" />
                </g>
                <g id="XMLID_3364_">

                  <rect height="30" id="XMLID_3365_" transform="matrix(0.7071 0.7071 -0.7071 0.7071 176.6066 -64.3661)"
                    width="84.853" x="123.574" y="166" />
                </g>
                <g id="XMLID_3362_">

                  <rect height="84.853" id="XMLID_3363_"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 229.3274 -191.6453)" width="30" x="331"
                    y="138.574" />
                </g>
                <g id="XMLID_3360_">

                  <rect height="30" id="XMLID_3361_" transform="matrix(0.7071 0.7071 -0.7071 0.7071 229.3274 -191.6453)"
                    width="84.853" x="303.574" y="166" />
                </g>
                <g id="XMLID_3356_">
                  <path
                    d="M331,406H181c-33.084,0-60-26.916-60-60s26.916-60,60-60h150c33.084,0,60,26.916,60,60&#xD;&#xA;					S364.084,406,331,406z M181,316c-16.542,0-30,13.458-30,30s13.458,30,30,30h150c16.542,0,30-13.458,30-30s-13.458-30-30-30H181z"
                    id="XMLID_3357_" />
                </g>
              </g>
            </g>
          </g>
          <g id="Layer_1">
          </g>
        </svg>
      </div>
      <div class="mt-4 text-center leading-5 text-gray-400">
        <p>{{ props.message }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  message: {
    type: String,
    default: '¡Hubo un problema al cargar los datos!'
  }
})
</script>