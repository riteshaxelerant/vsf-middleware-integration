<template>
  <div class="strapi-article-block">
    <!-- Media Block -->
    <div 
      v-if="block.__typename === 'ComponentSharedMedia'" 
      class="media-block"
    >
      <SfImage
        :src="getStrapiImageUrl(block.file.url)"
        :alt="block.file.alternativeText || block.file.name"
        :width="800"
        :height="450"
        class="media-image"
      />
      <p v-if="block.file.caption" class="media-caption">
        {{ block.file.caption }}
      </p>
    </div>

    <!-- Quote Block -->
    <div 
      v-else-if="block.__typename === 'ComponentSharedQuote'" 
      class="quote-block"
    >
      <SfHeading
        v-if="block.title"
        :level="3"
        :title="block.title"
        class="quote-title"
      />
      <blockquote class="quote-content">
        {{ block.body }}
      </blockquote>
    </div>

    <!-- Rich Text Block -->
    <div 
      v-else-if="block.__typename === 'ComponentSharedRichText'" 
      class="rich-text-block"
    >
      <div 
        class="rich-text-content"
        v-html="processedRichText"
      />
    </div>

    <!-- Slider Block -->
    <div 
      v-else-if="block.__typename === 'ComponentSharedSlider'" 
      class="slider-block"
    >
      <div v-if="block.files && block.files.length" class="slider-gallery">
        <div class="gallery-grid">
          <div
            v-for="(file, index) in block.files"
            :key="file.documentId || index"
            class="gallery-item"
          >
            <SfImage
              :src="getStrapiImageUrl(file.url)"
              :alt="file.alternativeText || file.name"
              :width="400"
              :height="300"
              class="gallery-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback for unknown block types -->
    <div v-else class="unknown-block">
      <p>Unknown block type: {{ block.__typename || 'No typename' }}</p>
      <details>
        <summary>Debug Data</summary>
        <pre>{{ JSON.stringify(block, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script>
import { SfImage, SfHeading } from '@storefront-ui/vue';

export default {
  name: 'StrapiArticleBlockRenderer',
  components: {
    SfImage,
    SfHeading,
  },
  props: {
    block: {
      type: Object,
      required: true,
    },
  },
  computed: {
    processedRichText() {
      if (!this.block.body) return '';
      
      let content = this.block.body;
      
      // Replace Strapi image URLs with full URLs
      content = content.replace(
        /src="\/uploads\//g,
        `src="${process.env.VSF_STRAPI_API_URL || 'http://localhost:1337'}/uploads/`
      );
      
      return content;
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
.strapi-article-block {
  margin: var(--spacer-lg) 0;
}

// Media Block Styles
.media-block {
  text-align: center;
  margin: var(--spacer-xl) 0;
}

.media-image {
  width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-caption {
  margin-top: var(--spacer-sm);
  font-style: italic;
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
}

// Quote Block Styles
.quote-block {
  padding: var(--spacer-lg);
  background: var(--c-light);
  border-left: 4px solid var(--c-primary);
  border-radius: var(--border-radius);
  margin: var(--spacer-xl) 0;
}

.quote-title {
  margin-bottom: var(--spacer-base);
  
  ::v-deep .sf-heading__title {
    font-size: var(--font-size--lg);
    color: var(--c-primary);
  }
}

.quote-content {
  font-size: var(--font-size--lg);
  font-style: italic;
  line-height: 1.6;
  color: var(--c-text);
  margin: 0;
  
  &::before {
    content: '"';
    font-size: 2em;
    color: var(--c-primary);
    line-height: 0;
    margin-right: var(--spacer-xs);
    vertical-align: -0.4em;
  }
  
  &::after {
    content: '"';
    font-size: 2em;
    color: var(--c-primary);
    line-height: 0;
    margin-left: var(--spacer-xs);
    vertical-align: -0.4em;
  }
}

// Rich Text Block Styles
.rich-text-block {
  margin: var(--spacer-lg) 0;
}

.rich-text-content {
  line-height: 1.6;
  
  ::v-deep {
    h1, h2, h3, h4, h5, h6 {
      margin: var(--spacer-lg) 0 var(--spacer-base) 0;
      color: var(--c-text);
      font-weight: var(--font-weight--semibold);
    }
    
    h1 { font-size: var(--font-size--xl); }
    h2 { font-size: var(--font-size--lg); }
    h3 { font-size: var(--font-size--base); }
    
    p {
      margin: var(--spacer-base) 0;
      color: var(--c-text);
    }
    
    a {
      color: var(--c-primary);
      text-decoration: underline;
      
      &:hover {
        color: var(--c-primary-variant);
      }
    }
    
    ul, ol {
      margin: var(--spacer-base) 0;
      padding-left: var(--spacer-lg);
    }
    
    li {
      margin: var(--spacer-xs) 0;
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      margin: var(--spacer-base) 0;
    }
    
    blockquote {
      border-left: 4px solid var(--c-primary);
      padding-left: var(--spacer-base);
      margin: var(--spacer-lg) 0;
      font-style: italic;
      color: var(--c-text-muted);
    }
  }
}

// Slider Block Styles
.slider-block {
  margin: var(--spacer-xl) 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-base);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.gallery-item {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .gallery-item:hover & {
    transform: scale(1.05);
  }
}

// Unknown Block Styles
.unknown-block {
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