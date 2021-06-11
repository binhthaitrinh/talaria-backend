declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_USERNAME: string;
    MONGO_PASSWORD: string;
    MONGO_DB: string;
    PORT: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: string;
    EMAIL_FROM: string;
    SENDGRID_USERNAME: string;
    SENDGRID_PASSWORD: string;
    SENDGRID_API: string;
    DEV_EMAIL_USERNAME: string;
    DEV_EMAIL_PASS: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_KEY: string;
    REDIS_URL: string;
  }
}