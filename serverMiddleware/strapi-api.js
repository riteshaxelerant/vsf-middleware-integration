const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const path = require('path');

/**
 * Handles a GraphQL request to the Strapi API.
 */
async function handleGraphQLRequest(endpoint, queryParams) {
  const strapiUrl = (process.env.STRAPI_BASE_URL || 'http://localhost:1337') + '/graphql';
  const queryMap = {
    getArticle: 'articles/getArticle.graphql',
    getArticles: 'articles/getArticles.graphql',
    getPage: 'pages/getPage.graphql',
    getPages: 'pages/getPages.graphql',
    getCategory: 'categories/getCategory.graphql',
    getCategories: 'categories/getCategories.graphql',
    getAuthor: 'authors/getAuthor.graphql',
    getAuthors: 'authors/getAuthors.graphql',
    getGlobal: 'global/getGlobal.graphql',
  };
  
  const queryFileName = queryMap[endpoint];
  if (!queryFileName) {
    throw new Error(`No GraphQL query mapping found for endpoint: ${endpoint}`);
  }

  const queryPath = path.join(__dirname, 'strapi-queries', queryFileName);
  const query = fs.readFileSync(queryPath, 'utf-8');

  console.log(`[Strapi Middleware] Executing GraphQL query for ${endpoint}...`);
  
  const response = await axios.post(strapiUrl, {
    query,
    variables: queryParams,
  });

  if (response.data.errors) {
    console.error('[Strapi Middleware] GraphQL Errors:', JSON.stringify(response.data.errors, null, 2));
    throw new Error('An error occurred while fetching data from Strapi.');
  }
  
  const responseDataKey = Object.keys(response.data.data)[0];
  const rawData = response.data.data[responseDataKey];

  return { data: rawData }; // Return in the structure the frontend expects
}

/**
 * Flattens the deeply nested Strapi v4 REST API response.
 */
function flattenStrapiResponse(data) {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data.map(flattenStrapiResponse);
  }

  let flattened = {};
  if (data.id) {
    flattened.id = data.id;
  }

  if (data.attributes) {
    for (const [key, value] of Object.entries(data.attributes)) {
      flattened[key] = flattenStrapiResponse(value);
    }
  } else {
    flattened = { ...flattened, ...data };
  }
  
  return flattened;
}

/**
 * Handles a traditional REST request to the Strapi API.
 */
async function handleRestRequest(endpoint, queryParams) {
  const baseUrl = process.env.STRAPI_BASE_URL || 'http://localhost:1337';
  const endpointConfig = {
    getPages: { resource: 'pages', type: 'collection' },
    getPage: { resource: 'pages', type: 'single', filterBy: 'slug' },
    getArticles: { resource: 'articles', type: 'collection' },
    getGlobal: { resource: 'global', type: 'single' },
    getAuthors: { resource: 'authors', type: 'collection' },
    getAuthor: { resource: 'authors', type: 'single', filterBy: 'email' },
    getCategories: { resource: 'categories', type: 'collection' },
    getCategory: { resource: 'categories', type: 'single', filterBy: 'slug' }
  };
  const populateConfigs = {
    default: { populate: '*' },
    getPage: { populate: { sections: { populate: 'deep' }}},
    getArticle: { populate: { cover: '*', author: { populate: '*' }, category: '*', blocks: { populate: '*' }}},
    getGlobal: { populate: '*' }
  };

  const config = endpointConfig[endpoint];
  if (!config) throw new Error(`Unknown endpoint: ${endpoint}`);

  let url = `${baseUrl}/api/${config.resource}`;
  const populateConfig = populateConfigs[endpoint] || populateConfigs.default;
  const query = { ...populateConfig };

  if (config.type === 'single' && config.filterBy && queryParams[config.filterBy]) {
     query.filters = { [config.filterBy]: { $eq: queryParams[config.filterBy] }};
  }
  
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  if (queryString) url += `?${queryString}`;

  console.log(`[Strapi Middleware] Fetching REST: ${url}`);
  const response = await axios.get(url);
  return flattenStrapiResponse(response.data);
}

function transformMediaUrls(data) {
  if (!data) return data;
  const strapiBaseUrl = process.env.STRAPI_BASE_URL || 'http://localhost:1337';
  
  function transformRecursive(obj) {
    if (Array.isArray(obj)) return obj.map(transformRecursive);
    if (obj && typeof obj === 'object') {
      const transformed = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'url' && typeof value === 'string' && value.startsWith('/')) {
          transformed[key] = `${strapiBaseUrl}${value}`;
        } else {
          transformed[key] = transformRecursive(value);
        }
      }
      return transformed;
    }
    return obj;
  }
  return transformRecursive(data);
}

function sendErrorResponse(res, statusCode, error, message) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error, message }));
}

// --- Main Middleware Handler ---
module.exports = async function (req, res) {
  const allowedEndpoints = ['getPages', 'getPage', 'getArticles', 'getArticle', 'getGlobal', 'getAuthors', 'getCategories', 'getCategory', 'getAuthor'];
  const graphqlEndpoints = [
    'getArticle', 
    'getArticles', 
    'getPage', 
    'getPages', 
    'getCategory', 
    'getCategories', 
    'getAuthor', 
    'getAuthors',
    'getGlobal'
  ];

  const { url } = req;
  const queryString = url.includes('?') ? url.split('?')[1] : '';
  const params = new URLSearchParams(queryString);
  const endpoint = params.get('endpoint');

  if (!endpoint || !allowedEndpoints.includes(endpoint)) {
    return sendErrorResponse(res, 404, 'Endpoint Not Found', `Valid endpoints: ${allowedEndpoints.join(', ')}`);
  }

  try {
    const queryParams = {};
    const integerParams = ['limit', 'start']; // A list of params that need to be integers

    for (const [key, value] of params.entries()) {
      if (key !== 'endpoint') {
        // If the key is in our list of integer params, parse it, otherwise keep it as a string.
        if (integerParams.includes(key)) {
          queryParams[key] = parseInt(value, 10);
        } else {
          queryParams[key] = value;
        }
      }
    }

    let data;
    if (graphqlEndpoints.includes(endpoint)) {
      data = await handleGraphQLRequest(endpoint, queryParams);
    } else {
      data = await handleRestRequest(endpoint, queryParams);
    }
    
    const finalData = transformMediaUrls(data);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(finalData));

  } catch (error) {
    console.error(`Error in Strapi middleware for ${endpoint}:`, error.message);
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.error?.message || error.message;
    sendErrorResponse(res, statusCode, 'Strapi API Error', message);
  }
}; 