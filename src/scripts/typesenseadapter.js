import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";


export let TYPESENSE_SERVER_CONFIG = {
    apiKey: "VfjYbDVVhpcsSoeYl2WxLL8CGqOiMPe8" , // Be sure to use an API key that only allows searches, in production
    nodes: [
        {
            host: "n874w3bqsy2tcfjep-1.a1.typesense.net",
            port:"443",
            protocol: "https"
        }
    ],
    numRetries: 8,
    connectionTimeoutSeconds: 1
  };

  export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: TYPESENSE_SERVER_CONFIG,
    additionalSearchParameters: {
      // The following parameters are directly passed to Typesense's search API endpoint.
      //  So you can pass any parameters supported by the search endpoint below.
      //  queryBy is required.
      queryBy: 'name',
      typoTokensThreshold: 1,
      // groupBy: "categories",
      // groupLimit: 1
      // pinnedHits: "23:2"
    },
  });

