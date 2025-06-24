<template>
  <div class="faq-section">
    <div class="container">
      <SfHeading
        v-if="data.sectionTitle"
        :level="2"
        :title="data.sectionTitle"
        class="section-heading"
      />
      
      <SfAccordion v-if="data.faqs && data.faqs.length" v-model="open" :multiple="true" class="faq-list">
        <SfAccordionItem
          v-for="faq in data.faqs"
          :key="faq.id"
          :header="faq.title"
        >
          <div class="faq-answer" v-html="faq.summary" />
        </SfAccordionItem>
      </SfAccordion>
    </div>
  </div>
</template>

<script>
import { SfAccordion, SfHeading } from '@storefront-ui/vue';
import { ref } from '@nuxtjs/composition-api';

export default {
  name: 'StrapiFaqSection',
  components: {
    SfAccordion,
    SfHeading,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const open = ref([]);
    return { open };
  },
};
</script>

<style lang="scss" scoped>
.faq-section {
  padding: var(--spacer-xl) 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacer-base);
}

.section-heading {
  text-align: center;
  margin-bottom: var(--spacer-xl);
}

.faq-list {
  ::v-deep .sf-accordion-item {
    &__header {
      padding: var(--spacer-base);
      font-weight: var(--font-weight--semibold);
      background: var(--c-white);
      border: 1px solid var(--c-light);
      border-radius: var(--border-radius);
      margin-bottom: var(--spacer-sm);
      
      &:hover {
        background: var(--c-light);
      }
    }
    
    &__content {
      padding: var(--spacer-base);
      border: 1px solid var(--c-light);
      border-top: none;
      border-radius: 0 0 var(--border-radius) var(--border-radius);
      margin-top: calc(-1 * var(--spacer-sm));
      margin-bottom: var(--spacer-sm);
    }
  }
}

.faq-answer {
  line-height: 1.6;
  color: var(--c-text-muted);
  
  ::v-deep {
    p {
      margin: var(--spacer-xs) 0;
    }
    
    a {
      color: var(--c-primary);
      text-decoration: underline;
    }
  }
}
</style> 