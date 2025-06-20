<template>
  <div class="strapi-page">
    <SfLoader :class="{ loading }" :loading="loading">
      <div v-if="page && page.contentSections">
        <div v-for="(component, i) in page.contentSections" :key="i">
          <StrapiContentRenderer :component="component" />
        </div>
      </div>
      <!-- Error and Debugging -->
      <div v-else>
        <div v-if="error" class="error-info">
          <h3>An error occurred:</h3>
          <pre>{{ error }}</pre>
        </div>
        <div v-if="!loading && !page && !error" class="no-content">
          <h3>No page content found.</h3>
          <p>The page may not exist or the API did not return any data for slug: "{{ slug }}"</p>
        </div>
         <div v-if="!loading && page && !page.contentSections" class="no-content">
          <h3>Page found, but it has no content sections.</h3>
        </div>
      </div>
    </SfLoader>
  </div>
</template>

<script>
import {
  SfLoader,
  SfHeading
} from '@storefront-ui/vue';
import { computed, useRoute, onMounted } from '@nuxtjs/composition-api';
import { useStrapiPages } from '~/composables/useStrapi';
import StrapiContentRenderer from '~/components/Strapi/StrapiContentRenderer.vue';

export default {
  name: 'StrapiPage',
  components: {
    SfLoader,
    SfHeading,
    StrapiContentRenderer,
  },
  setup() {
    const route = useRoute();
    const { search, page, loading, error } = useStrapiPages();

    const slug = computed(() => {
      return Array.isArray(route.value.params.slug)
        ? route.value.params.slug.join('/')
        : route.value.params.slug || route.value.path.replace(/^\//, '');
    });

    onMounted(async () => {
      await search({ slug: slug.value });      
    });

    return {
      loading,
      page,
      slug,
      error
    };
  },
};
</script>

<style lang="scss" scoped>
.strapi-page {
  padding: var(--spacer-lg);
}

.loading {
  --loader-overlay-color: var(--c-light);
  --loader-spinner-color: var(--c-primary);
}

.error-info, .no-content {
  padding: var(--spacer-lg);
  background: var(--c-danger-lighten);
  border: 1px solid var(--c-danger);
  border-radius: var(--border-radius);
  margin: var(--spacer-lg) 0;
}

.debug-info {
  margin-top: var(--spacer-2xl);
  padding: var(--spacer-lg);
  background: var(--c-warning-lighten);
  border-radius: var(--border-radius);
  border: 1px solid var(--c-warning);

  pre {
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style> 