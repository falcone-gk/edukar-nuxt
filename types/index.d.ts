export { userInfo };

declare module '#app' {
    interface PageMeta {
        breadCrumb?: {
            label?: string,
            icon: string,
            to?: string,
            isDynamic?: boolean
        }
    }
}

declare global {
    interface userInfo {
        token: string,
        username: string
        email: string
        picture: string
        has_notification: boolean
    }
}

declare global {
    interface PaginationData<T> {
        count: number
        next: string | null
        previous: string | null
        results: T[]
    }
}

export interface ExamsFilter {
    universities: University[]
    years: number[]
}

export interface University {
    university: string
    siglas: string
}

export interface UniversityOption {
    label: string
    value: string
}

export interface YearsOption {
    label: string,
    value: number
}