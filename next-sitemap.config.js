module.exports = {
  siteUrl: 'http://localhost:3000',
  generateRobotsTxt: true,
  appDir: true,
  exclude: ['/admin/**', '/private/**'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', disallow: '/admin' },
    ],
  },
}
