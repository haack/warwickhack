var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;



var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('gameState', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'gameState' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
 
exports.add = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.insert(req.body, function (error, documentInserted)
        {
            res.send({"id": documentInserted._id});
        });
    });
}

exports.getByID = function(req, res) {
    db.collection('users', function(err, collection) {
        var userObject = collection.findOne({"id": req.body.id});
        res.send(userObject);
    });
}

exports.getAll = function (req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
}

var populateDB = function() {
    var users = [
    {
        id: "1",
        name: "A",
        password: "fuckitshipit",
        score: "500"
    },
    {
        id: "2",
        name: "B",
        password: "fuckitshipit",
        score: "500"
    }];
        db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
}
