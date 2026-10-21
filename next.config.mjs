import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The cloth-v4 route reads garment reference images from public/garment_test/
  // at runtime with fs. Next's serverless bundle must trace those files into
  // the /api/vto function or the read fails in production.
  experimental: {
    outputFileTracingIncludes: {
      "/api/vto": ["./public/garment_test/**"],
    },
  },
};

export default (phase) => ({
  ...nextConfig,
  // A running dev server must not overwrite next build / next start output.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
