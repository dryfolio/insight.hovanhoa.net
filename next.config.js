
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hovanhoa.net',
            },
        ],
    }, 
    // redirects: async () => {
    //     return [
    //         {
    //             source: '/the-complete-developers-guide-to-eigenlayers-avs',
    //             destination: '/the-complete-developers-guide-to-avs',
    //             permanent: true,
    //         },
    //     ];
    // }

};

module.exports = nextConfig;
