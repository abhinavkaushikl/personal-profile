const isPages = process.env.GITHUB_PAGES === 'true';
const basePath = isPages ? '/personal-profile' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  ...(isPages && {
    output: 'export',
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: isPages ? 'https://abhinavkaushikl.github.io/personal-profile' : '',
  },
};

export default nextConfig;
