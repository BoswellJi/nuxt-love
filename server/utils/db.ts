import { Sequelize } from 'sequelize';

declare global {
  // eslint-disable-next-line no-var
  var __sequelize: Sequelize | undefined;
  // eslint-disable-next-line no-var
  var __sequelizeConnectPromise: Promise<void> | undefined;
}

const config = useRuntimeConfig();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isSequelizeTransientError(error: unknown) {
  const e = error as any;
  const name = e?.name as string | undefined;
  return (
    name === 'SequelizeConnectionError' ||
    name === 'SequelizeConnectionRefusedError' ||
    name === 'SequelizeConnectionTimedOutError' ||
    name === 'SequelizeHostNotFoundError' ||
    name === 'SequelizeHostNotReachableError' ||
    name === 'SequelizeInvalidConnectionError'
  );
}

function createSequelize(databaseUrl: string) {
  return new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });
}

export const sequelize =
  globalThis.__sequelize ?? (globalThis.__sequelize = createSequelize(config.databaseUrl));

async function reconnectWithRetry(maxRetries = 5, baseDelayMs = 3000) {
  let retries = 0;
  let delayMs = baseDelayMs;

  while (retries < maxRetries) {
    try {
      retries++;
      console.log(`🔄 第 ${retries} 次重连...`);
      await sequelize.authenticate();
      console.log('✅ 数据库连接可用');
      return;
    } catch (err: any) {
      const transient = isSequelizeTransientError(err);
      console.error(`❌ 第 ${retries} 次连接失败：${err?.message ?? err}`);

      if (!transient) {
        throw err;
      }

      const waitMs = Math.round(delayMs);
      console.error(`⏳ ${waitMs / 1000} 秒后重试...`);
      await sleep(waitMs);

      delayMs *= 1.5;
    }
  }

  throw new Error('数据库连接多次重试失败');
}

export async function ensureSequelizeConnected() {
  if (globalThis.__sequelizeConnectPromise) return globalThis.__sequelizeConnectPromise;

  globalThis.__sequelizeConnectPromise = reconnectWithRetry().finally(() => {
    globalThis.__sequelizeConnectPromise = undefined;
  });

  return globalThis.__sequelizeConnectPromise;
}

ensureSequelizeConnected().catch((error) => {
  console.error('💥 数据库初始化失败：', (error as Error).message);
});

export default sequelize;
