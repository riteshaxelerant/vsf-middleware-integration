<template>
  <div class="blog-posts-section">
    <div class="container">
      <SfHeading
        v-if="data.sectionTitle"
        :level="2"
        :title="data.sectionTitle"
        class="section-heading"
      />
      
      <div v-if="data.posts && data.posts.length" class="posts-grid">
        <article
          v-for="post in data.posts"
          :key="post.id"
          class="post-card"
        >
          <div class="post-image" @click="handlePostClick(post)" style="cursor: pointer;">
            <SfImage
              v-if="post.image && post.image.url"
              :src="getStrapiImageUrl(post.image.url)"
              :alt="post.image.alternativeText || post.title"
              class="post-thumbnail"
            />
          </div>
          
          <div class="post-content">
            <h3 class="post-title" @click="handlePostClick(post)" style="cursor: pointer;">{{ post.title }}</h3>
            <p v-if="post.summary" class="post-excerpt">{{ post.summary }}</p>
            
            <SfButton
              v-if="post.link"
              class="post-link"
              @click="handlePostClick(post)"
            >
              Read More
            </SfButton>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfImage, SfButton } from '@storefront-ui/vue';

export default {
  name: 'StrapiBlogPostsTeaser',
  components: {
    SfHeading,
    SfImage,
    SfButton,
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
    handlePostClick(post) {
      if (post.link) {
        if (post.link.startsWith('http')) {
          window.open(post.link, '_blank');
        } else {
          const internalLink = post.link.startsWith('/') ? post.link : `/${post.link}`;
          this.$router.push(`/default${internalLink}`);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-posts-section {
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

.posts-grid {
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

.post-card {
  background: var(--c-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: var(--spacer-lg);
}

.post-title {
  font-size: var(--font-size--lg);
  font-weight: var(--font-weight--semibold);
  margin-bottom: var(--spacer-sm);
  color: var(--c-text);
}

.post-excerpt {
  color: var(--c-text-muted);
  line-height: 1.6;
  margin-bottom: var(--spacer-base);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-link {
  --button-size: var(--spacer-sm) var(--spacer-base);
}
</style> 