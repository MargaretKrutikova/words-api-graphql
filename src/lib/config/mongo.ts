type Config = {
  readonly url?: string;
  readonly dbName?: string;
  readonly collectionName?: string;
};

const config: Config = {
  url: process.env.MONGO_URL,
  dbName: process.env.MONGO_DB_NAME,
  collectionName: process.env.MONGO_COLLECTION_NAME,
};

export default config;
