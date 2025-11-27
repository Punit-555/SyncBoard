import { defineConfig } from '@prisma/define-config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  client: {
    output: './node_modules/@prisma/client',
  },
  datasource: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
    },
  },
});
