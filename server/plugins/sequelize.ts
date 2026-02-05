import sequelize, { ensureSequelizeConnected, isSequelizeTransientError } from '../utils/db';

let installed = false;

export default defineNitroPlugin((nitroApp) => {
  if (installed) return;
  installed = true;

  nitroApp.hooks.hook('close', async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('⚠️ 关闭数据库连接失败：', (error as Error).message);
    }
  });

  process.on('unhandledRejection', (reason) => {
    console.error('⚠️ unhandledRejection：', reason);
    if (isSequelizeTransientError(reason)) {
      void ensureSequelizeConnected();
    }
  });

  process.on('uncaughtException', (error) => {
    console.error('💥 uncaughtException：', error);
  });
});
