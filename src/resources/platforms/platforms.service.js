const platformsRepo = require('./platforms.db.repository');

const getAll = async () => platformsRepo.getAll();

const get = async (nestId) => platformsRepo.get(nestId);

const getList = async (key, value) => platformsRepo.getList(key, value);

const save = async (platform) => platformsRepo.save(platform);

module.exports = { getAll, get, getList, save };
