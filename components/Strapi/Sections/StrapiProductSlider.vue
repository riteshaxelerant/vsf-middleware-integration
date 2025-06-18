<template>
  <div class="product-slider-section">
    <div class="container">
      <SfHeading
        v-if="data.title"
        :level="2"
        :title="data.title"
        class="section-heading"
      />
      
      <div class="placeholder-content">
        <p>Product Slider Component - Ready for Magento product integration</p>
        <p>This component will display products from your Magento catalog.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading } from '@storefront-ui/vue';

export default {
  name: 'StrapiProductSlider',
  components: {
    SfHeading,
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