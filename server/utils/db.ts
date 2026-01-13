import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

const connection = () => {
  if (sequelize) return sequelize;

  const config = useRuntimeConfig();
  sequelize = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
  return sequelize;
};

const testConnection = async (sequelize: Sequelize) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize 数据库连接成功');
  } catch (error) {
    console.error('❌ Sequelize 数据库连接失败：', (error as Error).message);
  }
};

const getSequelize = () => {
  const sequelize = connection();
  testConnection(sequelize);
  return sequelize;
};

export default getSequelize();
