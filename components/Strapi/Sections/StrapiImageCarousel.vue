<template>
  <div class="image-carousel-section">
    <div class="container">
      <div v-if="data.images && data.images.length" class="carousel-wrapper">
        <SfCarousel
          v-if="mounted"
          :settings="carouselSettings"
          class="image-carousel"
        >
          <SfCarouselItem
            v-for="(image, index) in data.images"
            :key="index"
            class="carousel-item"
          >
            <SfImage
              :src="getStrapiImageUrl(image.url)"
              :alt="image.alternativeText || `Image ${index + 1}`"
              width="800"
              height="400"
              class="carousel-image"
            />
          </SfCarouselItem>
        </SfCarousel>
      </div>
    </div>
  </div>
</template>

<script>
import { SfCarousel, SfImage } from '@storefront-ui/vue';
import { onMounted, ref } from '@nuxtjs/composition-api';

export default {
  name: 'StrapiImageCarousel',
  components: {
    SfCarousel,
    SfImage,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      carouselSettings: {
        autoplay: false,
        interval: 5000,
        rewind: true,
        gap: 0,
      },
    };
  },
  setup() {
    const mounted = ref(false);

    onMounted(() => {
      mounted.value = true;
    });

    return {
      mounted,
    };
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
  padding: var(--spacer-lg) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacer-base);
}

.carousel-wrapper {
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-carousel {
  width: 100%;
  
  ::v-deep .sf-carousel__wrapper {
    height: 400px;
  }
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 