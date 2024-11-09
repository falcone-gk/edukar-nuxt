export interface ForumData {
  id: number;
  name: string;
  slug: string;
  subsections: {
    id: number;
    name: string;
    slug: string;
    last_post: {
      title: string;
      slug: string;
      date: string;
      author: string;
    };
  }[];
}

export interface Section {
  id: number;
  name: string;
  slug: string;
  subsections: Subsection[];
}

export interface Subsection {
  id: number;
  name: string;
}

export interface Author {
  username: string;
  picture: string;
}

export interface BasePost {
  id: number;
  author: Author;
  date: string;
  body: string;
  image: string | undefined;
}

export interface Post extends BasePost {
  section: Section;
  subsection: Subsection;
  comments: Comment[];
  title: string;
  slug: string;
}

export interface Comment extends BasePost {
  replies: Reply[];
}

export interface Reply extends BasePost {}
