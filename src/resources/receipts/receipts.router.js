const { OK } = require('http-status-codes');
const router = require('express').Router();

const receiptsService = require('./receipts.service');
const { BAD_REQUEST_ERROR } = require('../../errors/appErrors');
const extractQueryParam = require('../../utils/getQueryNumberParameter');

router.route('/pages/').get(async (req, res) => {
  const page = extractQueryParam(req.query.page, 0);
  const group = extractQueryParam(req.query.group, 0);

  if (isNaN(page) || isNaN(group)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the group, page numbers should be valid integers'
    );
  }

  const receipts = await receiptsService.getAll({ page, group });
  res.status(OK).send(receipts.map(receipt => receipt.toResponse()));
});

router.route('/').get(async (req, res) => {
  const body = req.body;
  const receipts = await receiptsService.getAll(body);
  res.status(OK).send({ count: receipts.count, receipts: receipts.receipts.map(el => el.toResponse())})
});

router.route('/cat').get(async (req, res) => {
  const categories = await receiptsService.getAll();
    let mapCategories = new Map();
    categories.map((el) => {
      const cat = el.strCategory;
      if (mapCategories.get(cat)) mapCategories.set(cat, mapCategories.get(cat) + 1);
        else {mapCategories.set(cat,1)}
    });
  res.status(OK).send(Array.from(mapCategories));
});

router.route('/array').get(async (req, res) => {
  const { body } = req;
  const categories = await receiptsService.listArray(body);
  res.status(OK).send(categories.map(cat => cat.toResponse()));
});

router.route('/areas').get(async (req, res) => {
  const areas = await receiptsService.listAreas();
  res.status(OK).send(areas);
});

router.route('/popular').get(async (req, res) => {
  const popularList = await receiptsService.listPopular();
  res.status(OK).send(popularList.map(cat => cat.toResponse()));
});

router.route('/popular/:lmt').get(async (req, res) => {
  const popularList = await receiptsService.listPopular(req.params.lmt);
  res.status(OK).send(popularList.map(cat => cat.toResponse()));
});

router.route('/id/:id').get(async (req, res) => {
  const receipts = await receiptsService.getBy('idMeal', req.params.id);
  res.status(OK).send(receipts.map(rec => rec.toResponse()));
});

router.route('/meal/:strMeal').get(async (req, res) => {
  const receipts = await receiptsService.getBy('strMeal', req.params.strMeal);
  res.status(OK).send(receipts.map(rec => rec.toResponse()));
});

router.route('/cat/:strCategory').get(async (req, res) => {
  const receipts = await receiptsService.getBy('strCategory', req.params.strCategory);
  res.status(OK).send(receipts.map(rec => rec.toResponse()));
});

router.route('/cat/:strArea').get(async (req, res) => {
  const receipts = await receiptsService.getBy('strArea', req.params.strArea);
  res.status(OK).send(receipts.map(rec => rec.toResponse()));
});

router.route('/').post(async (req, res) => {
  const { body } = req;
  const newReceipt = await receiptsService.create(body);
  res.status(OK).send(newReceipt.toResponse());
});

router.route('/:idMeal').put(async (req, res) => {
  const { body } = req;
  const newReceipt = await receiptsService.update({...body, idMeal: req.params.idMeal});
  res.status(OK).send(newReceipt.toResponse());
});

router.route('/:idMeal').delete(async (req, res) => {
  await receiptsService.remove(req.params.idMeal);
  res.status(OK);
});

module.exports = router;
