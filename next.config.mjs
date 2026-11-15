/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/((?!_next/|images/|api/).*)',
        headers: [{ key: 'Vary', value: 'Accept' }],
      },
    ];
  },
};

export default nextConfig;
