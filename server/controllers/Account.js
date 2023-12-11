const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const changePasswordPage = (req, res) => res.render('changePassword');

// logs the user out by destroying the session and redirecting to the home page
const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

// check the users username and passwor field and log them in if correct
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/homePage' });
  });
};

// adds a new users data to the database
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/homePage' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Changes the password with a new password
// requies the user to be logged in an type the correct information
const changePassword = (req, res) => {
  const currentPassword = `${req.body.pass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;
  const { username } = req.session.account;

  if (!currentPassword || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  let doc;

  return Account.authenticate(username, currentPassword, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'This is not your current password!' });
    }

    try {
      doc = await Account.findOne({ username }).exec();
      if (!doc) {
        return res.status(500).json({ error: 'User was not found!' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'An error occured!' });
    }

    try {
      const hash = await Account.generateHash(newPass);
      doc.password = hash;
      await doc.save();

      req.session.destroy();
      return res.json({ redirect: '/' });
    } catch (error) {
      return res.status(500).json({ error: 'Error updating password!' });
    }
  });
};

// helper function to check if the user is logged in
const checkLoggedIn = (req, res) => {
  if (req.session.account) {
    console.log(req.session.account._id);
    return res.json({ loggedIn: true });
  }

  console.log('user is logged out');
  return res.json({ loggedIn: false });
};

// get the id of the current user if they are logged in
const getSessionId = (req, res) => {
  if (req.session.account) {
    return res.json({ _id: req.session.account._id });
  }

  return res.status(500).json({ error: 'There was a problem getting session or user is logged out' });
};

module.exports = {
  loginPage,
  changePasswordPage,
  login,
  logout,
  signup,
  changePassword,
  checkLoggedIn,
  getSessionId,
};
