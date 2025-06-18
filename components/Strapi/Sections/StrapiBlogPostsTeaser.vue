<template>
  <div class="blog-posts-teaser">
    <div class="container">
      <SfHeading
        v-if="data.title"
        :level="2"
        :title="data.title"
        class="section-heading"
      />
      
      <div v-if="data.articles && data.articles.length" class="articles-grid">
        <article
          v-for="article in data.articles"
          :key="article.id"
          class="article-card"
          @click="navigateToArticle(article.slug)"
        >
          <div v-if="article.cover" class="article-image">
            <SfImage
              :src="getStrapiImageUrl(article.cover.url)"
              :alt="article.cover.alternativeText || article.title"
              :width="400"
              :height="250"
              class="cover-image"
            />
          </div>
          
          <div class="article-content">
            <SfHeading
              :level="3"
              :title="article.title"
              class="article-title"
            />
            
            <p v-if="article.description" class="article-description">
              {{ article.description }}
            </p>
            
            <div class="article-meta">
              <span v-if="article.author" class="author">
                By {{ article.author.name }}
              </span>
              <span v-if="article.publishedAt" class="date">
                {{ formatDate(article.publishedAt) }}
              </span>
            </div>
            
            <SfButton
              class="sf-button--text read-more-btn"
              @click.stop="navigateToArticle(article.slug)"
            >
              Read More
            </SfButton>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfImage, SfButton } from '@storefront-ui/vue';

export default {
  name: 'StrapiBlogPostsTeaser',
  components: {
    SfHeading,
    SfImage,
    SfButton,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getStrapiImageUrl(url) {
      if (url.startsWith('http')) return url;
      return `${process.env.VSF_STRAPI_API_URL || 'http://localhost:1337'}${url}`;
    },
    navigateToArticle(slug) {
      this.$router.push(`/blog/${slug}`);
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-posts-teaser {
  padding: var(--spacer-xl) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacer-base);
}

.section-heading {
  text-align: center;
  margin-bottom: var(--spacer-xl);
}

.articles-grid {
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

.article-card {
  background: var(--c-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.article-image {
  position: relative;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .article-card:hover & {
    transform: scale(1.05);
  }
}

.article-content {
  padding: var(--spacer-base);
}

.article-title {
  margin-bottom: var(--spacer-sm);
  
  ::v-deep .sf-heading__title {
    font-size: var(--font-size--lg);
    font-weight: var(--font-weight--semibold);
    line-height: 1.3;
  }
}

.article-description {
  color: var(--c-text-muted);
  line-height: 1.5;
  margin-bottom: var(--spacer-base);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
  margin-bottom: var(--spacer-base);
  font-size: var(--font-size--sm);
  color: var(--c-text-muted);
}

.read-more-btn {
  --button-color: var(--c-primary);
  padding: 0;
  font-weight: var(--font-weight--medium);
}
</style> 