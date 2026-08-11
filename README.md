
# VCCI Frontend (v2)

This README provides quick setup, usage, and troubleshooting information for the `vcci-fontend-v2` repository.

## Overview

This repository contains the VCCI frontend (version 2) built with Next.js and TypeScript. The project uses Orval to generate API clients from Swagger/OpenAPI, React Query for data fetching, TailwindCSS for styling, and several common React libraries.

Important folders:
- `src/` - application source code
- `src/api/` - generated API clients and models (output from Orval)
- `src/links/` - contains API URL configuration (backendHost, imageEndpoint, siteURL)
- `orval.config.ts` - Orval configuration used to generate API clients

## Requirements

- Node.js >= 18 (logs show Node 22 was used)
- pnpm (you can also use npm or yarn with equivalent commands)

## Installation

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

## Useful scripts

- `pnpm dev` - run Next.js in development mode
- `pnpm build` - build for production
- `pnpm start` - start the production server
- `pnpm lint` - run eslint
- `pnpm generate:api` - run Orval to generate API clients from Swagger

## Generating API clients (Orval)

This project uses Orval (configured in `orval.config.ts`) to fetch the Swagger/OpenAPI JSON from the backend and generate API endpoints and models under `src/api`.

Run:

```bash
pnpm generate:api
```

Common issues and solutions:

1) Error: `Cannot find module './src/links/index'` when running `pnpm generate:api`

- Cause: `orval.config.ts` is executed by Node when Orval runs. Node does not automatically transpile TypeScript files, so importing a `.ts` module (like `src/links/index.ts`) directly from the config can fail.
- Fixes:
	- Quick fix: Modify `orval.config.ts` to not import the `.ts` file directly. Instead, read `src/links/index.ts` as text (e.g. using `fs.readFileSync`) and extract the values you need (siteURL, imageEndpoint), or read those values from environment variables.
	- Alternative: Convert `src/links/index.ts` to a JS module (`src/links/index.js`) that Node can import.
	- Alternative: Run Orval in an environment that supports ts-node, but that is more complex.

2) Error: `502 Bad Gateway` when Orval tries to fetch `https://.../swagger/swagger-output.json`

- Cause: The backend Swagger endpoint is not responding properly or a proxy/nginx returned 502.
- Fixes:
	- Verify the endpoint with a tool like curl or Postman: `curl -v https://.../vcci/swagger/swagger-output.json`
	- If the backend is down, ask the backend team to start the service or provide a static swagger JSON file.
	- Temporary workaround: add a local swagger JSON file (for example `openapi/swagger-output.json`) and update `orval.config.ts` to fall back to the local file if the remote fetch fails.

Example fallback logic (pseudo-code):

```ts
try {
	const { data } = await axios.get(`${imageEndpoint}/swagger/swagger-output.json`)
	swagger = data
} catch (err) {
	const local = path.resolve(process.cwd(), 'openapi/swagger-output.json')
	if (fs.existsSync(local)) swagger = JSON.parse(fs.readFileSync(local, 'utf8'))
	else throw err
}
```

## CI / Safety notes

- In CI, either supply the swagger JSON file locally or ensure the backend swagger endpoint is reachable from the runner.
- Avoid importing `.ts` files directly in configs that run under Node without transpilation. Use `process.cwd()` to build safe absolute paths.

## Contributing

- If you change how API generation is configured, document the reason and how to test it in your PR.

## Quick debugging

- If `pnpm generate:api` fails, copy the error log and share it with the backend team (for 502 errors) or share `orval.config.ts` so the configuration can be reviewed.


Nếu bạn muốn, tôi có thể:
- Thêm sẵn fallback cục bộ vào `orval.config.ts` trong repo (ví dụ tự động dùng `openapi/swagger-output.json` nếu fetch remote thất bại).
- Hoặc chuyển `src/links/index.ts` thành `src/links/index.js` để Node import dễ dàng.

Bạn muốn tôi làm tiếp theo là gì? (Ví dụ: thêm fallback, chỉnh file `.js`, hoặc tạo file swagger mẫu cục bộ.)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.