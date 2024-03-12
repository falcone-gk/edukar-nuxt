export interface Section {
    id: number
    name: string
    slug: string
    subsections: Subsection[]
}

export interface Subsection {
    id: number
    name: string
}