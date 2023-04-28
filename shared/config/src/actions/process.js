module.exports = async (req, res) => {
  const { api: { body }, app: { locals: { instance, appId } } } = req;

  const {
    apps,
  } = body;

  if (apps.some((elt) => elt === '*' || elt === appId)) {
    instance.reload();
  }
  res.end();
};
