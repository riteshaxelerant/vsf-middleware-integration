<template>
  <div class="category-card-wrapper">
    <div class="category-card" @click="handleCardClick">
      <div v-if="getCategoryImage()" class="card-image">
        <SfImage
          :src="getCategoryImage()"
          :alt="data.title"
          :width="300"
          :height="200"
          class="image"
        />
      </div>
      
      <div class="card-content">
        <SfHeading
          :level="3"
          :title="data.title"
          class="card-title"
        />
        
        <p v-if="data.description" class="card-description">
          {{ data.description }}
        </p>
        
        <SfButton
          v-if="data.link"
          class="sf-button--text card-link"
          @click.stop="handleCardClick"
        >
          Learn More →
        </SfButton>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfImage, SfButton } from '@storefront-ui/vue';

export default {
  name: 'StrapiCategoryCard',
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
    getCategoryImage() {
      if (!this.data.image || !this.data.image.url) return '';
      return this.getStrapiImageUrl(this.data.image.url);
    },
    getStrapiImageUrl(url) {
      if (url.startsWith('http')) return url;
      return `${process.env.VSF_STRAPI_API_URL || 'http://localhost:1337'}${url}`;
    },
    handleCardClick() {
      if (this.data.link) {
        if (this.data.link.startsWith('http')) {
          window.open(this.data.link, '_blank');
        } else {
          this.$router.push(this.data.link);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.category-card-wrapper {
  margin: var(--spacer-lg) 0;
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

.card-image {
  position: relative;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .category-card:hover & {
    transform: scale(1.05);
  }
}

.card-content {
  padding: var(--spacer-base);
}

.card-title {
  margin-bottom: var(--spacer-sm);
  
  ::v-deep .sf-heading__title {
    font-size: var(--font-size--lg);
    font-weight: var(--font-weight--semibold);
  }
}

.card-description {
  color: var(--c-text-muted);
  line-height: 1.5;
  margin-bottom: var(--spacer-base);
}

.card-link {
  --button-color: var(--c-primary);
  padding: 0;
  font-weight: var(--font-weight--medium);
}
</style>