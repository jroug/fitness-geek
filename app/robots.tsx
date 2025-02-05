import type { MetadataRoute } from 'next'

const robots = process.env.NEXT_PUBLIC_ENV_NAME === 'live'
  ? require('./robots.prod').default
  : require('./robots.dev').default

export default function robotsConfig(): MetadataRoute.Robots {
  return robots
}