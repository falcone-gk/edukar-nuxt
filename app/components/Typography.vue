<template>
  <component :is="computedTag" :class="{ [classes]: true }" v-bind="$attrs">
    <slot />
  </component>
</template>

<script lang="ts" setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: (value: string) => {
      return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a'].includes(value)
    },
  },
  variant: {
    type: String,
    default: 'body',
    validator: (value: string) => {
      return ['body', 'h1', 'h2', 'h3', 'big', 'bigger', 'small', 'smaller'].includes(value)
    }
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => {
      return ['primary', 'white', 'danger', 'gray'].includes(value)
    }
  }
})

const computedTag = computed(() => {
  if (props.tag === 'a') {
    return resolveComponent('NuxtLink')
  }
  return props.tag
})

const variantClasses = computed(() => {
  const classLookup = {
    h1: 'text-2xl sm:text-3xl md:text-4xl',
    h2: 'text-3xl',
    h3: 'text-lg sm:text-xl md:text-2xl',
    big: 'text-xl',
    bigger: 'text-[2.50rem] md:text-[3.25rem]',
    body: 'text-base',
    small: 'text-sm',
    smaller: 'text-xs'
  }
  return classLookup[props.variant as keyof typeof classLookup]
})

const colorClasses = computed(() => {
  const classLookup = {
    primary: 'text-primary-500 dark:text-primary-400',
    danger: 'text-red-500 dark:text-red-400',
    gray: 'text-gray-500 dark:text-gray-400',
    white: 'text-black dark:text-white'
  }
  return classLookup[props.color as keyof typeof classLookup]
})

const classes = computed(() => {
  return variantClasses.value + ' ' + colorClasses.value
})
</script>
