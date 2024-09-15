
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'suhailkakar-com.vercel.app',
            },
        ],
    }, 
    redirects: async () => {
        return [
            {
                source: '/the-complete-developers-guide-to-eigenlayers-avs',
                destination: '/the-complete-developers-guide-to-avs',
                permanent: true,
            },
        ];
    }

};

module.exports = nextConfig;
