import { ref } from '@nuxtjs/composition-api';
import { StrapiAuthor } from '~/types/strapi';
import { StrapiApiResponse } from '../core/types';
import { strapiApiClient } from '../core/api-client';

const extractAuthorData = (response: StrapiApiResponse<StrapiAuthor>) => {
  if (Array.isArray(response.data)) {
    return response.data.map(d => ({ id: d.id, ...d.attributes }));
  }
  if (response.data) {
    const singleItem = Array.isArray(response.data) ? response.data[0] : response.data;
    return singleItem ? { id: singleItem.id, ...singleItem.attributes } : null;
  }
  return null;
};

export const useStrapiAuthors = () => {
  const loading = ref(false);
  const error = ref(null);
  const authors = ref<StrapiAuthor[] | null>(null);
  const author = ref<StrapiAuthor | null>(null);

  const search = async (params: { slug?: string } = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const endpoint = params.slug ? 'getAuthor' : 'getAuthors';
      const result = await strapiApiClient[endpoint](params);
      const extractedData = extractAuthorData(result);

      if (params.slug) {
        author.value = extractedData as StrapiAuthor;
      } else {
        authors.value = extractedData as StrapiAuthor[];
      }
    } catch (e) {
      error.value = e;
      console.error('useStrapiAuthors.search failed:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    author,
    authors,
    loading,
    error,
  };
}; 