<template>
  <div class="feature-grid-section">
    <div class="container">
      <SfHeading
        v-if="data.title"
        :level="2"
        :title="data.title"
        class="section-heading"
      />
      
      <div v-if="data.features && data.features.length" class="features-grid">
        <div
          v-for="feature in data.features"
          :key="feature.id"
          class="feature-card"
        >
          <div class="feature-icon" v-if="getFeatureIcon(feature)">
            <SfImage
              :src="getFeatureIcon(feature)"
              :alt="feature.title"
              :width="64"
              :height="64"
              class="icon-image"
            />
          </div>
          
          <SfHeading
            :level="3"
            :title="feature.title"
            class="feature-title"
          />
          
          <p v-if="feature.description" class="feature-description">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfImage } from '@storefront-ui/vue';

export default {
  name: 'StrapiFeatureGrid',
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
    getFeatureIcon(feature) {
      if (!feature.icon || !feature.icon.url) return '';
      return this.getStrapiImageUrl(feature.icon.url);
    },
    getStrapiImageUrl(url) {
      if (url.startsWith('http')) return url;
      return `${process.env.VSF_STRAPI_API_URL || 'http://localhost:1337'}${url}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.feature-grid-section {
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

.features-grid {
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

.feature-card {
  text-align: center;
  padding: var(--spacer-lg);
  border-radius: var(--border-radius);
  background: var(--c-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.feature-icon {
  margin-bottom: var(--spacer-base);
  display: flex;
  justify-content: center;
}

.icon-image {
  border-radius: var(--border-radius);
  object-fit: contain;
}

.feature-title {
  margin-bottom: var(--spacer-base);
  
  ::v-deep .sf-heading__title {
    font-size: var(--font-size--lg);
    font-weight: var(--font-weight--semibold);
  }
}

.feature-description {
  color: var(--c-text-muted);
  line-height: 1.6;
  margin: 0;
}
</style> 