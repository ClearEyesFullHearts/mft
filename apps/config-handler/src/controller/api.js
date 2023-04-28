const library = require('../library');

module.exports = {
  getConfig: (req, res) => {
    const { params, query, auth } = req;

    const config = library.getConfig(query.vConf, query.vApi, params.env, auth);

    res.json(config);
  },
  reload: async (req, res) => {
    const {
      body, auth, api: { publisher }, headers,
    } = req;

    if (auth !== 'rest-api') {
      return res.status(503).send('Unauthorized application access.');
    }
    await library.load();

    const { 'x-session-id': mySessionId } = headers;
    await publisher.publish('reload', body, { 'x-session-id': mySessionId });

    return res.json();
  },
};
