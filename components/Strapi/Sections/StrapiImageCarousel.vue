<template>
  <div class="image-carousel-section">
    <div class="container">
      <div v-if="data.images && data.images.length" class="images-grid">
        <div
          v-for="(image, index) in data.images"
          :key="image.id || index"
          class="image-item"
        >
          <SfImage
            :src="getStrapiImageUrl(image.url)"
            :alt="image.alternativeText || `Gallery image ${index + 1}`"
            :width="400"
            :height="300"
            class="gallery-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfImage } from '@storefront-ui/vue';

export default {
  name: 'StrapiImageCarousel',
  components: {
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
.image-carousel-section {
  padding: var(--spacer-xl) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacer-base);
}

.images-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-base);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.image-item {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.gallery-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .image-item:hover & {
    transform: scale(1.05);
  }
}
</style> 