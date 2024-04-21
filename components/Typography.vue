<template>
  <component :is="props.tag" :class="{ [classes]: true }" v-bind="$attrs">
    <slot />
  </component>
</template>

<script lang="ts" setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: (value: string) => {
      return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(value)
    },
  },
  variant: {
    type: String,
    default: 'body',
    validator: (value: string) => {
      return ['body', 'h1', 'h2', 'h3', 'bigger'].includes(value)
    }
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => {
      return ['primary', 'secondary', 'accent', 'dark-accent'].includes(value)
    }
  }
})

const variantClasses = computed(() => {
  const classLookup = {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    bigger: 'text-[2.50rem] md:text-[3.25rem]',
    body: 'text-base'
  }
  return classLookup[props.variant as keyof typeof classLookup]
})

const colorClasses = computed(() => {
  const classLookup = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    'dark-accent': 'text-dark-accent'
  }
  return classLookup[props.color as keyof typeof classLookup]
})

const classes = computed(() => {
  return variantClasses.value + ' ' + colorClasses.value
})
</script>