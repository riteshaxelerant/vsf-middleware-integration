import { ref } from '@nuxtjs/composition-api';
import { StrapiPage } from '~/types/strapi';
import { StrapiApiResponse, StrapiData } from '../core/types';
import { strapiApiClient } from '../core/api-client';

const extractPageData = (response: StrapiApiResponse<StrapiPage>) => {
  // For a single page, the data is the first item in the array.
  if (Array.isArray(response.data)) {
    return response.data.length > 0 ? response.data[0] : null;
  }
  return response.data || null;
};

export const useStrapiPages = () => {
  const loading = ref(false);
  const error = ref(null);
  const pages = ref<StrapiPage[] | null>(null);
  const page = ref<StrapiPage | null>(null);

  const search = async (params: { slug?: string } = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const isSingle = !!params.slug;
      const endpoint = isSingle ? 'getPage' : 'getPages';
      const result = await strapiApiClient[endpoint](params);
      
      if (isSingle) {
      const extractedData = extractPageData(result);
        page.value = extractedData as unknown as StrapiPage;
      } else {
        // For collections, the response data is the array itself.
        pages.value = (result.data || []) as unknown as StrapiPage[];
      }

    } catch (e) {
      error.value = e;
      console.error('useStrapiPages.search failed:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    page,
    pages,
    loading,
    error,
  };
}; 