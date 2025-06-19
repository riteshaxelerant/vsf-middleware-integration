<template>
  <div class="product-slider-section">
    <div class="container">
      <SfHeading
        v-if="data.title"
        :level="2"
        :title="data.title"
        class="section-heading"
      />
      
      <SfCarousel
        v-if="data.slides && data.slides.length"
        class="product-carousel"
        :settings="{
          type: 'carousel',
          perView: 4,
          breakpoints: {
            1023: { perView: 2 },
            767: { perView: 1 }
          }
        }"
      >
        <SfCarouselItem v-for="(slide, i) in data.slides" :key="i">
          <div class="product-card">
            <nuxt-link :to="slide.link">
              <SfImage
                :src="slide.image.url"
                :alt="slide.image.alternativeText"
                :width="200"
                :height="200"
                class="product-image"
              />
              <h3 class="product-name">{{ slide.name }}</h3>
            </nuxt-link>
          </div>
        </SfCarouselItem>
      </SfCarousel>

      <div v-else class="placeholder-content">
        <p>No products to display in this slider.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfCarousel, SfImage } from '@storefront-ui/vue';

export default {
  name: 'StrapiProductSlider',
  components: {
    SfHeading,
    SfCarousel,
    SfImage,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.product-slider-section {
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

.product-carousel {
  margin: 0 - var(--spacer-sm);
  --carousel-item-padding: var(--spacer-sm);
}

.product-card {
  text-align: center;
}

.product-image {
  border-radius: var(--border-radius);
  margin-bottom: var(--spacer-sm);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.product-name {
  font-family: var(--font-family--secondary);
  font-weight: var(--font-weight--normal);
  font-size: var(--font-size--base);
  color: var(--c-text);
  margin: 0;
}

.placeholder-content {
  text-align: center;
  padding: var(--spacer-xl);
  background: var(--c-light);
  border-radius: var(--border-radius);
  
  p {
    margin: var(--spacer-xs) 0;
    color: var(--c-text-muted);
  }
}
</style> 