type EnvVariables = {
  readonly url?: string
}

type Config = {
  readonly development: EnvVariables
  readonly staging: EnvVariables
  readonly production: EnvVariables
}

const config: Config = {
  development: {
    url: process.env.MONGO_URL_DEV
  },
  staging: {
    url: process.env.MONGO_URL_STAGE
  },
  production: {
    url: process.env.MONGO_URL_PROD
  }
}

export default config
