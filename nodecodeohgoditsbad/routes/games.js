var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;



var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('gameState', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'gameState' database");
        db.collection('games', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'games' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 


exports.getGamesWithUser = function(req, res) {
    var playerId = req.body.id;
    var gamesWherePlayerId1;
    var gamesWherePlayerId2;
    db.collection('games', function(err, collection) {
        gamesWherePlayerId1 = collection.find({"player1ID": playerId});
        gamesWherePlayerId2 = collection.find({"player2ID": playerId});
    });

    res.send({ $setUnion: [gamesWherePlayerId1, gamesWherePlayerId2]});
}

exports.cashout = function(req, res) {
    var game;
    db.collection('games', function(err, collection) {
        game = collection.findOne({"id": req.body.id});
    });
    var playerNotBeingShaftedID = game.player_control ? game.player1ID : game.player2ID;
    var playerBeingShaftedID = game.player_control ? game.player2ID: game.player1ID;
    db.collection('users', function(err, collection) {
            var playerBeingShafted = collection.findOne({"id": playerBeingShaftedID});
            var playerBeingShaftedOldScore = playerBeingShafted.score;
            var playerBeingShaftedNewScore = playerBeingShafted.score - game.pot;
            var playerNotBeingShafted = collection.findOne({"id": playerNotBeingShaftedID});
            var playerNotBeingShaftedOldScore = playerNotBeingShafted.score;
            var playerNotBeingShaftedNewScore = playerNotBeingShafted.score + game.pot;
            collection.update({"id": playerBeingShaftedID}, {"score":  playerBeingShaftedNewScore});
            collection.update({"id": playerNotBeingShaftedID}, {"score": playerNotBeingShaftedNewScore});
        });
    // delete game record
    db.collection('games', function(err, collection) {
        collection.delete({"id": req.body.id});
    });
    res.send({"id": playerNotBeingShafted});
}

exports.raise = function(req, res) {
    var game;
    db.collection('games', function(err, collection) {
        game = collection.findOne({"id": req.body.id});
        collection.update({"id": req.body.id}, {"pot": (game.pot*2)});
    });

    var playerRaisingID = game.player_control ? game.player1ID : game.player2ID;
    var playerNotRaisingID = game.player_control ? game.player2ID: game.player1ID;
    db.collection('users', function(err, collection) {
            var playerRaising = collection.findOne({"id": playerRaisingID});
            var playerNotRaising = collection.findOne({"id": playerNotRaisingID});
        });
    // delete game record
    db.collection('games', function(err, collection) {
        collection.update({"id": req.body.id}, {"player_control": !game.player_control});
    });
    res.send({"id": playerNotBeingShafted});
}

exports.get = function(req,res)
{
    db.collection('games', function(err, collection) {
        var game = collection.findOne({"player1ID": req.body.player1ID, "player2ID": req.body.player2ID});
        res.send({"id": game.id});
    });
}




var populateDB = function() {
    var games = [
    {
        player_control: true, // true if it's player 1's turn, false otherwise.
        playerOneId: "1",
        playerTwoId: "2"
    },
    {
        player_control: true, // true if it's player 1's turn, false otherwise.
        playerOneId: "1",
        playerTwoId: "2"
    }];
        db.collection('games', function(err, collection) {
        collection.insert(games, {safe:true}, function(err, result) {});
    });
}