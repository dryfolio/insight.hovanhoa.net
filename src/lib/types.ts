export type PostExcerpt = {
  id: string;
  title: string;
  brief: string;
  url: string;
  tags: Tag[];
  publishedAt: string;
  slug: string;
};

export type Post = {
  title: string;
  content: {
    html: string;
  };
  tags: Tag[];
  publishedAt: string;
  brief: string;
  readTimeInMinutes: number;
  features: {
    tableOfContents: {
      items: TableOfContent[];
    };
  };
};

export type Tag = {
  name: string;
};

export type TableOfContent = {
    id: string;
    level: number;
    slug: string;
    title: string;
    parentId: string;
};