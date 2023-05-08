const fs = require('fs/promises');

(async () => {
  try {
    const file = await fs.readFile('/run/secrets/external_config');
    const secrets = JSON.parse(file);
    Object.keys(secrets).forEach((k) => {
      console.log('add to env', k);
      process.env[k] = secrets[k];
    });
  } catch (err) {
    console.log('No secrets', err);
  }

  const ConfigHandler = require('./src/service');
  await new ConfigHandler().start();
})();
