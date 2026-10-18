/** @type {import('next').NextConfig} */
const nextConfig = {
  // The cloth-v4 route reads garment reference images from public/garment_test/
  // at runtime with fs. Next's serverless bundle must trace those files into
  // the /api/vto function or the read fails in production.
  outputFileTracingIncludes: {
    "/api/vto": ["./public/garment_test/**"],
  },
};

export default nextConfig;
