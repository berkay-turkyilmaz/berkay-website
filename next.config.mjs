import createNextIntlPlugin from 'next-intl/plugin';

// i18n yapılandırma dosyamızın yolunu belirtiyoruz
const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Buraya diğer Next.js ayarlarını ekleyebilirsin (örneğin image domains vb.)
};

export default withNextIntl(nextConfig);