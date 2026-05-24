import { betterAuth } from 'better-auth';
import { d1Adapter } from 'better-auth/adapters/cloudflare-d1';

export const getAuth = (db: D1Database, env: { BETTER_AUTH_SECRET: string, BETTER_AUTH_URL?: string }) => {
  return betterAuth({
    database: d1Adapter(db),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
    },
  });
};
