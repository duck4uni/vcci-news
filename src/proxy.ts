import { NextRequest, NextResponse } from "next/server";

import { LEGACY_ID_MAP, LEGACY_SLUG_MAP } from "@/lib/legacy-redirect-map";

/**
 * Redirect cac link cu cua site WordPress ve slug hien tai trong CMS moi:
 *   - ?p=<id>  (link kieu ?p=11051)
 *   - .../ten-bai.html  (permalink cu co duoi .html)
 *   - /ten-bai  (slug cu bi doi)
 * Map tu dong tao boi migration/scripts/build-redirect-map.mjs.
 *
 * Next.js 16: middleware.ts -> proxy.ts (cu), ham export 'proxy'.
 */
export default function proxy(req: NextRequest) {
	// 1. ?p=<id>
	const p = req.nextUrl.searchParams.get("p");
	if (p) {
		const slug = LEGACY_ID_MAP[p];
		if (slug) {
			return NextResponse.redirect(new URL("/" + slug, req.nextUrl.origin), 308);
		}
	}

	// 2. duoi .html
	const pathname = req.nextUrl.pathname;
	if (pathname.toLowerCase().endsWith(".html")) {
		const trimmed = pathname.slice(0, -5);
		const last = trimmed.split("/").filter(Boolean).pop();
		if (last) {
			const target = LEGACY_SLUG_MAP[last] ?? last;
			return NextResponse.redirect(new URL("/" + target + req.nextUrl.search, req.nextUrl.origin), 308);
		}
	}

	// 3. slug cu bi doi
	const clean = pathname.replace(/\/+$/, "").replace(/^\//, "");
	const mapped = LEGACY_SLUG_MAP[clean];
	if (mapped) {
		return NextResponse.redirect(new URL("/" + mapped + req.nextUrl.search, req.nextUrl.origin), 308);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|admin|uploads|_next/static|_next/image|images/|public/|favicon.ico|thumbnail.png|robots.txt|sitemap.xml|ads.txt).*)",
	],
};
