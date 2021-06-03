const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  currentWordIndex : {
    type : Number,
    default : 0
  },
  socketID : {type : String}
})