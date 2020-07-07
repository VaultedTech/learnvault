const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedcollections:
    [{ type: String }]
  ,
});

module.exports = mongoose.model('UserOriginal', userSchema);
