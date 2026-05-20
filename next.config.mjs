/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    /** Evita empaquetar el addon nativo de sqlite en el grafo del servidor */
    serverComponentsExternalPackages: ["sqlite3", "sqlite"],
  },
  /**
   * En WSL con el repo en /mnt/c/... el watch por inotify falla a menudo: la compilación
   * deja .next a medias → 404 en /_next/static/* y 500 en rutas internas. Polling estabiliza dev.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 500,
        ignored: ["**/node_modules/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
