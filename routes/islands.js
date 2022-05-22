const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const Island = require('../models/island');
const { isLoggedIn, isAuthor, validateIsland } = require('../middleware');
const islands = require('../controllers/islands');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// router.get('/', (req, res) => {
//   res.render('home')
// });

router.route('/')
  .get(catchAsync(islands.index))
  .post(isLoggedIn, upload.array('image'), validateIsland, catchAsync(islands.createIsland));

router.get('/new', isLoggedIn, islands.renderNewForm)

router.route('/:id')
  .get(catchAsync(islands.showIsland))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateIsland, catchAsync(islands.updateIsland))
  .delete(isLoggedIn, isAuthor, catchAsync(islands.deleteIsland))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(islands.renderEditForm))

module.exports = router;