module.exports = ({ env }) => ({
  host: env('HOST', '192.168.1.110'),
  port: env.int('PORT', 1337),
  url: env('URL', 'http://localhost:1337'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '6b47175b43c5f658d8f91ab82ee24332'),
    },
    host: env('ADMINHOST', '192.168.1.110'),
    port: env.int('ADMINPORT', 1338),
  },
  cron: {
    enabled: true
  },
});
