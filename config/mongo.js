module.exports = {
  development: {
    url: process.env.MONGO_URL_DEV
  },
  staging: {
    url: process.env.MONGO_URL_STAGE
  },
  production: {
    url: process.env.MONGO_URL_PROD
  }
};
