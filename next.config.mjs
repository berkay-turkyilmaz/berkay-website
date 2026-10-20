import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

/** Old AI Lab URLs -> new structure (kept permanently so shared links keep working). */
const AI_LAB_LEGACY = [
  ["/ai-lab", "/ai-lab/chat"],
  ["/ai-lab/sandbox", "/ai-lab/documents"],
  ["/ai-lab/deep-analyzer", "/ai-lab/analyzer"],
  ["/ai-lab/context-viz", "/ai-lab/analyzer"],
  ["/ai-lab/terminal", "/ai-lab/chat"],
  ["/ai-lab/thought-chain", "/ai-lab/chat"],
  ["/ai-lab/youtube", "/ai-lab/chat"],
  ["/ai-lab/english-practice", "/ai-lab/english-path"],
];

const aiLabRedirects = AI_LAB_LEGACY.flatMap(([from, to]) => [
  { source: from, destination: to, permanent: true },
  {
    source: "/:locale(en|de|es|fr|ar|ja)" + from,
    destination: "/:locale" + to,
    permanent: true,
  },
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    return [
      ...aiLabRedirects,
      { source: "/now", destination: "/", permanent: true },
      {
        source: "/:locale(en|de|es|fr|ar|ja)/now",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
