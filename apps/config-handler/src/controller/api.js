const library = require('../library');

module.exports = {
  getConfig: (req, res) => {
    const { params, query, auth } = req;

    const config = library.getConfig(query.version, params.env, auth);

    res.json(config);
  },
};
