import { ref } from '@nuxtjs/composition-api';
import { StrapiArticle } from '~/types/strapi';
import { StrapiApiResponse, StrapiMeta } from '../core/types';
import { strapiApiClient } from '../core/api-client';

const extractArticleData = (response: StrapiApiResponse<StrapiArticle>) => {
  if (!response?.data) return null;

  const processArticle = (article) => ({
    ...article,
    id: article.documentId,
    image: article.cover,
  });

  if (Array.isArray(response.data)) {
    return response.data.map(processArticle);
  }
  
  const singleItem = Array.isArray(response.data) ? response.data[0] : response.data;
  return singleItem ? processArticle(singleItem) : null;
};

export const useStrapiArticles = () => {
  const loading = ref(false);
  const error = ref(null);
  const articles = ref<StrapiArticle[]>([]);
  const article = ref<StrapiArticle | null>(null);
  const meta = ref<StrapiMeta | null>(null);

  const search = async (params: { slug?: string, limit?: number, start?: number } = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const isSingle = !!params.slug;
      const endpoint = isSingle ? 'getArticle' : 'getArticles';
      const result = await strapiApiClient[endpoint](params);
      const extractedData = extractArticleData(result);

      if (isSingle) {
        article.value = extractedData as StrapiArticle;
      } else {
        articles.value = (extractedData as StrapiArticle[]) || [];
        meta.value = result.meta || null;
      }
    } catch (e) {
      error.value = e;
      console.error('useStrapiArticles.search failed:', e);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async (limit: number = 10) => {
    if (loading.value || (meta.value && articles.value.length >= meta.value.pagination.total)) return;

    loading.value = true;
    try {
      const currentCount = articles.value.length;
      const result = await strapiApiClient.getArticles({ start: currentCount, limit });
      const newArticles = (extractArticleData(result) as StrapiArticle[]) || [];
      
      if (newArticles.length) {
        articles.value.push(...newArticles);
      }
      meta.value = result.meta || null;

    } catch (e) {
      error.value = e;
      console.error('useStrapiArticles.loadMore failed:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    loadMore,
    article,
    articles,
    meta,
    loading,
    error,
  };
}; 