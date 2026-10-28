/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deployed to user.github.io/repo-name, base path is /repo-name
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || (isProd && repoName ? `/${repoName}` : ''),
  trailingSlash: true,
};

module.exports = nextConfig;
