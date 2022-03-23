const Platform = require('./platforms.model');
const { NOT_FOUND_ERROR, ENTITY_EXISTS } = require('../../errors/appErrors');
const ENTITY_NAME = 'platforms';
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;

const getAll = async () => {
  return await Platform.find({});
};

const getList = async (key, value) => {
  return await Platform.find({ [key]: value });
};

const get = async id => {
  const platform = await Platform.findOne({ _id: id });
  if (!platform) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }
  return platform;
};

const getStatus = async () => {
  const idArr = [];
  for (let i = 0; i < 10; i++) {
    const id = Math.floor(Math.random()*(100));
    if (idArr.indexOf(id) === -1 ) idArr.push(id);
      else i--;
  }
  console.log(idArr.length + "---" + idArr);
  const platform = await Platform.find({ id: idArr });
  if (!platform) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME);
  }
  return platform;
};

const save = async (platform) => {
  platform.history = [ { created: new Date() } ];
  try {
    return await Platform.create(platform);
  } catch (err) { 
    if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this nest exists`);
    } else {
      throw err;
    }
  }
}

module.exports = { getAll, get, getStatus, getList, save };
