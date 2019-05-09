type Config = {
  readonly url?: string
}

const config: Config = {
  url: process.env.MONGO_URL
}

export default config
