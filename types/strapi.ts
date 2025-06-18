/**
 * Strapi content types and component interfaces
 */

// Common interfaces
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

export interface StrapiMediaFormat {
  name: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface StrapiSEO {
  id: number;
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: StrapiMedia;
  metaSocial?: StrapiSocialMeta[];
  keywords?: string;
  metaRobots?: string;
  structuredData?: any;
  metaViewport?: string;
  canonicalURL?: string;
}

export interface StrapiSocialMeta {
  id: number;
  socialNetwork: 'Facebook' | 'Twitter';
  title: string;
  description: string;
  image?: StrapiMedia;
}

// Shared Components
export interface StrapiComponentSharedMedia {
  __typename: 'ComponentSharedMedia';
  id: number;
  file: StrapiMedia;
}

export interface StrapiComponentSharedQuote {
  __typename: 'ComponentSharedQuote';
  id: number;
  title: string;
  body: string;
}

export interface StrapiComponentSharedRichText {
  __typename: 'ComponentSharedRichText';
  id: number;
  body: string;
}

export interface StrapiComponentSharedSlider {
  __typename: 'ComponentSharedSlider';
  id: number;
  files: StrapiMedia[];
}

export interface StrapiComponentSharedFeature {
  id: number;
  title: string;
  description: string;
  icon?: StrapiMedia;
}

export interface StrapiComponentSharedTestimonial {
  id: number;
  name: string;
  email: string;
  quote: string;
  avatar?: StrapiMedia;
}

export interface StrapiComponentSharedCategoryCard {
  id: number;
  title: string;
  description: string;
  image?: StrapiMedia;
  link?: string;
}

// Section Components
export interface StrapiComponentSectionHeroBanner {
  __typename: 'ComponentSectionHeroBanner';
  id: number;
  title: string;
  subtitle?: string;
  backgroundImage?: StrapiMedia;
  buttonText?: string;
  buttonUrl?: string;
}

export interface StrapiComponentSectionProductSlider {
  __typename: 'ComponentSectionProductSlider';
  id: number;
  title: string;
  products?: any[]; // Replace with actual product interface
}

export interface StrapiComponentSectionTestimonials {
  __typename: 'ComponentSectionTestimonials';
  id: number;
  title: string;
  testimonials: StrapiComponentSharedTestimonial[];
}

export interface StrapiComponentSectionFaqSection {
  __typename: 'ComponentSectionFaqSection';
  id: number;
  title: string;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

export interface StrapiComponentSectionBlogPostsTeaser {
  __typename: 'ComponentSectionBlogPostsTeaser';
  id: number;
  title: string;
  articles?: StrapiArticle[];
}

export interface StrapiComponentSectionRichTextBlock {
  __typename: 'ComponentSectionRichTextBlock';
  id: number;
  content: string;
}

export interface StrapiComponentSectionPromotionalCta {
  __typename: 'ComponentSectionPromotionalCta';
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage?: StrapiMedia;
}

export interface StrapiComponentSectionCategoryHighlight {
  __typename: 'ComponentSectionCategoryHighlight';
  id: number;
  title: string;
  categories: StrapiComponentSharedCategoryCard[];
}

export interface StrapiComponentSectionImageCarousel {
  __typename: 'ComponentSectionImageCarousel';
  id: number;
  images: StrapiMedia[];
}

export interface StrapiComponentSectionFeatureGrid {
  __typename: 'ComponentSectionFeatureGrid';
  id: number;
  title: string;
  features: StrapiComponentSharedFeature[];
}

// Union type for all content sections
export type StrapiContentSection = 
  | StrapiComponentSectionHeroBanner
  | StrapiComponentSectionProductSlider
  | StrapiComponentSectionTestimonials
  | StrapiComponentSectionFaqSection
  | StrapiComponentSectionBlogPostsTeaser
  | StrapiComponentSectionRichTextBlock
  | StrapiComponentSectionPromotionalCta
  | StrapiComponentSectionCategoryHighlight
  | StrapiComponentSectionImageCarousel
  | StrapiComponentSectionFeatureGrid
  | StrapiComponentSharedCategoryCard;

// Union type for article blocks
export type StrapiArticleBlock = 
  | StrapiComponentSharedMedia
  | StrapiComponentSharedQuote
  | StrapiComponentSharedRichText
  | StrapiComponentSharedSlider;

// Content Types
export interface StrapiAuthor {
  id: number;
  documentId: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: StrapiMedia;
  articles?: StrapiArticle[];
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  articles?: StrapiArticle[];
}

export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  slug: string;
  cover?: StrapiMedia;
  blocks?: StrapiArticleBlock[];
  author?: StrapiAuthor;
  category?: StrapiCategory;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  seo?: StrapiSEO;
  publishAt?: string;
  contentSections?: StrapiContentSection[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

export interface StrapiGlobal {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription?: string;
  defaultSeo?: StrapiSEO;
  favicon?: StrapiMedia;
  logo?: StrapiMedia;
}

// API Response Types
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Composable parameter types
export interface GetPageParams {
  slug: string;
  populate?: string;
}

export interface GetPagesParams {
  page?: number;
  pageSize?: number;
  populate?: string;
  sort?: string;
  filters?: Record<string, any>;
}

export interface GetArticleParams {
  slug: string;
  populate?: string;
}

export interface GetArticlesParams {
  page?: number;
  pageSize?: number;
  populate?: string;
  sort?: string;
  filters?: Record<string, any>;
  category?: string;
}

export interface GetGlobalParams {
  populate?: string;
} 