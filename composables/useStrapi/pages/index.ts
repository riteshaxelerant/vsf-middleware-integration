import { ref } from '@nuxtjs/composition-api';
import { StrapiPage } from '~/types/strapi';
import { StrapiApiResponse, StrapiData } from '../core/types';
import { strapiApiClient } from '../core/api-client';

const extractPageData = (response: StrapiApiResponse<StrapiPage>) => {
  if (Array.isArray(response.data)) {
    return response.data.map(d => ({ id: d.id, ...d.attributes }));
  }
  if (response.data) {
     // For fetching a single entry by slug, Strapi returns an array with one item.
    const singleItem = Array.isArray(response.data) ? response.data[0] : response.data;
    return singleItem ? { id: singleItem.id, ...singleItem.attributes } : null;
  }
  return null;
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
      const endpoint = params.slug ? 'getPage' : 'getPages';
      const result = await strapiApiClient[endpoint](params);
      const extractedData = extractPageData(result);

      if (params.slug) {
        page.value = extractedData as StrapiPage;
      } else {
        pages.value = extractedData as StrapiPage[];
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