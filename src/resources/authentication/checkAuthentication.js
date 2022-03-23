const jwt = require('jsonwebtoken');
const {
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY
} = require('../../common/config');
const { AUTHORIZATION_ERROR } = require('../../errors/appErrors');

const ALLOWED_PATHS = ['/signin', '/platforms', '/users/recovery'];
const DOC_PATH_REGEX = /^\/doc\/?$/;
const DOC_PATH_RESOURCES_REGEX = /^\/doc\/.+$/;
const QUESTION_PATH_REGEX = /^\/platforms.*$/;
const RECOVERY_PATH_REGEX = /^\/users\/recovery.*$/;
const USERS_PATH = '/users';

function isOpenPath(path) {
  return (
    ALLOWED_PATHS.includes(path) ||
    DOC_PATH_REGEX.test(path) ||
    DOC_PATH_RESOURCES_REGEX.test(path) ||
    QUESTION_PATH_REGEX.test(path) ||
    RECOVERY_PATH_REGEX.test(path)
  );
}

const checkAuthentication = (req, res, next) => {
  if (isOpenPath(req.path)) {
    return next();
  }

  if (req.path === USERS_PATH) {
    if (req.method === 'GET' || req.method === 'POST') return next();
  }

  const rawToken = req.headers.authorization;
  if (!rawToken) {
    throw new AUTHORIZATION_ERROR();
  }

  try {
    const token = rawToken.slice(7, rawToken.length);
    const secret = req.path.includes('tokens')
      ? JWT_REFRESH_SECRET_KEY
      : JWT_SECRET_KEY;
    const { id, tokenId } = jwt.verify(token, secret);
    req.userId = id;
    req.tokenId = tokenId;
  } catch (error) {
    throw new AUTHORIZATION_ERROR();
  }

  next();
};

module.exports = checkAuthentication;
