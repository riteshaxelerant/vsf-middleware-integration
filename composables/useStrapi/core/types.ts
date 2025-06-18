import { StrapiPage, StrapiArticle, StrapiCategory, StrapiAuthor, StrapiGlobal } from '~/types/strapi';

export type StrapiData<T> = {
  id: number;
  attributes: T;
};

export type StrapiApiResponse<T> = {
  data: StrapiData<T> | StrapiData<T>[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type UseStrapiParams = {
  slug?: string;
};

export type ComposableResults<T> = {
  data: T | T[] | null;
  loading: boolean;
  error: Error | null;
};

export type StrapiComposables = {
  pages: () => Promise<ComposableResults<StrapiPage>>;
  articles: () => Promise<ComposableResults<StrapiArticle>>;
  categories: () => Promise<ComposableResults<StrapiCategory>>;
  authors: () => Promise<ComposableResults<StrapiAuthor>>;
  global: () => Promise<ComposableResults<StrapiGlobal>>;
}; 