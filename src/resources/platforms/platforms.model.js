const mongoose = require('mongoose');
const { addMethods } = require('../../utils/toResponse');
const Schema = mongoose.Schema;

const Platform = new Schema(
  {
    region: {
      type: Number,
      default: 1
    },
    province: {
      type: String,
      default: ''
    },
    place: {
      type: String,
      default: ''
    },
    regNum: {
      type: String,
      default: ''
    },
    LEP: {
      type: String,
      default: ''
    },
    coordinates: {
      type: String,
      default: '',
      unique: true
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    files: {
      type: Object,
      default: []
    },
    history: {
      type: Object,
      default: []
    },
    creater: {
      type: String,
      default: 'someone'
      } 
  },
  { collection: 'platforms' }
);

addMethods(Platform);

module.exports = mongoose.model('platform', Platform);
