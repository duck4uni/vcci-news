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
  path.resolve(process.cwd(), "openapi", "swagger-output.json"),
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
    if (!url) continue;

    // 1) Local file path
    if (fs.existsSync(url) && fs.statSync(url).isFile()) {
      const raw = fs.readFileSync(url, "utf8");
      try {
        return JSON.parse(raw);
      } catch (error) {
        throw new Error(`Swagger spec tại ${url} không phải JSON hợp lệ: ${error}`);
      }
    }
    // 2) HTTP fetch — chỉ chấp nhận JSON, bỏ qua HTML (404, page app,...)
    if (/^https?:\/\//i.test(url)) {
      try {
        const { data, headers } = await axios.get(url, {
          headers: { Origin: siteURL },
          // Ngăn axios tự nhận HTML là JSON — ép raw response để check Content-Type
          responseType: "json",
          validateStatus: (status) => status >= 200 && status < 400,
        });

        const contentType = String(headers?.["content-type"] ?? "").toLowerCase();
        if (!contentType.includes("application/json") && typeof data === "string") {
          // Phản hồi không phải JSON (thường là HTML 404) — bỏ qua candidate này
          continue;
        }

        if (data && typeof data === "object") {
          return data;
        }
      } catch {
        continue;
      }
    }
  }

  // 3) Fallback cuối: openapi/swagger-output.json nằm trong repo
  const localSwagger = path.resolve(process.cwd(), "openapi/swagger-output.json");
  if (fs.existsSync(localSwagger)) {
    const raw = fs.readFileSync(localSwagger, "utf8");
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`Swagger spec tại ${localSwagger} không phải JSON hợp lệ: ${error}`);
    }
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
          // Tag whitelist dùng tên CHÍNH XÁT trong OpenAPI spec — lấy từ openapi/swagger-output.json.
          // Cập nhật khi backend thêm/xóa tag. Bỏ hết filter nếu muốn generate toàn bộ.
          tags: [
            'Authentication',
            'Advertisement',
            'Banner',
            'Business',
            'Category',
            'CategoryTag',
            'Contact',
            'File',
            'Logo',
            'Member',
            'NewsletterSubscription',
            'PageConfig',
            'PasswordResetRequest',
            'Permission',
            'Position',
            'Post',
            'PostCategory',
            'PostTag',
            'Role',
            'RolePermission',
            'SiteInformation',
            'Tag',
            'Term',
            'User',
            'UserRole',
            'VCCI',
            'Video',
          ],
        },
      },
    },
  });
}

export default orvalConfig
