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

export interface PostData {
    id: number,
    section: Section
    subsection: Subsection
    author: Author
    date: string
    comments: Comment[]
    body: string
    title: string
    slug: string
}

export interface Author {
    username: string
    picture: string
}

export interface Comment {
    id: number
    author: Author
    date: string
    replies: Reply[]
    body: string
}

export interface Reply {
    id: number
    author: Author
    date: string
    body: string
}