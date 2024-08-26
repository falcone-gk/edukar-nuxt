// types for exams
export interface Exam {
    id: number
    root: Root
    cover: string
    title: string
    slug: string
    univ: string
    year: number
    source_exam: string
    source_video_solution: string
    source_video_solution_premium: string
}
  
export interface Root {
    id: number
    university: string
    siglas: string
    exam_type: string
    area: string
}

// Type for courses
export interface Courses {
    id: number
    image: string
    name: string
    url: string
}

// Type for posts
export interface Post {
    title: string
    slug: string
    time_difference: string
    author: Author
    subsection: string
    num_comments: number
}

export interface Author {
    username: string
    picture: string
}
