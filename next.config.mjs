import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so a stray lockfile in $HOME doesn't confuse tracing.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
