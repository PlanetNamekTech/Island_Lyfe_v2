const mongoose = require('mongoose');
const Schema = mongoose.Schema

const IslandSchema = new Schema({
  title: String,
  description: String,
  location: String,
  hemisphere: String, 
});

module.exports = mongoose.model("Island", IslandSchema);