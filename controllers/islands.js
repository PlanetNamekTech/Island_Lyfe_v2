const { cloudinary } = require('../cloudinary'),
      Island = require('../models/island'),
      mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'),
      mapBoxToken = process.env.MAPBOX_TOKEN,
      geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async(req, res) => {
  const islands = await Island.find({});
  res.render('islands/index', { islands });
}

module.exports.renderNewForm = (req, res) => {
  res.render('islands/new')
}

module.exports.createIsland = async(req,res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.island.location,
    limit: 1
  }).send()
  const island = new Island(req.body.island);
  island.geometry = geoData.body.features[0].geometry;
  island.images = req.files.map(file => ({url: file.path, filename: file.filename}))
  island.author = req.user._id; // When a new island is added, it is associated with the current user
  await island.save();
  req.flash('success', 'Successfully added island!');
  res.redirect(`/islands/${island._id}`)
}

module.exports.showIsland = async(req,res) => {
  const island = await Island.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if(!island){
    req.flash('error', 'Cannot locate desired island');
    res.redirect('/islands');
  }
  res.render('islands/show', { island });
}

module.exports.renderEditForm = async(req,res) => {
  const island = await Island.findById(req.params.id);
  if(!island){
    req.flash('error', 'Cannot locate desired island');
    res.redirect('/islands');
  }
  res.render('islands/edit', { island });
}

module.exports.updateIsland = async(req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const island = await Island.findByIdAndUpdate(id, {...req.body.island});
  const imgs = req.files.map(file => ({url: file.path, filename: file.filename}))
  island.images.push(...imgs);
  await island.save();
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    console.log(island);
  }
  req.flash('success', 'Successfully updated island!');
  res.redirect(`/islands/${island._id}`);
}

module.exports.deleteIsland = async(req, res) => {
  const { id } = req.params;
  await Island.findByIdAndDelete(id);
  req.flash('success', 'Island successfully deleted');
  res.redirect('/islands');
}