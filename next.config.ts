import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    basePath: '/',
    assetPrefix: '/',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3333',
                pathname: '/uploads/images/**',
            },
        ],
    },
};

export default nextConfig;
