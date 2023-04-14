module.exports = {
  getConfig: (req, res, next) => {
    console.log('YEAH!');
    const { params, query, auth } = req;
    console.log(params, query, auth);
    res.json({ secret: {} });
  },
};
