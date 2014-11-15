var express = require('express'),
	transactions = require('./routes/transactions.js'),
	users = require('./routes/users.js'),
	games = require('./routes/games.js');
var app = express();
 

 app.configure(function() {
 	app.use(express.logger('dev'));
 	app.use(express.bodyParser());
 });

//app.get('/transactions/:id', transactions.findById); 
app.get('/transactions/findAll', transactions.findAll);




app.post('/users/add', users.add);  // returns user id
									// receives entire user object
app.get('/users/:id', users.getByID); // returns user object; 
									// receives user id
app.get('/users/getAll', users.getAll); // return all data about all the users;
									// receives nothing
app.get('/games/:id', games.getGamesWithUser); // returns all the games in which the user is a participant as an array of game 
									// receives userid
app.get('/games/cashout/:id', games.cashout); // player id cashes out
									// receives game id
app.get('/games/raise/:id', games.raise); // player id raises. 
									// receives game id
app.get('/games/:player1id/:player2id', games.get); // returns game id
									// receives two player ids 


app.listen(3000);
console.log('Listening on port 3000...');