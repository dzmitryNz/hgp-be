const Receipt = require('./receipts.model');
const { NOT_FOUND_ERROR, ENTITY_EXISTS } = require('../../errors/appErrors');
const ENTITY_NAME = 'receipt';
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const logger = require('../../common/logging');

const entity = 'Receipt';

const getAll = async (body) => {
  const fields = {};
  const sort = { strRequestsCounter: "desc" };
  let query = {};
  let skip = 0; 
  let limit = 50; 
  if (body) {
    const { search, page, perPage } = body
    if (search) {
      if (search.length == 2) query = { [search[0]]: RegExp(search[1], 'i') };
    }
    if (perPage) limit = perPage;
    if (page && perPage) skip = perPage * page;
  }
  const options =  { skip, limit, sort };
  try {
    let count = 0;
    count = await Receipt.find(query).countDocuments();
    // console.log(body, options, count);
    const receipts = await Receipt.find(query, fields, options);
    return { count, receipts }
  } catch (error) {
    logger.error(`${entity} getAll: ${error}`);
  }
};

const listArray = async body => {
  const el = body.el ? body.el : 'idMeal';
  const reg = new RegExp(body.reg);
  const receipts = await Receipt.find({ [el]: reg });
  return receipts
};

const getBy = async (key, value) => {
  try {
    return Receipt.find({ [key]: value });
  } catch (err) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { value });
  } 
};

const listAreas = async () => {
  const list = await Receipt.find({});
  let mapAreas = new Map();

  list.forEach((el) => {
    const area = el.strArea;
    if (mapAreas.get(area)) mapAreas.set(area, mapAreas.get(area) + 1);
        else {mapAreas.set(area,1)}
  });
  
  return Array.from(mapAreas);
};

const listSummary = async () => {
  const list = await Receipt.find({});
  const mapAreas = new Map();
  const mapCategories = new Map();
  list.map((el) => {
    const area = el.strArea;
    const category = el.strCategory;
    if (mapAreas.get(area)) mapAreas.set(area, mapAreas.get(area) + 1);
        else {mapAreas.set(area,1)}
    if (mapCategories.get(category)) mapCategories.set(area, mapCategories.get(category) + 1);
        else {mapCategories.set(category,1)}
  });
  
  return { areas: Array.from(mapAreas), categories: Array.from(mapCategories) };
};

const listPopular = async (lmt) => {
  const limit = Number(lmt) ? Number(lmt) : 50;
  try {
    return Receipt.find({strRequestsCounter: {$gt: 0}})
      .sort({strRequestsCounter: -1})
      .limit(limit);
  } catch (err) {
    throw new Error(err);
  }
};

const getList = async () => Receipt.find({});

const create = async (receipt) => {
  try {
    return await Receipt.create(receipt);
  } catch (err) { 
    if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} exists`);
    } else {
      throw err;
    }
  }  
};

const update = async (id, receipt) => {
  Receipt.findOneAndUpdate({ _id: id }, { $set: receipt }, { new: true });
};

const remove = async id => Receipt.deleteOne({ _id: id });

module.exports = {
  getAll,
  getBy,
  listArray,
  listAreas,
  listSummary,
  listPopular,
  getList,
  create,
  update,
  remove
};
