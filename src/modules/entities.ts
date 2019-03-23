const entityContext = require.context('.', true, /\.entity\.ts$/);

export const entities = entityContext.keys().map(id => {
  const entityModule = entityContext(id);
  // We must get entity from module (commonjs)
  // Get first exported value from module (which should be entity class)
  const [entity] = Object.values(entityModule);
  return entity;
});
