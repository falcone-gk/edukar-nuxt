import { defineStore } from 'pinia'
import type { University, YearsOption } from '~/types'

export const useServiceStore = defineStore('serviceStore', () => {
  const universityList = ref<University[] | undefined>(undefined)
  const years = ref<YearsOption[]>([{ label: '--Seleccionar año---', value: 0 }])

  return { universityList, years }
})
