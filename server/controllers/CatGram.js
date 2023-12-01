const models = require('../models');

const { CatGram } = models;

const homePage = async (req, res) => res.render('app');

const postCatGram = async (req, res) => {
  if (!req.files || !req.files.mediaFile) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const { mediaFile } = req.files;
  console.log(mediaFile);

  const catPost = {
    text: req.body.textInput,
    name: req.files.mediaFile.name,
    data: req.files.mediaFile.data,
    size: req.files.mediaFile.size,
    mimetype: req.files.mediaFile.mimetype,
    likes: 0,
  };

  try {
    const newCatGram = new CatGram(catPost);
    const doc = await newCatGram.save();
    return res.status(201).json({
      message: 'File stored successfully!',
      fileId: doc._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Something went wrong uploading file!',
    });
  }
};

const retrieveGram = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    doc = await CatGram.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  res.set({
    'Content-Type': doc.mimetype,
    'Content-Length': doc.size,
    'Content-Disposition': `filename="${doc.name}"`, /* `attachment; filename="${doc.name}"` */
  });
  return res.send(doc.data);
};

const getGrams = async (req, res) => {
  try {
    const docs = await CatGram.find().select('text _id mimetype likes').lean().exec();

    return res.json({ grams: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving grams!' });
  }
};

const updateLikes = async (req, res) => {
  let doc;
  try {
    doc = await CatGram.findOneAndUpdate(
      { _id: req.body._id },
      { $inc: { likes: req.body.signedNum } },
    ).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'No post was found' });
  }

  return res.status(201).json({
    message: 'Likes updated on the server',
  });
};

module.exports = {
  homePage,
  postCatGram,
  retrieveGram,
  getGrams,
  updateLikes,
};
