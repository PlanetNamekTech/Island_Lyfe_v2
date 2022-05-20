const Island = require('../models/island');

module.exports.index = async(req, res) => {
  const islands = await Island.find({});
  res.render('islands/index', { islands });
}

module.exports.renderNewForm = (req, res) => {
  res.render('islands/new')
}

module.exports.createIsland = async(req,res) => {
  const island = new Island(req.body.island);
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
  const island = await Island.findByIdAndUpdate(id, {...req.body.island});
  req.flash('success', 'Successfully updated island!');
  res.redirect(`/islands/${island._id}`);
}

module.exports.deleteIsland = async(req, res) => {
  const { id } = req.params;
  await Island.findByIdAndDelete(id);
  req.flash('success', 'Island successfully deleted');
  res.redirect('/islands');
}