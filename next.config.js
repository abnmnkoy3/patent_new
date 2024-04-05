// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',

    distDir: 'Demo19',
    // basePath: '/View',
    images: {
        unoptimized: true
    },

    reactStrictMode: false,

    trailingSlash: true
};

module.exports = nextConfig;