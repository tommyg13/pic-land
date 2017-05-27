const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/* Create User model */
let imageSchema = mongoose.Schema({
  id:           ObjectId,
  description : {type: String, required: '{PATH} is required.'},
  url:          {type: String, required: '{PATH} is required.' },
  user:         {type: String, required: '{PATH} is required.' },
  comments:     Array,
  category:     String,
  userAvatar:   String,
  likedBy:      Array,
  likeClass:    {type:Boolean,default:false}
});


module.exports = mongoose.model('Image', imageSchema);
