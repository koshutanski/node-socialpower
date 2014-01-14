describe("user api", function(){
  var request = require("request")
  var helpers = require("../helpers")
  it("starts", helpers.startApiHttpServer)

  it("registers new user", function(next){
    request.post({
      uri: helpers.apiendpoint+"/users/register",
      json: {
        username: "testuser",
        password: "test"
      }
    }, function(err, res, body){
      expect(res.statusCode).toBe(200)
      expect(body.result._id).toBeDefined()
      next()
    })
  })

  it("logout user", function(next){
    request.get({
      uri: helpers.apiendpoint+"/users/me/logout",
      json: {}
    }, function(err, res, body){
      expect(res.statusCode).toBe(200)
      next()
    })
  })

  it("login user", function(next){
    request.get({
      uri: helpers.apiendpoint+"/users/me/login",
      json: {
        username: "testuser",
        password: "test"
      }
    }, function(err, res, body){
      expect(res.statusCode).toBe(200)
      expect(body.result._id).toBeDefined()
      expect(body.result.username).toBe("testuser")
      expect(body.result.password).not.toBeDefined()
      next()
    })
  })

   it("user send message and increment points", function(next){
    request.get({
      uri: helpers.apiendpoint+"/users/me/login",
      json: {
        username: "testuser",
        password: "test"
      }
    }, function(err, res, body){
      expect(res.statusCode).toBe(200)
      expect(body.result._id).toBeDefined()
      expect(body.result.username).toBe("testuser")
      expect(body.result.password).not.toBeDefined()
      
 request.get({
      uri: helpers.apiendpoint+"/messages/send",
      json: {
        message:"test message"
      }
    }, function(messageErr, messageRes, messageBody){
      expect(messageRes.statusCode).toBe(200)
      expect(messageBody.result._id).toBeDefined()
    })
next()
    })
  })

  it("stops", helpers.stopApiHttpServer)
  
})