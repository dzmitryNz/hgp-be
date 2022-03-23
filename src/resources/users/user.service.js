const bcrypt = require('bcrypt');
const usersRepo = require('./user.db.repository');
const tokenService = require('../token/token.service');
const settingsService = require('../settings/setting.service');
const statisticService = require('../statistics/statistic.service');
const { AUTHENTICATION_ERROR } = require('../../errors/appErrors');

const authenticate = async user => {
  const userEntity = await usersRepo.getUserByEmail(user.email);

  const isValidated = await bcrypt.compare(user.password, userEntity.password);
  if (!isValidated) {
    throw new AUTHENTICATION_ERROR();
  }

  const tokens = await tokenService.getTokens(userEntity._id);

  return {
    ...tokens,
    userId: userEntity._id,
    email: userEntity.email,
    nickname: userEntity.nickname,
    score: userEntity.score,
    fullname: userEntity.fullname,
    position: userEntity.position,
    organization: userEntity.organization,
    phone: userEntity.phone,
    rated: userEntity.rated,
    verified: userEntity.verified
  };
};

const get = (reg) => usersRepo.get(reg);

const getId = id => usersRepo.getId(id);

const save = user => usersRepo.save(user);

const recovery = email => usersRepo.recovery(email);

const update = (id, user) => usersRepo.update(id, user);

const remove = async id => {
  await statisticService.remove(id);
  await settingsService.remove(id);
  await usersRepo.remove(id);
};

module.exports = { 
  authenticate,
  get,
  getId,
  save,
  update,
  remove,
  recovery,
};
