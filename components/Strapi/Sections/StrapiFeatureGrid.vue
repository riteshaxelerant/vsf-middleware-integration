<template>
  <div class="feature-grid-section">
    <div class="container">
      <SfHeading
        v-if="data.sectionTitle"
        :level="2"
        :title="data.sectionTitle"
        class="section-heading"
      />
      
      <div v-if="data.features && data.features.length" class="features-grid">
        <div
          v-for="feature in data.features"
          :key="feature.id"
          class="feature-card"
        >
          <div class="feature-icon">
            <SfImage
              v-if="feature.icon && feature.icon.url"
              :src="getStrapiImageUrl(feature.icon.url)"
              :alt="feature.title"
              width="64"
              height="64"
            />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
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
  background: var(--c-white);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.feature-icon {
  margin-bottom: var(--spacer-base);
  
  img {
    border-radius: var(--border-radius);
  }
}

.feature-title {
  font-size: var(--font-size--lg);
  font-weight: var(--font-weight--semibold);
  margin-bottom: var(--spacer-sm);
  color: var(--c-text);
}

.feature-description {
  line-height: 1.6;
  color: var(--c-text-muted);
  margin: 0;
}
</style> 