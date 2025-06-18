<template>
  <SfHero class="hero">
    <SfHeroItem
      :style="heroStyle"
      :title="data.title"
      :subtitle="data.subtitle"
      :button-text="data.buttonText"
      :background="backgroundImage"
      @click:cta="handleCtaClick"
    />
  </SfHero>
</template>

<script>
import { SfHero } from '@storefront-ui/vue';

export default {
  name: 'StrapiHeroBanner',
  components: {
    SfHero,
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
    heroStyle() {
      return {
        '--hero-item-background-position': 'center center',
        '--hero-item-background-size': 'cover',
      };
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
.hero {
  margin: 0 calc(var(--spacer-sm) * -1);
  
  @media (min-width: 1024px) {
    margin: 0;
  }
  
  ::v-deep .sf-hero-item {
    min-height: 400px;
    
    @media (min-width: 1024px) {
      min-height: 500px;
    }
  }
}
</style> 