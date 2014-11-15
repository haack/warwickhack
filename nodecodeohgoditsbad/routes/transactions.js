var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('gameState', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'gameState' database");
        db.collection('transactions', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'transactions' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
// exports.findById = findTransaction;
 
// function findTransaction(req, res) {
//     var id = req.params.id;
//     console.log('Retrieving transaction: ' + id);
//     db.collection('transactions', function(err, collection) {
//         collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
//             res.send(item);
//         });
//     });

// };

exports.findAll = function(req, res) {
    db.collection('transactions', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    return collection.add(req.body);
}


 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var transactions = [
    {
        receiverID: "1",
        senderID: "2",
        amount: "300",
        timedateStamp: "15/11/14.15:00"
    },
    {
        receiverID: "2",
        senderID: "1",
        amount: "600",
        timedateStamp: "15/11/14.15:00"
    }];
 
    db.collection('transactions', function(err, collection) {
        collection.insert(transactions, {safe:true}, function(err, result) {});
    });
 
};