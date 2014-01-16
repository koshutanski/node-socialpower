var express = require('express');
var MongoStore = require('connect-mongo')(express);
var routes = require('./routes');
var mongoose = require("mongoose");
var path = require('path');
var User = require("../../models/server/User");
var HighScore = require("../../models/server/HighScore");

module.exports = function(){
  this.app = express();  
}

module.exports.prototype.start = function(config, next) {
  var app = this.app
  var self = this

  this.session_store = new MongoStore({
    db: config.db.name
  })

  app.configure(function(){
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser(config.secret));
    app.use(express.session({
      secret: config.secret,
      store: this.session_store
    }));
    app.use(app.router);
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  mongoose.connect(config.db.host+"/"+config.db.name, function(err){
    if(err) throw err
    routes.mount(app)
    self.server = app.listen( process.env.PORT || config.port || 3000 , next)
  })


  var cronJob = require('cron').CronJob;
var job = new cronJob('00 00 00 * * 1-7', function(){
    //find player with the highest score
    //clear all points
    //save it in the database
 
User.findUsersWithHighScore(function(err, users){
 if(err) throw err;
  var date = new Date();
HighScore.saveHighScoreForTheDay(users,date, function(err, highScore){
if(err) console.log(err);

})

})
  }, function () {
    // This function is executed when the job stops
  }, 
  true /* Start the job right now */,
);

}

module.exports.prototype.stop = function(next){
  var self = this
  this.server.close(function(){
    self.session_store.db.close(function(){
      mongoose.disconnect(next)    
    })
  })
}

if(!module.parent) {
  var api = new module.exports()
  api.start("require("./config/local.json))
}
