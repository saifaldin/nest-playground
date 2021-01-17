import * as config from 'config';

const {
  type,
  host,
  port,
  username,
  password,
  database,
  entities,
  synchronize,
} = config.get('db');

export default {
  type,
  host,
  port,
  username,
  password,
  database,
  entities,
  synchronize,
};
