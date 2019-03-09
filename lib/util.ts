type NodeEnv = "development" | "staging" | "production"

export const nodeEnv = (process.env.NODE_ENV || "development") as NodeEnv
