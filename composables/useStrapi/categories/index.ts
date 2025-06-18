import { ref } from '@nuxtjs/composition-api';
import { StrapiCategory } from '~/types/strapi';
import { StrapiApiResponse } from '../core/types';
import { strapiApiClient } from '../core/api-client';

const extractCategoryData = (response: StrapiApiResponse<StrapiCategory>) => {
  if (Array.isArray(response.data)) {
    return response.data.map(d => ({ id: d.id, ...d.attributes }));
  }
  if (response.data) {
    const singleItem = Array.isArray(response.data) ? response.data[0] : response.data;
    return singleItem ? { id: singleItem.id, ...singleItem.attributes } : null;
  }
  return null;
};

export const useStrapiCategories = () => {
  const loading = ref(false);
  const error = ref(null);
  const categories = ref<StrapiCategory[] | null>(null);
  const category = ref<StrapiCategory | null>(null);

  const search = async (params: { slug?: string } = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const endpoint = params.slug ? 'getCategory' : 'getCategories';
      const result = await strapiApiClient[endpoint](params);
      const extractedData = extractCategoryData(result);

      if (params.slug) {
        category.value = extractedData as StrapiCategory;
      } else {
        categories.value = extractedData as StrapiCategory[];
      }
    } catch (e) {
      error.value = e;
      console.error('useStrapiCategories.search failed:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    category,
    categories,
    loading,
    error,
  };
}; 