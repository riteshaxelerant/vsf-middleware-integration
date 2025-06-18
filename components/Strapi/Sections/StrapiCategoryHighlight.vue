<template>
  <div class="category-highlight-section">
    <div class="container">
      <SfHeading
        v-if="data.title"
        :level="2"
        :title="data.title"
        class="section-heading"
      />
      
      <div v-if="data.categories && data.categories.length" class="categories-grid">
        <div
          v-for="category in data.categories"
          :key="category.id"
          class="category-card"
          @click="handleCategoryClick(category)"
        >
          <div v-if="getCategoryImage(category)" class="category-image">
            <SfImage
              :src="getCategoryImage(category)"
              :alt="category.title"
              :width="300"
              :height="200"
              class="card-image"
            />
          </div>
          
          <div class="category-content">
            <SfHeading
              :level="3"
              :title="category.title"
              class="category-title"
            />
            
            <p v-if="category.description" class="category-description">
              {{ category.description }}
            </p>
            
            <SfButton
              v-if="category.link"
              class="sf-button--text category-link"
              @click.stop="handleCategoryClick(category)"
            >
              Explore →
            </SfButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfImage, SfButton } from '@storefront-ui/vue';

export default {
  name: 'StrapiCategoryHighlight',
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
    getCategoryImage(category) {
      if (!category.image || !category.image.url) return '';
      return this.getStrapiImageUrl(category.image.url);
    },
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
    grid-template-columns: repeat(3, 1fr);
  }
}

.category-card {
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

.category-image {
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .category-card:hover & {
    transform: scale(1.05);
  }
}

.category-content {
  padding: var(--spacer-base);
}

.category-title {
  margin-bottom: var(--spacer-sm);
  
  ::v-deep .sf-heading__title {
    font-size: var(--font-size--lg);
    font-weight: var(--font-weight--semibold);
  }
}

.category-description {
  color: var(--c-text-muted);
  line-height: 1.5;
  margin-bottom: var(--spacer-base);
}

.category-link {
  --button-color: var(--c-primary);
  padding: 0;
  font-weight: var(--font-weight--medium);
}
</style> 