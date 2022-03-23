require('dotenv').config({ path: '../.test.env' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const ITERATION = 5;

const { 
  routes,
} = require('./helpers/constants');

// const { messages, errors } = require('../constans/responses');

chai.should();
chai.use(chaiHttp);

describe('receipts API', () => {
  describe('/rec', async () => {
    for ( let i = 0; i < ITERATION; i++ ) {
      it('Should пуе a receipts from database',
        (done) => {
          const body = { search: ['strMeal', 'о'], page: i, perPage: 100 };
          chai
            .request(server)
            .get(routes.receipts)
            .send(body)
            .end(async (err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              console.log(response.body.count, response.body.receipts[0].idMeal);
              done();
            });
        }
      );
    }
    // for ( let j = 0; j < tradeObjects.length; j++ ) {
    //   let tradeObjectId = tradeObjects[j];
    //   const where = { tradeObjectId };
    //   it('Should not create a new items in warehouse because douplicated productId',
    //     (done) => {
    //       const body = { tradeObjectId, ids: [...productIds[j]] }
    //       chai
    //         .request(server)
    //         .post(routes.warehouse)
    //         .set("Authorization", "Bearer " + token)
    //         .send(body)
    //         .end(async (err, response) => {
    //           if (userTradeObjectsIds.indexOf(tradeObjectId) !== -1) {
    //             response.should.have.status(204);
    //             response.body.should.be.a('object');
    //             const res = await Warehouse.findAndCountAll({ where });
    //             const trObj = { count: 0, ids: [], items: [] };
    //             if (res) {
    //               if (res.rows) trObj.ids = res.rows.map(el => el.productId).sort((a, b) => a - b);
    //               if (res.rows) trObj.items = res.rows;
    //               if (res.count) trObj.count = res.count;
    //               tradeObjectsLength2[j] = trObj;
    //             }
    //             trObj.count.should.be.equal(productIds[j].length);
    //             trObj.ids.should.be.to.deep.equal([...productIds[j]].sort((a, b) => a - b));
    //           } else {
    //             response.should.have.status(403);
    //             response.body.should.be.a('object');
    //             response.body.should.be.to.deep.equal({
    //               message: `${errors.notHaveAccess}`,
    //               payload: {}
    //             })

    //           }
    //           done();
    //         });
    //     }
    //   );
    // }
  })
})
