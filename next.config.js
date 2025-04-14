module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/player/WxYy9A20c54',
          permanent: false,
        },
      ]
    },
      experimental: {
        serverActions: true,
      },
    }
