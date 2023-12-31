const models = require('../models');

const { CatGram } = models;

const homePage = async (req, res) => res.render('app');

const galleryPage = async (req, res) => res.render('gallery');

// uploads the users gram to the database
// must take in a file
const postCatGram = async (req, res) => {
  if (!req.files || !req.files.mediaFile) {
    return res.status(400).json({ error: 'You need to upload a file before posting' });
  }

  const { mediaFile } = req.files;

  if (mediaFile.mimetype !== 'image/png'
  && mediaFile.mimetype !== 'image/jpeg'
  && mediaFile.mimetype !== 'image/gif'
  && mediaFile.mimetype !== 'video/mp4') {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }

  const catPost = {
    text: req.body.textInput,
    user: req.session.account.username,
    user_id: req.session.account._id,
    name: mediaFile.name,
    data: mediaFile.data,
    size: mediaFile.size,
    mimetype: mediaFile.mimetype,
    likes: 0,
    comments: [],
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
      error: 'Something went wrong uploading file or file was too big',
    });
  }
};

// A get request to retrieve the media information from a specific post
// takes in a query resquest
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
    'Content-Disposition': `filename="${doc.name}"`,
  });
  return res.send(doc.data);
};

// Returns all the available catgrams from the database
const getGrams = async (req, res) => {
  try {
    const docs = await CatGram.find().select('text user user_id _id mimetype likes comments').lean().exec();

    return res.json({ grams: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving grams!' });
  }
};

// Similar to getGrams but this function takes in a query of a specific users id
// and returns only that users catgrams
const getGalleryGrams = async (req, res) => {
  if (!req.query.user_id) {
    return res.status(400).json({ error: 'Missing user id!' });
  }

  try {
    const docs = await CatGram.find({ user_id: req.query.user_id }).exec();

    return res.json({ grams: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving grams!' });
  }
};

// Increment or decrement the amount of likes of a catgram in the database
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

// posts the users comment into a specific catgram
const postComment = async (req, res) => {
  if (!req.session.account) {
    return res.status(400).json({ error: 'Need to be logged in to make comments' });
  }

  let doc;
  console.log(req.body._id);
  console.log(req.body.comment);
  try {
    doc = await CatGram.findOneAndUpdate(
      { _id: req.body._id },
      { $push: { comments: `${req.session.account.username}: ${req.body.comment}` } },
    ).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'No post was found' });
  }

  return res.status(201).json({
    message: 'comment added to post',
  });
};

// returns the list of comments on the catgram
const getComments = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    doc = await CatGram.findOne({ _id: req.query._id }).select('comments _id').lean().exec();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }
  return res.json({ comments: doc.comments, _id: doc._id });
};

module.exports = {
  homePage,
  postCatGram,
  retrieveGram,
  getGrams,
  updateLikes,
  postComment,
  getComments,
  galleryPage,
  getGalleryGrams,
};
