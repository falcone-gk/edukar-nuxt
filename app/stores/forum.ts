import { defineStore } from 'pinia'
import type { Section, Subsection } from '~/types/forum'

export const useForumStore = defineStore('forumStore', () => {
  const sections = ref<Section[] | null>(null)

  const { data: sectionList, status: statusSection, execute: getSections } = useEdukarAPI<Section[]>('/forum/section-list', {
    immediate: false
  })
  /* const { data: sectionList, status: statusSection, execute: getSections } = useAsyncData<Section[]>(
    'sections-list',
    () => useApiFetch<Section[]>('/forum/section-list'), {
    immediate: false
  }) */

  const setupSections = async () => {
    await getSections()
    if (statusSection.value === 'success') {
      sections.value = sectionList.value
    } else {
      sections.value = []
    }
  }

  const setSections = (data: Section[]) => {
    sections.value = data
  }
  const getSectionBySlug = (slug: string) => {
    const section = sections.value?.find(el => el.slug === slug)
    return section?.name
  }
  const getSubsectionsBySectionSlug = (slug: string): Subsection[] | undefined => {
    const section = sections.value?.find(el => el.slug === slug)
    return section?.subsections
  }

  const getSubsectionsBySectionId = (id: number | undefined): Subsection[] => {
    if (id === undefined) return []
    const section = sections.value?.find(el => el.id === id)
    if (!section) {
      return []
    }
    return section.subsections
  }

  const getSectionOptions = async () => {
    if (sections.value === null) {
      await setupSections()
    }
    return sections.value!.map(el => ({ label: el.name, value: el.id }))
  }

  return {
    sections, setSections, getSubsectionsBySectionId,
    getSectionBySlug, getSubsectionsBySectionSlug, getSectionOptions
  }
})
