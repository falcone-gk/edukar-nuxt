import { defineStore } from 'pinia'
import type { UniversityOption, YearsOption, ExamsFilter } from '~/types'

export const useServiceStore = defineStore('serviceStore', () => {
  const universities = ref<UniversityOption[]>([])
  const years = ref<YearsOption[]>([])
  const videos = [
    { label: 'Video Solucionario Gratis', value: 'free' },
    { label: 'Video Solucionario Premium', value: 'premium' },
  ]

  const { data: filters, execute: getFilters } = useAsyncData(
    'exams-filter',
    () => useApiFetch<ExamsFilter>('/services/exams-filters'), {
    immediate: false,
    transform: (data: ExamsFilter) => {
      return {
        universities: data.universities.map(el => ({ label: el.university, value: el.siglas })),
        years: data.years.map(el => ({ label: String(el), value: el }))
      }
    }
  })

  const setupFilters = async () => {
    if (years.value.length === 0 || universities.value.length === 0) {
      await getFilters()
      if (filters.value) {
        universities.value = filters.value.universities
        years.value = filters.value.years
      }
    }
  }

  // TODO: find another way to do this with async and await
  setupFilters()

  return { universities, years, videos }
})
