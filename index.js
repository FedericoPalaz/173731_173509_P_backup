//express
var express=require('express');

//init express
var app=express();

//for templates
var bind = require('bind');

//manages sessions
var session = require('express-session')

//include dataBase Manager
var dataBase=require('./modules/database.js');

//use sessions
app.use(session({ 
	//required, used to prevent tampering
	secret: 'string for the hash', 
	//set time of validity of cookies
	cookie: { maxAge: 60000 }
}));


//pg
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://dbSW:password@localhost:5432/dbSW';

//for POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//listen in a specific port
app.set('port', (process.env.PORT || 5000));

//mount middlewear (allow to show static files)
app.use('/public',express.static(__dirname+'/public'));

/**
 * @brief Appena apri l'applicazione
 * @return la pagina di login.
 */
app.get('/',function (req,res) {
    
        res.redirect('public/tpl/login.html');
});

app.get('/prova',function (req,res) {
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        console.log("Errore Connessione DB");
      }
      client.query('SELECT cf FROM users where email=$1;',['mario.rossi@gmail.it'], function (err, result) {
        if (err) {
          console.log("isExistsUser Select Error: "+err.message);
        }
        else{
          if(result.rowCount>0){
            res.send("Esiste");
          }
          else
            res.send("NON Esiste");
        }
        done();
      });
    });
});



/**
 * @brief log out page
 * @return a page with notification that user is logged out, or a page which says that the user is already logged out.
 */
app.get('/logout', function(request, response) 
{
	var text = "";
	
	//check if the session exists
	if (request.session.user_id !=null) 
	{    	
		request.session.user_id = null;
  	}
	else
	{
		text = 'You are already logged out';
	}
	
	//write response
    res.redirect('public/tpl/login.html');
});

//app start listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

});

