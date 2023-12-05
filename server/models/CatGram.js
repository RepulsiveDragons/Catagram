const mongoose = require('mongoose');

const CatGramSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  comments: [String],
  name: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
  },
  likes: {
    type: Number,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const CatGramModel = mongoose.model('CatGram', CatGramSchema);
module.exports = CatGramModel;
