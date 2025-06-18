<template>
  <div class="strapi-rich-text">
    <div 
      v-if="data.content" 
      class="rich-text-content"
      v-html="processedContent"
    />
  </div>
</template>

<script>
export default {
  name: 'StrapiRichTextBlock',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    processedContent() {
      if (!this.data.content) return '';
      
      // Process the content to ensure proper styling and security
      let content = this.data.content;
      
      // Replace Strapi image URLs with full URLs
      content = content.replace(
        /src="\/uploads\//g,
        `src="${process.env.VSF_STRAPI_API_URL || 'http://localhost:1337'}/uploads/`
      );
      
      return content;
    },
  },
};
</script>

<style lang="scss" scoped>
.strapi-rich-text {
  margin: var(--spacer-xl) 0;
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
    
    code {
      background: var(--c-light);
      padding: var(--spacer-xs);
      border-radius: var(--border-radius);
      font-family: monospace;
    }
    
    pre {
      background: var(--c-light);
      padding: var(--spacer-base);
      border-radius: var(--border-radius);
      overflow-x: auto;
      
      code {
        background: none;
        padding: 0;
      }
    }
  }
}
</style> 