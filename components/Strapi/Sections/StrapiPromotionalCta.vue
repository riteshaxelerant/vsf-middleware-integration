<template>
  <div class="promotional-cta">
    <SfCallToAction
      :title="data.title"
      :description="data.description"
      :button-text="data.buttonText"
      :image="backgroundImage"
      :image-width="1200"
      :image-height="400"
      class="cta-component"
      @click="handleCtaClick"
    />
  </div>
</template>

<script>
import { SfCallToAction } from '@storefront-ui/vue';

export default {
  name: 'StrapiPromotionalCta',
  components: {
    SfCallToAction,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    backgroundImage() {
      if (!this.data.backgroundImage || !this.data.backgroundImage.url) return '';
      return this.getStrapiImageUrl(this.data.backgroundImage.url);
    },
  },
  methods: {
    getStrapiImageUrl(url) {
      if (url.startsWith('http')) return url;
      return `${process.env.VSF_STRAPI_API_URL || 'http://localhost:1337'}${url}`;
    },
    handleCtaClick() {
      if (this.data.buttonUrl) {
        if (this.data.buttonUrl.startsWith('http')) {
          window.open(this.data.buttonUrl, '_blank');
        } else {
          this.$router.push(this.data.buttonUrl);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.promotional-cta {
  margin: var(--spacer-xl) 0;
}

.cta-component {
  ::v-deep .sf-call-to-action {
    &__text-container {
      padding: var(--spacer-xl);
    }
    
    &__title {
      font-size: var(--font-size--lg);
      margin-bottom: var(--spacer-base);
    }
    
    &__description {
      margin-bottom: var(--spacer-lg);
      line-height: 1.6;
    }
    
    &__button {
      --button-padding: var(--spacer-sm) var(--spacer-lg);
    }
  }
}
</style> 