import * as migration_20261028_150616_initial from './20261028_150616_initial';

export const migrations = [
  {
    up: migration_20261028_150616_initial.up,
    down: migration_20261028_150616_initial.down,
    name: '20261028_150616_initial'
  },
];
