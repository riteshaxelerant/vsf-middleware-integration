<template>
  <div class="testimonials-section">
    <div class="container">
      <SfHeading
        v-if="data.sectionTitle"
        :level="2"
        :title="data.sectionTitle"
        class="section-heading"
      />
      
      <div v-if="data.items && data.items.length" class="testimonials-grid">
        <div
          v-for="testimonial in data.items"
          :key="testimonial.id"
          class="testimonial-card"
        >
          <div class="testimonial-content">
            <SfIcon
              icon="quote"
              class="quote-icon"
              size="24px"
            />
            <p class="testimonial-message">{{ testimonial.quote }}</p>
            <div class="testimonial-author">
              <SfImage
                v-if="testimonial.authorImage && testimonial.authorImage.url"
                :src="getStrapiImageUrl(testimonial.authorImage.url)"
                :alt="testimonial.authorName"
                class="author-avatar"
                width="48"
                height="48"
              />
              <div class="author-info">
                <h4 class="author-name">{{ testimonial.authorName }}</h4>
                <p v-if="testimonial.authorTitle" class="author-title">{{ testimonial.authorTitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfImage, SfIcon } from '@storefront-ui/vue';

export default {
  name: 'StrapiTestimonials',
  components: {
    SfHeading,
    SfImage,
    SfIcon,
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
.testimonials-section {
  padding: var(--spacer-xl) 0;
  background: var(--c-light);
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

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.testimonial-card {
  background: var(--c-white);
  border-radius: var(--border-radius);
  padding: var(--spacer-lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.testimonial-content {
  text-align: center;
}

.quote-icon {
  color: var(--c-primary);
  margin-bottom: var(--spacer-base);
}

.testimonial-message {
  font-style: italic;
  font-size: var(--font-size--base);
  line-height: 1.6;
  margin-bottom: var(--spacer-lg);
  color: var(--c-text);
}

.testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacer-sm);
}

.author-avatar {
  border-radius: 50%;
  flex-shrink: 0;
}

.author-info {
  text-align: left;
}

.author-name {
  font-weight: var(--font-weight--semibold);
  font-size: var(--font-size--base);
  margin: 0;
  color: var(--c-text);
}

.author-title {
  font-size: var(--font-size--sm);
  color: var(--c-text-muted);
  margin: 0;
}
</style> 