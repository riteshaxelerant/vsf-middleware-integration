import { ref } from '@nuxtjs/composition-api';
import { StrapiGlobal } from '~/types/strapi';
import { StrapiApiResponse } from '../core/types';
import { strapiApiClient } from '../core/api-client';

const extractGlobalData = (response: StrapiApiResponse<StrapiGlobal>) => {
  if (response.data && !Array.isArray(response.data)) {
    return { id: response.data.id, ...response.data.attributes };
  }
  return null;
};

export const useStrapiGlobal = () => {
  const loading = ref(false);
  const error = ref(null);
  const global = ref<StrapiGlobal | null>(null);

  const search = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await strapiApiClient.getGlobal();
      global.value = extractGlobalData(result);
    } catch (e) {
      error.value = e;
      console.error('useStrapiGlobal.search failed:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    global,
    loading,
    error,
  };
}; 