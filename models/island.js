const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema

const IslandSchema = new Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  hemisphere: String, 
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

