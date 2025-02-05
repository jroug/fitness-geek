import type { MetadataRoute } from 'next'

const robots: MetadataRoute.Robots = {
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: '',
  },
//   sitemap: '',
}

export default robots