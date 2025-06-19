<template>
  <div class="promotional-cta">
    <div class="container">
      <div class="cta-content">
        <SfHeading
          v-if="data.title"
          :level="2"
          :title="data.title"
          class="cta-heading"
        />
        
        <p v-if="data.body" class="cta-description">
          {{ data.body }}
        </p>
        
        <SfButton
          v-if="data.buttonText && data.buttonUrl"
          class="cta-button"
          @click="handleButtonClick"
        >
          {{ data.buttonText }}
        </SfButton>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfButton } from '@storefront-ui/vue';

export default {
  name: 'StrapiPromotionalCta',
  components: {
    SfHeading,
    SfButton,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleButtonClick() {
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
  padding: var(--spacer-2xl) 0;
  background: var(--c-primary);
  color: var(--c-white);
  text-align: center;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 var(--spacer-base);
}

.cta-heading {
  margin-bottom: var(--spacer-lg);
  
  ::v-deep .sf-heading__title {
    color: var(--c-white);
  }
}

.cta-description {
  font-size: var(--font-size--lg);
  line-height: 1.6;
  margin-bottom: var(--spacer-xl);
  opacity: 0.9;
}

.cta-button {
  --button-background: var(--c-white);
  --button-color: var(--c-primary);
  
  &:hover {
    --button-background: var(--c-light);
  }
}
</style> 