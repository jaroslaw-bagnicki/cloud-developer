import { Sequelize } from 'sequelize-typescript';
import { getConfiguration } from './config/configurationProvider';

// Instantiate new Sequelize instance!
export const getSequelize = async () => {
  const config = await getConfiguration();
  return new Sequelize({
    'host': config.db.host,
    'database': config.db.database,
    'username': config.db.username,
    'password': config.db.password,
    dialect: 'postgres',
    storage: ':memory:',
  });
};

