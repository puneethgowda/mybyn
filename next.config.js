/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xhyhvdmvasxnshxngajt.supabase.co",
        port: "",
        pathname: "/storage/**",
        search: "",
      },
    ],
  },
};

module.exports = nextConfig;
