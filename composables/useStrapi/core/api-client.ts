import axios from 'axios';

// During server-side rendering, the request will be made to the internal middleware.
// On the client-side, it will be a request to the same host that is serving the app.
const getBaseUrl = () => {
  if (process.server) {
    // During SSR, we need to call the Nuxt server itself.
    // The default port is 3000. This was previously misconfigured.
    return 'http://localhost:3000';
  }
  // On the client-side, this will be the browser's current URL.
  return window.location.origin;
};


const client = axios.create({
  baseURL: getBaseUrl()
});

const makeRequest = (endpoint, params = {}) => {
  const paramString = new URLSearchParams({ endpoint, ...params }).toString();
  // We need to use /api/strapi, which is the endpoint registered in nuxt.config.js
  console.log("Hello request", `/api/strapi?${paramString}`);
  return client.get(`/api/strapi?${paramString}`).then(res => res.data);
};

export const strapiApiClient = {
  getPages: (params) => makeRequest('getPages', params),
  getPage: (params) => makeRequest('getPage', params),
  getArticles: (params) => makeRequest('getArticles', params),
  getArticle: (params) => makeRequest('getArticle', params),
  getCategories: (params) => makeRequest('getCategories', params),
  getCategory: (params) => makeRequest('getCategory', params),
  getAuthors: (params) => makeRequest('getAuthors', params),
  getAuthor: (params) => makeRequest('getAuthor', params),
  getGlobal: () => makeRequest('getGlobal'),
}; 