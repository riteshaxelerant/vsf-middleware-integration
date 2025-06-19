<template>
  <div class="category-highlight-section">
    <div class="container">
      <SfHeading
        v-if="data.sectionTitle"
        :level="2"
        :title="data.sectionTitle"
        class="section-heading"
      />
      
      <div v-if="data.categories && data.categories.length" class="categories-grid">
        <div
          v-for="category in data.categories"
          :key="category.id"
          class="category-card"
          @click="handleCategoryClick(category)"
        >
          <div class="category-image">
            <SfImage
              v-if="category.image && category.image.url"
              :src="getStrapiImageUrl(category.image.url)"
              :alt="category.image.alternativeText || category.name"
              width="300"
              height="200"
              class="category-thumbnail"
            />
          </div>
          
          <div class="category-content">
            <h3 class="category-name">{{ category.name }}</h3>
            <p v-if="category.description" class="category-description">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfImage } from '@storefront-ui/vue';

export default {
  name: 'StrapiCategoryHighlight',
  components: {
    SfHeading,
    SfImage,
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
    handleCategoryClick(category) {
      if (category.link) {
        if (category.link.startsWith('http')) {
          window.open(category.link, '_blank');
        } else {
          this.$router.push(category.link);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.category-highlight-section {
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

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.category-card {
  background: var(--c-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.category-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.category-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-content {
  padding: var(--spacer-base);
}

.category-name {
  font-size: var(--font-size--base);
  font-weight: var(--font-weight--semibold);
  margin-bottom: var(--spacer-xs);
  color: var(--c-text);
}

.category-description {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 