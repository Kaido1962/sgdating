/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Experimental settings to reduce memory usage in development
  experimental: {
    // Reduce memory usage during dev builds
    workerThreads: false,
    cpus: 1,
  },
  webpack: (config, { isServer, dev }) => {
    // Only apply memory-saving optimizations in development
    if (dev) {
      // Disable filesystem cache to prevent memory allocation errors in dev
      config.cache = false;

      // Reduce memory usage in development
      config.optimization = {
        ...config.optimization,
        minimize: false, // Disable minification in dev to save memory
        splitChunks: false, // Disable code splitting in dev
      };

      // Limit parallelism to reduce memory pressure in dev
      config.parallelism = 1;
    }

    return config;
  },
  // Turbopack config to work alongside webpack config
  turbopack: {
    // Empty config to acknowledge Turbopack usage
  },

}

export default nextConfig