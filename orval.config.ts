import 'dotenv/config'
import { defineConfig } from "orval";
import links from "./src/links/index";

const orvalConfig = defineConfig({
  // VCCI News API
  "vcci-news": {
    output: {
      mode: "tags",
      target: "src/api/vcci-news/endpoints/index.ts",
      schemas: "src/api/vcci-news/models",
      client: "react-query",
      override: {
        query: {
          useInfinite: true,
          usePrefetch: true,
          options: {
            retry: 3,
            retryDelay: 1000,
          }
        },
        mutator: {
          path: "src/api/vcci-news/mutator/custom-client.ts",
          name: "useCustomClient",
        },
      }
    },
    input: {
      target: `${links.apiEndpoint}/swagger-output.json`,
      filters: {
        tags: undefined,
      },
    },
  },

  // VCCI HCM API
  "vcci-hcm": {
    output: {
      mode: "tags",
      target: "src/api/vcci-hcm/endpoints/index.ts",
      schemas: "src/api/vcci-hcm/models",
      client: "react-query",
      override: {
        query: {
          useInfinite: true,
          usePrefetch: true,
          options: {
            retry: 3,
            retryDelay: 1000,
          }
        },
        mutator: {
          path: "src/api/vcci-hcm/mutator/custom-client.ts",
          name: "useCustomClient",
        },
      }
    },
    input: {
      target: `${links.externalApiEndpoint}/swagger-output.json`,
      validation: false,
      parserOptions: { validate: false },
      filters: {
        tags: ["Organizations"],
      },
    },
  }
});

export default orvalConfig
