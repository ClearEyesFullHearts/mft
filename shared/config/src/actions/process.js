module.exports = async (req, res) => {
  const { api: { body }, app: { locals: { instance, appId } } } = req;

  const {
    apps,
  } = body;

  if (apps.some((elt) => elt === '*' || elt === appId)) {
    console.log('RELOAD', apps)
    instance.reload();
  }
  res.end();
};
