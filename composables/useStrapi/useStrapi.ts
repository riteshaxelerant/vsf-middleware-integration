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

      // Detect if this is a single item request based on parameters
      const isSingle = params.slug || params.email || contentType === 'global';
      const endpoint = isSingle ? endpoints.single : endpoints.collection;
      
      const result = await strapiApiClient[endpoint](params);

      // For single items, GraphQL returns an array, so we extract the first element.
      // For collections, we keep the array as-is.
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