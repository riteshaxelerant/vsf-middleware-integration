<template>
  <div class="faq-section">
    <div class="container">
      <SfHeading
        v-if="data.sectionTitle"
        :level="2"
        :title="data.sectionTitle"
        class="section-heading"
      />
      
      <div v-if="data.faqs && data.faqs.length" class="faq-list">
        <SfAccordion
          v-for="faq in data.faqs"
          :key="faq.id"
          :open="false"
          :show-chevron="true"
          class="faq-item"
        >
          <SfAccordionItem
            :header="faq.title"
          >
            <div class="faq-answer" v-html="faq.summary" />
          </SfAccordionItem>
        </SfAccordion>
      </div>
    </div>
  </div>
</template>

<script>
import { SfAccordion, SfHeading } from '@storefront-ui/vue';

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
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
}

.faq-item {
  border: 1px solid var(--c-light);
  border-radius: var(--border-radius);
  
  ::v-deep .sf-accordion-item {
    &__header {
      padding: var(--spacer-base);
      font-weight: var(--font-weight--semibold);
      background: var(--c-white);
      
      &:hover {
        background: var(--c-light);
      }
    }
    
    &__content {
      padding: var(--spacer-base);
      border-top: 1px solid var(--c-light);
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