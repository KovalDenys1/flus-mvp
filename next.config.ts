import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.30.196"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yxduwqztbtpqxhufhfvv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
