export { userInfo };

declare module "#app" {
  interface PageMeta {
    breadCrumb?: {
      label?: string;
      icon: string;
      to?: string;
      isDynamic?: boolean;
    };
  }
}

declare global {
  interface userInfo {
    token: string;
    username: string;
    email: string;
    picture: string;
    has_notification: boolean;
  }
}

declare global {
  interface PaginationData<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
}

declare global {
  interface Window {
    CulqiCheckout: new (codigoComercio: string, config: ICulqiConfig) => ICulqi;
    Culqi3DS: ICulqi3DS;
  }
}

export interface ExamsFilter {
  universities: University[];
  years: number[];
}

export interface University {
  name: string;
  siglas: string;
  exam_types: stirng[];
  exam_areas: stirng[];
}

export interface UniversityOption {
  label: string;
  value: string;
}

export interface YearsOption {
  label: string;
  value: number;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  about_me: string;
  picture?: string;
}

export interface Notification {
  id: number;
  sender: string;
  date: string;
  title: string;
  description: string;
  is_read: boolean;
  source_path: string;
  full_source_path: string;
  time_difference: string;
}

export type Receipt = { receipt_url: string };

// Type for a single video part
export interface VideoPart {
  part_number: number;
  title: string;
  url: string;
  base_url: string;
}

// Type for a video product with its parts
export interface ProductVideoParts {
  id: number;
  name: string;
  description: string;
  video_parts: VideoPart[];
}
