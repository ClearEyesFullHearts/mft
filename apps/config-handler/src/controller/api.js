const library = require('../library');

module.exports = {
  getConfig: (req, res) => {
    const { params, query, auth } = req;

    const config = library.getConfig(query.version, params.env, auth);

    res.json(config);
  },
  reload: async (req, res) => {
    const { body, auth } = req;
    console.log('body', body);
    if (auth !== 'admin') {
      return res.status(503).send('Admin Authorization required.');
    }
    await library.load();

    return res.json();
  },
};
