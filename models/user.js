const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema); 
// Mongoose will automatically lowercase and pluralize model i.e 'users'