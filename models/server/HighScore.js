var mongoose = require("mongoose");

var HighScore = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId }],
  points:{type:Number, required: true},
  date: {type:Date, required:true}
})

HighScore.static("saveHighScoreForTheDay", function(users,currentDay, callback) {
  this.create( {users: users.select("id"),
points: users[0].points,
date: currentDay}  ,function(err, highScore){
if(err)callback(err);

callback(highScore);
})
})


module.exports = mongoose.model("HighScore", HighScore);