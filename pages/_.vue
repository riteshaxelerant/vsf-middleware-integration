<template>
  <div>
    <SfLoader :class="{ loading }" :loading="loading">
      <div v-if="page">
        <!-- SEO Meta Tags -->
        <SfHeading
          v-if="page.title"
          :level="1"
          :description="getMetaDescription"
          class="sf-heading--no-underline section-header"
        >
          {{ page.title }}
        </SfHeading>

        <!-- Dynamic Content Sections -->
        <div v-if="page.contentSections && page.contentSections.length">
          <StrapiContentRenderer
            v-for="(section, index) in page.contentSections"
            :key="`section-${section.id || index}`"
            :component="section"
          />
        </div>

        <!-- Fallback content if no sections -->
        <div v-else class="cms-page-content">
          <p>This page doesn't have any content sections yet.</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <SfHeading :level="2">Page not found</SfHeading>
        <p>The page you're looking for doesn't exist.</p>
        <SfButton @click="$router.push('/')">Go to Homepage</SfButton>
      </div>
    </SfLoader>
  </div>
</template>

<script>
import {
  SfHeading,
  SfLoader,
  SfButton,
} from '@storefront-ui/vue';
import { useFetch, ref, useRoute, useContext, computed } from '@nuxtjs/composition-api';
import useStrapi from '~/composables/useStrapi';
import StrapiContentRenderer from '~/components/Strapi/StrapiContentRenderer.vue';

export default {
  name: 'StrapiDynamicPage',
  components: {
    SfHeading,
    SfLoader,
    SfButton,
    StrapiContentRenderer,
  },
  setup() {
    const route = useRoute();
    const { app } = useContext();
    const { search, data: page, loading, error } = useStrapi('pages');

    useFetch(async () => {
      // For catch-all routes, Nuxt 2 uses `pathMatch`.
      const slug = route.value.params.pathMatch;
      if (!slug) return;
      
      await search({ slug: slug });

      // Set SEO meta tags
      if (page.value && page.value.seo) {
        app.head.title = page.value.seo.metaTitle || page.value.title;
        app.head.meta = [
          ...(app.head.meta || []),
          {
            hid: 'description',
            name: 'description',
            content: page.value.seo.metaDescription || page.value.title,
          },
          ...(page.value.seo.keywords ? [{
            hid: 'keywords',
            name: 'keywords',
            content: page.value.seo.keywords,
          }] : []),
        ];
      }
    });

    const getMetaDescription = computed(() => {
      if (!page.value) return '';
      return (page.value.seo && page.value.seo.metaDescription) || page.value.title || '';
    });

    return {
      page,
      loading,
      error,
      getMetaDescription,
    };
  },
  head() {
    if (!this.page) return {};

    const seo = this.page.seo || {};
    return {
      title: seo.metaTitle || this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: seo.metaDescription || this.page.title,
        },
        ...(seo.keywords ? [{
          hid: 'keywords',
          name: 'keywords',
          content: seo.keywords,
        }] : []),
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.loading {
  --loader-overlay-color: var(--c-light);
  --loader-spinner-color: var(--c-primary);
}

.section-header {
  margin: var(--spacer-2xl) 0 var(--spacer-xl) 0;
}

.cms-page-content {
  padding: var(--spacer-xl) 0;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacer-2xl) 0;
  text-align: center;
}
</style> 