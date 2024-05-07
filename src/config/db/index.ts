import { Sequelize, Dialect, Options } from 'sequelize';

function DB(config: Options) {
  const sequelize = new Sequelize(config);

  return sequelize;
}

export default DB;
