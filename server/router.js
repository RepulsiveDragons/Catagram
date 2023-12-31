const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/changePassword', mid.requiresLogin, controllers.Account.changePasswordPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/checkLoggedIn', controllers.Account.checkLoggedIn);
  app.get('/getSessionId', mid.requiresLogin, controllers.Account.getSessionId);

  app.get('/homePage', controllers.CatGram.homePage);
  app.get('/gallery', mid.requiresLogin, controllers.CatGram.galleryPage);
  app.post('/postGram', mid.requiresLogin, controllers.CatGram.postCatGram);
  app.post('/postComment', mid.requiresLogin, controllers.CatGram.postComment);

  app.get('/retrieveGram', controllers.CatGram.retrieveGram);
  app.get('/getGrams', controllers.CatGram.getGrams);
  app.get('/getGalleryGrams', mid.requiresLogin, controllers.CatGram.getGalleryGrams);
  app.get('/getComments', controllers.CatGram.getComments);
  app.post('/updateLikes', mid.requiresLogin, controllers.CatGram.updateLikes);

  app.get('/', mid.requiresSecure, controllers.CatGram.homePage);
};

module.exports = router;
