import { defineConfig } from "orval";
import axios from "axios";
import fs from "fs";
import path from "path";

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex < 0) return;

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadEnvFile(path.resolve(process.cwd(), ".env"));
const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST;
const siteURL = process.env.NEXT_PUBLIC_FRONTEND_HOST;

const swaggerCandidates = [
  process.env.ORVAL_SWAGGER_URL,
  path.resolve(process.cwd(), "..", "vietprodev-cms-backend", "storage", "swagger", "swagger-output.json"),
  `${backendHost}/swagger-output.json`,
  `${backendHost}/swagger/swagger-output.json`,
  `${backendHost}/swagger.json`,
  `${backendHost}/openapi.json`,
  `${backendHost}/api/swagger/swagger-output.json`,
  `${backendHost}/vcci/swagger/swagger-output.json`,
].filter(Boolean) as string[];

async function fetchSwagger() {
  for (const url of swaggerCandidates) {
    if (typeof url === "string" && fs.existsSync(url)) {
      return JSON.parse(fs.readFileSync(url, "utf8"));
    }

    try {
      const { data } = await axios.get(url, {
        headers: { Origin: siteURL },
      });
      return data;
    } catch {
      continue;
    }
  }

  const localSwagger = path.resolve(process.cwd(), "openapi/swagger-output.json");
  if (fs.existsSync(localSwagger)) {
    return JSON.parse(fs.readFileSync(localSwagger, "utf8"));
  }

  throw new Error(
    `Unable to load Swagger/OpenAPI JSON. Tried: ${swaggerCandidates.join(", ")}`,
  );
}

const orvalConfig = async () => {
  const swagger = await fetchSwagger();

  return defineConfig({
    "saigon-business": {
      output: {
        mode: "tags",
        target: "src/api/endpoints/index.ts",
        schemas: "src/api/models",
        client: "react-query",
        prettier: true,
        override: {
          mutator: {
            path: "src/api/mutator/custom-client.ts",
            name: "useCustomClient",
          },
          query: {
            useQuery: true,
            useInfinite: true,
            usePrefetch: true,
            // useSuspenseQuery: true,
            options: {
              retry: 3,
              retryDelay: 1000,
            }
          },
        }
      },
      input: {
        target: swagger,
        filters: {
          tags: [
            'Auth',
            'WebsiteConfig',
            'Event',
            'Files',
            'Footer',
            'Order',
            'OrganizationCategory',
            'Organizations',
            'PageConfig',
            'Permisions',
            'Products',
            'Schedule',
            'Status',
            'Users',
            'Validator',
            'Contact',
            'Statistic',
            'Notification',
            'MembershipFee',
            'PermisionFunction',
            'Department',
            'UserDepartment',
            'UserHistory',
            'Approvals',
            'News',
            'Category',
            'NewsPageConfig',
            'Video',
            'NewsletterSubscription',
            'SiteInformation',
            'Logo',
            'Banner',
          ],
        },
      },
    },
  });
}

export default orvalConfig
