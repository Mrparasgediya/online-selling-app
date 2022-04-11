/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // APP_BASE_URL: "", // your base app url name
    // JWT_SECRET: "", // jwt secret
    // MONGODB_URI: "", //mongodb connection url
    // CRYPTO_SECRET: "", // crypto secret
    APP_BASE_URL: "http://localhost:3000",
    JWT_SECRET: "parasgediya",
    MONGODB_URI:
      process.env.NODE_ENV === "development"
        ? "mongodb+srv://arth-creation:parasgediya103@cluster0.ejwap.mongodb.net/arth-creation?retryWrites=true&w=majority"
        : "mongodb://localhost:27017/online-selling-app",
    CRYPTO_SECRET: "paras",
  },
};

module.exports = nextConfig;
