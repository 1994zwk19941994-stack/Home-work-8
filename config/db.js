import { readFileSync } from 'fs';
import { Sequelize } from 'sequelize';

const config = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false,
});

export default sequelize;
