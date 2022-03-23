const receiptsRepo = require('./receipts.db.repository');

const getAll = async (body) => receiptsRepo.getAll(body);

const listMeals = async () => receiptsRepo.ListMeals();

const listCategories = async () => receiptsRepo.listCategories();

const listArray = async (body) => receiptsRepo.listArray(body);

const listAreas = async () => receiptsRepo.listAreas();

const listPopular = async (lmt) => receiptsRepo.listPopular(lmt);

const getBy = async (key, value) => receiptsRepo.getBy(key, value);

const getList = async () => receiptsRepo.getList();

const create = async (body) => receiptsRepo.create(body);

const update = async (body, id) => receiptsRepo.update(body, id);

const remove = async (id) => receiptsRepo.remove(id);


module.exports = { 
  getAll,
  listMeals,
  listCategories,
  listArray,
  listAreas,
  listPopular,
  getBy,
  getList,
  create,
  update,
  remove
};
