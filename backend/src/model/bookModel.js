const mongoose = require('mongoose');
const objId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  excerpt: {
    type: String,
    require: true,
  },
  userId: {
    type: objId,
    ref: "userDetails",
    require: true,
  },
  ISBN: {
    type: String,
    require: true,
    unique: true,
  },
  category: {
    type: String,
    require: true,
  },
  subcategory: {
    type: String,
    require: true,
  },
  reviews: {
    type: Number,
    default: 0,
    Comment: "Holds number of reviews of this book",
  },
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  releasedAt : {
    type : Date,
    require : true
  }
},{timestamp:true});


module.exports = mongoose.model("bookModel",bookSchema);