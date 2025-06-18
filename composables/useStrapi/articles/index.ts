import { ref } from '@nuxtjs/composition-api';
import { StrapiArticle } from '~/types/strapi';
import { StrapiApiResponse } from '../core/types';
import { strapiApiClient } from '../core/api-client';

const extractArticleData = (response: StrapiApiResponse<StrapiArticle>) => {
  if (Array.isArray(response.data)) {
    return response.data.map(d => ({ id: d.id, ...d.attributes }));
  }
  if (response.data) {
    const singleItem = Array.isArray(response.data) ? response.data[0] : response.data;
    return singleItem ? { id: singleItem.id, ...singleItem.attributes } : null;
  }
  return null;
};

export const useStrapiArticles = () => {
  const loading = ref(false);
  const error = ref(null);
  const articles = ref<StrapiArticle[] | null>(null);
  const article = ref<StrapiArticle | null>(null);

  const search = async (params: { slug?: string } = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const endpoint = params.slug ? 'getArticle' : 'getArticles';
      const result = await strapiApiClient[endpoint](params);
      const extractedData = extractArticleData(result);

      if (params.slug) {
        article.value = extractedData as StrapiArticle;
      } else {
        articles.value = extractedData as StrapiArticle[];
      }
    } catch (e) {
      error.value = e;
      console.error('useStrapiArticles.search failed:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    article,
    articles,
    loading,
    error,
  };
}; 