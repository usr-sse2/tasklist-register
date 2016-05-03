var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
var Cursor = mongodb.Cursor;
var Promise = require('bluebird');

Promise.promisifyAll(Collection.prototype);
Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Cursor.prototype);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var dbConnection;
MongoClient.connectAsync('mongodb://heroku_5rd2876w:ook8c2lhdgt4023eb730psvtrv@ds035663.mlab.com:35663/heroku_5rd2876w')
.then(function(db) {
	dbConnection = db;
})
.catch(function(e) {
	console.log(e);
	process.exit(e.code);
});

app.post('/register', function(req, res) {
	dbConnection.collection('usercollection').insertAsync({
        "login" : req.body.login,
    	"password" : req.body.password
	 })
	 .then(function() {
		res.write('Registration successful\n');
		res.write('Your login: ' + req.body.login + '\n');
		res.write('Your password: ' + req.body.password + '\n');
		res.end();
    })
    .catch(function(e) { return typeof(e) == mongodb.WriteError && e.code == 11000; }, function() {
    	res.send("Already registered");
    	res.end();
    })
    .catch(function(e) {
        res.write("There was a problem adding the information to the database:\n");
		res.write(e.toString());
		res.end(); 
    });
});
app.use(express.static(__dirname + '/html'));
app.listen(process.env.PORT);