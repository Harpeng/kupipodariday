import { join } from 'path';

export default () => ({
  server: { port: parseInt(process.env.SERVER_PORT, 10) || 3001 },
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'student',
    password: process.env.DB_PASSWORD || 'student',
    database: process.env.DB_NAMEBASE || 'kupipodariday',
    entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
    synchronize: Boolean(process.env.DB_SYNCHRONIZE) || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'SECRET',
    exp: process.env.JWT_EXPIRES || '30m',
  },
});
