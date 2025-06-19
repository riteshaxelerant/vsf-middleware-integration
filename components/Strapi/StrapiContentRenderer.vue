<template>
  <div class="strapi-content-section">
    <!-- Hero Banner -->
    <StrapiHeroBanner 
      v-if="component.__typename === 'ComponentSectionsHeroBanner'" 
      :data="component" 
    />
    
    <!-- Product Slider -->
    <StrapiProductSlider 
      v-else-if="component.__typename === 'ComponentSectionsProductSlider'" 
      :data="component" 
    />
    
    <!-- Testimonials -->
    <StrapiTestimonials 
      v-else-if="component.__typename === 'ComponentSectionsTestimonials'" 
      :data="component" 
    />
    
    <!-- FAQ Section -->
    <StrapiFaqSection 
      v-else-if="component.__typename === 'ComponentSectionsFaqSection'" 
      :data="component" 
    />
    
    <!-- Blog Posts Teaser -->
    <StrapiBlogPostsTeaser 
      v-else-if="component.__typename === 'ComponentSectionsBlogPostsTeaser'" 
      :data="component" 
    />
    
    <!-- Rich Text Block -->
    <StrapiRichTextBlock 
      v-else-if="component.__typename === 'ComponentSectionsRichTextBlock'" 
      :data="component" 
    />
    
    <!-- Promotional CTA -->
    <StrapiPromotionalCta 
      v-else-if="component.__typename === 'ComponentSectionsPromotionalCta'" 
      :data="component" 
    />
    
    <!-- Category Highlight -->
    <StrapiCategoryHighlight 
      v-else-if="component.__typename === 'ComponentSectionsCategoryHighlight'" 
      :data="component" 
    />
    
    <!-- Image Carousel -->
    <StrapiImageCarousel 
      v-else-if="component.__typename === 'ComponentSectionsImageCarousel'" 
      :data="component" 
    />
    
    <!-- Feature Grid -->
    <StrapiFeatureGrid 
      v-else-if="component.__typename === 'ComponentSectionsFeatureGrid'" 
      :data="component" 
    />
    
    <!-- Category Card (as standalone section) -->
    <StrapiCategoryCard 
      v-else-if="component.__typename === 'ComponentSharedCategoryCard'" 
      :data="component" 
    />
    
    <!-- Fallback for unknown components -->
    <div v-else class="unknown-component">
      <p>Unknown component type: {{ component.__typename || 'No typename' }}</p>
      <details>
        <summary>Debug Data</summary>
        <pre>{{ JSON.stringify(component, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script>
// Import all Strapi component renderers
import StrapiHeroBanner from './Sections/StrapiHeroBanner.vue';
import StrapiProductSlider from './Sections/StrapiProductSlider.vue';
import StrapiTestimonials from './Sections/StrapiTestimonials.vue';
import StrapiFaqSection from './Sections/StrapiFaqSection.vue'; 
import StrapiBlogPostsTeaser from './Sections/StrapiBlogPostsTeaser.vue';
import StrapiRichTextBlock from './Sections/StrapiRichTextBlock.vue';
import StrapiPromotionalCta from './Sections/StrapiPromotionalCta.vue';
import StrapiCategoryHighlight from './Sections/StrapiCategoryHighlight.vue';
import StrapiImageCarousel from './Sections/StrapiImageCarousel.vue';
import StrapiFeatureGrid from './Sections/StrapiFeatureGrid.vue';
import StrapiCategoryCard from './Shared/StrapiCategoryCard.vue';

export default {
  name: 'StrapiContentRenderer',
  components: {
    StrapiHeroBanner,
    StrapiProductSlider,
    StrapiTestimonials,
    StrapiFaqSection,
    StrapiBlogPostsTeaser,
    StrapiRichTextBlock,
    StrapiPromotionalCta,
    StrapiCategoryHighlight,
    StrapiImageCarousel,
    StrapiFeatureGrid,
    StrapiCategoryCard,
  },
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.strapi-content-section {
  margin-bottom: var(--spacer-xl);
}

.unknown-component {
  padding: var(--spacer-lg);
  background-color: var(--c-light);
  border: 1px dashed var(--c-gray);
  border-radius: var(--border-radius);
  
  details {
    margin-top: var(--spacer-sm);
  }
  
  pre {
    background: var(--c-white);
    padding: var(--spacer-sm);
    border-radius: var(--border-radius);
    overflow: auto;
    font-size: var(--font-size--xs);
  }
}
</style> 