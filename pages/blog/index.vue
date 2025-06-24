<template>
  <div class="blog-list-page">
    <div class="container">
      <SfHeading
        title="Our Blog"
        :level="1"
        class="page-title"
      />
      <p class="page-subtitle">
        Stay up to date with the latest trends, news, and stories.
      </p>

      <SfLoader :loading="loading && !articles.length">
        <div class="posts-grid">
          <article
            v-for="post in articles"
            :key="post.id"
            class="post-card"
          >
            <nuxt-link :to="`/default/blog/${post.slug}`" class="post-link-wrapper">
              <div class="post-image">
                <SfImage
                  v-if="post.image && post.image.url"
                  :src="post.image.url"
                  :alt="post.image.alternativeText || post.title"
                  :width="300"
                  :height="200"
                  class="post-thumbnail"
                />
                <div v-if="post.category" class="post-category">
                  {{ post.category.name }}
                </div>
              </div>
              <div class="post-content">
                <p class="post-meta">
                  <span v-if="post.author">{{ post.author.name }}</span>
                  <span v-if="post.author && post.publishedAt"> | </span>
                  <span v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
                </p>
                <h3 class="post-title">{{ post.title }}</h3>
              </div>
            </nuxt-link>
            <div class="post-content-bottom">
              <p v-if="post.description" class="post-excerpt">{{ post.description }}</p>
              <SfButton
                :link="`/default/blog/${post.slug}`"
                class="sf-button--text post-read-more"
              >
                Read More
              </SfButton>
            </div>
          </article>
        </div>
      </SfLoader>

      <div class="load-more-container">
        <SfButton
          v-if="canLoadMore"
          class="load-more-button"
          :disabled="loading"
          @click="loadMore()"
        >
          <SfLoader v-if="loading" :class="{ 'loader-absolute': true }" />
          Load More
        </SfButton>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from '@nuxtjs/composition-api';
import { SfHeading, SfImage, SfButton, SfLoader } from '@storefront-ui/vue';
import { useStrapiArticles } from '~/composables/useStrapi/articles';

export default {
  name: 'BlogListPage',
  components: {
    SfHeading,
    SfImage,
    SfButton,
    SfLoader,
  },
  setup() {
    const { search, loadMore, articles, meta, loading, error } = useStrapiArticles();
    const canLoadMore = computed(() => meta.value && articles.value.length < meta.value.pagination.total);

    onMounted(() => search({ limit: 6 }));

    return {
      articles,
      loading,
      error,
      loadMore,
      canLoadMore,
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// Reusing styles from StrapiBlogPostsTeaser and adding page specific styles
.blog-list-page {
  padding: var(--spacer-xl) 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacer-base);
}
.page-title {
  text-align: center;
  margin-bottom: var(--spacer-sm);
}
.page-subtitle {
  text-align: center;
  margin-bottom: var(--spacer-2xl);
  color: var(--c-text-muted);
  font-size: var(--font-size--lg);
}
.posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
.post-card {
  background: var(--c-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
  }
}
.post-link-wrapper {
  text-decoration: none;
  color: inherit;
}
.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}
.post-category {
  position: absolute;
  bottom: var(--spacer-sm);
  left: var(--spacer-sm);
  background: var(--c-primary);
  color: var(--c-white);
  padding: var(--spacer-2xs) var(--spacer-xs);
  border-radius: var(--border-radius);
  font-size: var(--font-size--xs);
  font-weight: var(--font-weight--medium);
  text-transform: uppercase;
}
.post-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post-content {
  padding: var(--spacer-lg) var(--spacer-lg) 0;
}
.post-meta {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
  margin-bottom: var(--spacer-xs);
}
.post-content-bottom {
  padding: 0 var(--spacer-lg) var(--spacer-lg);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}
.post-title {
  font-size: var(--font-size--lg);
  font-weight: var(--font-weight--semibold);
  margin-bottom: var(--spacer-sm);
  color: var(--c-text);
}
.post-excerpt {
  color: var(--c-text-muted);
  line-height: 1.6;
  margin-bottom: var(--spacer-base);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}
.post-read-more {
  margin-top: var(--spacer-sm);
  align-self: flex-start;
}
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacer-xl);
}
</style> 