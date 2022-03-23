const { OK } = require('http-status-codes');
const router = require('express').Router();

const platformsService = require('./platforms.service');

router.post('/', async (req, res) => {
  const platformEntity = await platformsService.save(req.body);
  res.status(OK).send(platformEntity.toResponse());
});

router.get('/', async (req, res) => {
  const platformEntity = await platformsService.getAll();
  res.status(OK).send(platformEntity.map(nest => nest.toResponse()));
});

router.get( '/:id', async (req, res) => {
    const platformEntity = await platformsService.get(req.params.id);
    res.status(OK).send(platformEntity.toResponse());
  }
);

router.get( '/status/:status', async (req, res) => {
    const platformEntity = await platformsService.getList("status", req.params.status);
    res.status(OK).send(platformEntity.map(nest => nest.toResponse()));
  }
);

router.get( '/creater/:creater', async (req, res) => {
    const platformEntity = await platformsService.getList("creater", req.params.creater);
    res.status(OK).send(platformEntity.map(nest => nest.toResponse()));
  }
);

router.get( '/region/:region', async (req, res) => {
    const platformEntity = await platformsService.getList("region", req.params.region);
    res.status(OK).send(platformEntity.map(nest => nest.toResponse()));
  }
);

router.get( '/province/:province', async (req, res) => {
    const platformEntity = await platformsService.getList("province", req.params.province);
    res.status(OK).send(platformEntity.map(nest => nest.toResponse()));
  }
);

router.put( '/:id', async (req, res) => {
    const platformEntity = await platformsService.update(req.params.id, req.body);
    res.status(OK).send(platformEntity.toResponse());
  }
);

module.exports = router;
