import { ref, computed } from '@nuxtjs/composition-api';
import { strapiApiClient } from './core/api-client';

export function useStrapi(contentType) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const endpointMap = {
    pages: { single: 'getPage', collection: 'getPages' },
    articles: { single: 'getArticle', collection: 'getArticles' },
    categories: { single: 'getCategory', collection: 'getCategories' },
    authors: { single: 'getAuthor', collection: 'getAuthors' },
    global: { single: 'getGlobal', collection: 'getGlobal' },
  };

  const search = async (params) => {
    loading.value = true;
    error.value = null;
    try {
      const endpoints = endpointMap[contentType];
      if (!endpoints) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      const isSingle = params.slug || contentType === 'global';
      const endpoint = isSingle ? endpoints.single : endpoints.collection;
      
      const result = await strapiApiClient[endpoint](params);

      // Strapi returns an array for single items, so we extract the first element.
      if (isSingle && Array.isArray(result.data) && result.data.length > 0) {
        data.value = result.data[0];
      } else {
        data.value = result.data;
      }

    } catch (e) {
      error.value = e;
      console.error(`[useStrapi] Error searching ${contentType}:`, e);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    data,
    page: computed(() => (contentType === 'pages' ? data.value : null)),
    article: computed(() => (contentType === 'articles' ? data.value : null)),
    loading,
    error,
  };
} 