<template>
  <div>
    <SfLoader :class="{ loading }" :loading="loading">
      <div v-if="article">
        <!-- Article Header -->
        <div class="article-header">
          <SfHeading
            :level="1"
            class="sf-heading--no-underline article-title"
          >
            {{ article.title }}
          </SfHeading>
          
          <div class="article-meta">
            <div v-if="article.author" class="article-author">
              By {{ article.author.name }}
            </div>
            <div v-if="article.category" class="article-category">
              in {{ article.category.name }}
            </div>
            <div v-if="article.publishedAt" class="article-date">
              {{ formatDate(article.publishedAt) }}
            </div>
          </div>
          
          <div v-if="article.description" class="article-description">
            {{ article.description }}
          </div>
        </div>

        <!-- Cover Image -->
        <div v-if="article.cover" class="article-cover">
          <SfImage
            :src="getStrapiImageUrl(article.cover.url)"
            :alt="article.cover.alternativeText || article.title"
            :width="800"
            :height="400"
            class="article-cover-image"
          />
        </div>

        <!-- Article Content Blocks -->
        <div v-if="article.blocks && article.blocks.length" class="article-content">
          <StrapiArticleBlockRenderer
            v-for="(block, index) in article.blocks"
            :key="`block-${block.id || index}`"
            :block="block"
          />
        </div>

        <!-- Article Footer -->
        <div class="article-footer">
          <div v-if="article.category" class="article-category-link">
            <SfButton
              class="color-secondary"
              @click="$router.push(`/blog/category/${article.category.slug}`)"
            >
              More articles in {{ article.category.name }}
            </SfButton>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <SfHeading :level="2">Article not found</SfHeading>
        <p>The article you're looking for doesn't exist.</p>
        <SfButton @click="$router.push('/blog')">Go to Blog</SfButton>
      </div>
    </SfLoader>
  </div>
</template>

<script>
import {
  SfHeading,
  SfLoader,
  SfButton,
  SfImage,
} from '@storefront-ui/vue';
import { useFetch, ref, useRoute, useContext } from '@nuxtjs/composition-api';
import useStrapi from '~/composables/useStrapi';
import StrapiArticleBlockRenderer from '~/components/Strapi/StrapiArticleBlockRenderer.vue';

export default {
  name: 'StrapiArticlePage',
  components: {
    SfHeading,
    SfLoader,
    SfButton,
    SfImage,
    StrapiArticleBlockRenderer,
  },
  setup() {
    const route = useRoute();
    const { app } = useContext();
    const { search, data: article, loading, error } = useStrapi('articles');

    useFetch(async () => {
      if (!route.value.params.slug) return;
      
      await search({ slug: route.value.params.slug });

      // Set SEO meta tags
      if (article.value) {
        app.head.title = article.value.title;
        app.head.meta = [
          ...(app.head.meta || []),
          {
            hid: 'description',
            name: 'description',
            content: article.value.description || article.value.title,
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: article.value.title,
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content: article.value.description || article.value.title,
          },
          ...(article.value.cover ? [{
            hid: 'og:image',
            property: 'og:image',
            content: getStrapiImageUrl(article.value.cover.url),
          }] : []),
        ];
      }
    });

    // Helper functions
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const getStrapiImageUrl = (url) => {
      if (url.startsWith('http')) return url;
      return `${process.env.VSF_STRAPI_API_URL || 'http://localhost:1337'}${url}`;
    };

    return {
      article,
      loading,
      error,
      formatDate,
      getStrapiImageUrl,
    };
  },
  head() {
    if (!this.article) return {};

    return {
      title: this.article.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description || this.article.title,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.article.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.article.description || this.article.title,
        },
        ...(this.article.cover ? [{
          hid: 'og:image',
          property: 'og:image',
          content: this.getStrapiImageUrl(this.article.cover.url),
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

.article-header {
  margin-bottom: var(--spacer-xl);
}

.article-title {
  margin-bottom: var(--spacer-lg);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);
  margin-bottom: var(--spacer-lg);
  font-size: var(--font-size--sm);
  color: var(--c-text-muted);
  
  > div:not(:last-child)::after {
    content: '•';
    margin-left: var(--spacer-sm);
  }
}

.article-description {
  font-size: var(--font-size--lg);
  color: var(--c-text-muted);
  margin-bottom: var(--spacer-xl);
}

.article-cover {
  margin-bottom: var(--spacer-xl);
}

.article-cover-image {
  width: 100%;
  height: auto;
  border-radius: var(--border-radius);
}

.article-content {
  margin-bottom: var(--spacer-2xl);
}

.article-footer {
  padding-top: var(--spacer-xl);
  border-top: 1px solid var(--c-light);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacer-2xl) 0;
  text-align: center;
}
</style> 