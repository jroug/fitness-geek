import type { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {

  const config = process.env.NEXT_PUBLIC_ENV_NAME === 'live'
    ? await import('./robots.prod').then((module) => module.default)
    : await import('./robots.dev').then((module) => module.default)

  return config
}