import { defineStore } from 'pinia'
import type { Section, Subsection } from '~/types/forum'

export const useForumStore = defineStore('forumStore', () => {
  const sections = ref<Section[] | null>(null)
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

  return { sections, setSections, getSectionBySlug, getSubsectionsBySectionSlug }
})
