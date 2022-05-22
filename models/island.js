const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema


const ImageSchema = new Schema ({
  url: String,
  filename: String
})
ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_250')
})
const IslandSchema = new Schema({
  title: String,
  images: [ImageSchema],
  description: String,
  location: String,
  hemisphere: String, 
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

IslandSchema.post('findOneAndDelete', async function(info) {
  if(info){
    await Review.deleteMany({
      _id: {
        $in: info.reviews
      }
  })
  }
})

module.exports = mongoose.model("Island", IslandSchema);

