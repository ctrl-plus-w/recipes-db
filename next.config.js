/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  async redirects() {
    return [
      {
        source: '/',
        destination: '/recipes',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
