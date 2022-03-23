const { OK, NO_CONTENT } = require('http-status-codes');
const router = require('express').Router();

const userService = require('./user.service');
const { id, user } = require('../../utils/validation/schemas');
const {
  validator,
  userIdValidator,
  adminIdValidator
} = require('../../utils/validation/validator');

router.post('/', async (req, res) => {
  const userEntity = await userService.save(req.body);
  res.status(OK).send(userEntity.toResponse());
});

router.get('/', async (req, res) => {
  // const reg = req.body.reg ? req.body.reg : { rated: true, score: {$gt: 0} };
  const users = await userService.get();
  const rating = [];
  users.forEach(user => rating.push({fullname: user.fullname, score: user.score}));
  res.status(OK).send(rating);
});

router.get('/all/:id',
  adminIdValidator,
  validator(id, 'params'),
  async (req, res) => {
  const users = await userService.get();
  const rating = [];
  users.forEach(user => {
    rating.push({
      nickname: user.nickname,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      organization: user.organization,
      position: user.position,
      score: user.score
      })});
  res.status(OK).send(rating.sort((a, b) => b.score - a.score));
});

router.post('/recovery/:email', async (req, res) => {
  await userService.recovery(req.params.email);
  res.status(OK).send({status: 200, statusText: "OK"});
});

router.get( '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    const userEntity = await userService.getId(req.params.id);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.put( '/:id',
  userIdValidator,
  validator(id, 'params'),
  validator(user, 'body'),
  async (req, res) => {
    const userEntity = await userService.update(req.userId, req.body);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.delete(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    await userService.remove(req.params.id);
    res.sendStatus(NO_CONTENT);
  }
);

module.exports = router;
