import { Middleware } from '@nuxt/types';
import { usePageStore } from '~/stores/page';
import { Logger } from '~/helpers/logger';
import { RoutableInterface } from '~/modules/GraphQL/types';

const urlResolverMiddleware : Middleware = async (context) => {
  const pageStore = usePageStore();
  const { path } = context.route;

  const clearUrl = path.replace(/[a-z]+\/[cp|]\//gi, '').replace(`/${context.i18n.locale}`, '');

  Logger.debug('middleware/url-resolver', clearUrl);

  // First, try to resolve with Magento
  const { data, errors } = await context.app.$vsf.$magento.api.route(clearUrl);

  Logger.debug('middleware/url-resolver/result', { data, errors });

  const results: RoutableInterface | null = data?.route ?? null;

  // If Magento found a route, use it
  if (results && !errors?.length) {
    pageStore.$patch((state) => {
      state.routeData = results;
    });
    return;
  }

  // If Magento didn't find a route, check if this could be a Strapi page
  // For now, we'll assume any URL that doesn't match Magento could be a Strapi page
  // Later we can add actual Strapi API calls here
  
  // Skip certain paths that should definitely be 404s
  const skipPaths = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/_nuxt',
    '/api',
    '/healthz'
  ];
  
  const shouldSkip = skipPaths.some(skipPath => clearUrl.startsWith(skipPath));
  
  if (shouldSkip) {
    context.error({ statusCode: 404 });
    return;
  }

  // For testing purposes, treat any unmatched URL as a potential Strapi page
  // In production, you would want to actually check if the page exists in Strapi
  Logger.debug('middleware/url-resolver/strapi-page', `Treating as Strapi page: ${clearUrl}`);

  pageStore.$patch((state) => {
    state.routeData = {
      type: 'STRAPI_PAGE',
      slug: clearUrl,
      // Add any other properties that might be needed
    };
  });
};

export default urlResolverMiddleware;
